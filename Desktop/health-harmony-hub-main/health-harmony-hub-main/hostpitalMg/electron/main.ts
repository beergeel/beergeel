import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { promises as fs } from 'fs';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

// Fix for Windows DPI/Display Issues
if (process.platform === 'win32') {
  // Enable high DPI support
  app.commandLine.appendSwitch('high-dpi-support', '1');
  // Force device scale factor to be consistent
  app.commandLine.appendSwitch('force-device-scale-factor', '1');
  // Disable font scaling issues
  app.commandLine.appendSwitch('disable-features', 'VizDisplayCompositor');
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling
try {
  if (require('electron-squirrel-startup')) {
    app.quit();
  }
} catch (e) {
  // electron-squirrel-startup may not be installed, which is fine
}

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
      // Fix display/rendering issues
      enableBlinkFeatures: 'CSSColorSchemeUARendering',
      // Improve font rendering
      offscreen: false,
    },
    // Fix for Windows display scaling
    backgroundColor: '#f0f4f8', // Match app background color
    // Enable native window frame for better DPI handling
    frame: true,
    // Better visual quality on high DPI displays
    useContentSize: true,
    // Icon path - Windows will use default if not found
    icon: (() => {
      if (process.platform === 'win32') {
        if (app.isPackaged) {
          // In packaged app, icon is in resources/build/
          const iconPath = join(process.resourcesPath, 'build', 'icon.ico');
          if (existsSync(iconPath)) {
            return iconPath;
          }
        } else {
          // In development, icon is in build/ folder
          const iconPath = join(__dirname, '../build/icon.ico');
          if (existsSync(iconPath)) {
            return iconPath;
          }
          // Fallback to public/favicon.ico if build/icon.ico doesn't exist
          const fallbackPath = join(__dirname, '../public/favicon.ico');
          if (existsSync(fallbackPath)) {
            return fallbackPath;
          }
        }
      }
      return undefined;
    })(),
    titleBarStyle: 'default',
    show: false, // Don't show until ready
  });

  // Load the app
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    mainWindow.loadURL('http://localhost:8080');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from the dist folder
    // Use app.getAppPath() for proper path resolution in packaged app
    const appPath = app.getAppPath();
    const indexPath = join(appPath, 'dist', 'index.html');
    
    mainWindow.loadFile(indexPath).catch((err) => {
      console.error('Failed to load index.html:', err);
      console.error('Attempted path:', indexPath);
      console.error('App path:', appPath);
      console.error('__dirname:', __dirname);
    });
  }

  // Show window when ready to prevent visual flash
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    
    // Fix display scaling on Windows
    if (process.platform === 'win32') {
      // Set zoom factor to handle DPI scaling
      const scaleFactor = mainWindow?.webContents.getZoomFactor();
      if (scaleFactor && scaleFactor !== 1) {
        mainWindow?.webContents.setZoomFactor(1);
      }
    }
    
    // Focus on window creation
    if (isDev) {
      mainWindow?.focus();
    }
  });

  // Enable DevTools shortcut (Ctrl+Shift+I or F12) even in production for debugging
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if (input.key === 'F12' || (input.control && input.shift && input.key.toLowerCase() === 'i')) {
      if (mainWindow?.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools();
      } else {
        mainWindow?.webContents.openDevTools();
      }
    }
  });

  // Add menu with DevTools option
  const template: any[] = [
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Developer Tools',
          accelerator: 'F12',
          click: () => {
            if (mainWindow?.webContents.isDevToolsOpened()) {
              mainWindow.webContents.closeDevTools();
            } else {
              mainWindow?.webContents.openDevTools();
            }
          }
        },
        { type: 'separator' },
        { role: 'reload', label: 'Reload' },
        { role: 'forceReload', label: 'Force Reload' },
      ]
    }
  ];
  
  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// This method will be called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// File System Storage Setup
const getDataDirectory = () => {
  const userDataPath = app.getPath('userData');
  const dataDir = join(userDataPath, 'hospital-data');
  return dataDir;
};

const ensureDataDirectory = async () => {
  const dataDir = getDataDirectory();
  if (!existsSync(dataDir)) {
    await fs.mkdir(dataDir, { recursive: true });
  }
  return dataDir;
};

const getCollectionPath = (collection: string) => {
  return join(getDataDirectory(), collection);
};

const ensureCollectionDirectory = async (collection: string) => {
  const collectionPath = getCollectionPath(collection);
  if (!existsSync(collectionPath)) {
    await fs.mkdir(collectionPath, { recursive: true });
  }
  return collectionPath;
};

// IPC handlers for file system operations
ipcMain.handle('fs-init', async () => {
  try {
    await ensureDataDirectory();
    return { success: true, path: getDataDirectory() };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('fs-read', async (_event, collection: string, id: string, isBinary: boolean = false) => {
  try {
    await ensureCollectionDirectory(collection);
    const filePath = join(getCollectionPath(collection), `${id}${isBinary ? '' : '.json'}`);
    
    if (!existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }
    
    if (isBinary) {
      const data = await fs.readFile(filePath);
      const base64 = data.toString('base64');
      return { success: true, data: base64 };
    } else {
      const data = await fs.readFile(filePath, 'utf-8');
      return { success: true, data: JSON.parse(data) };
    }
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('fs-write', async (_event, collection: string, id: string, data: any, isBinary: boolean = false) => {
  try {
    await ensureCollectionDirectory(collection);
    const filePath = join(getCollectionPath(collection), `${id}${isBinary ? '' : '.json'}`);
    
    if (isBinary && typeof data === 'string') {
      // Data is base64 string, convert to buffer
      const buffer = Buffer.from(data, 'base64');
      await fs.writeFile(filePath, buffer);
    } else {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    }
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('fs-delete', async (_event, collection: string, id: string) => {
  try {
    const filePath = join(getCollectionPath(collection), `${id}.json`);
    
    if (!existsSync(filePath)) {
      return { success: false, error: 'File not found' };
    }
    
    await fs.unlink(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('fs-list', async (_event, collection: string) => {
  try {
    await ensureCollectionDirectory(collection);
    const collectionPath = getCollectionPath(collection);
    const files = await fs.readdir(collectionPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = join(collectionPath, file);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
      })
    );
    
    return { success: true, data: items };
  } catch (error) {
    return { success: false, error: String(error), data: [] };
  }
});

ipcMain.handle('fs-exists', async (_event, collection: string, id: string) => {
  try {
    const filePath = join(getCollectionPath(collection), `${id}.json`);
    return { success: true, exists: existsSync(filePath) };
  } catch (error) {
    return { success: false, error: String(error), exists: false };
  }
});

ipcMain.handle('fs-search', async (_event, collection: string, query: (item: any) => boolean) => {
  try {
    await ensureCollectionDirectory(collection);
    const collectionPath = getCollectionPath(collection);
    const files = await fs.readdir(collectionPath);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    const items = await Promise.all(
      jsonFiles.map(async (file) => {
        const filePath = join(collectionPath, file);
        const data = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(data);
      })
    );
    
    const filtered = items.filter(query);
    return { success: true, data: filtered };
  } catch (error) {
    return { success: false, error: String(error), data: [] };
  }
});

ipcMain.handle('fs-get-path', () => {
  return getDataDirectory();
});

// IPC handlers can be added here
ipcMain.handle('app-version', () => {
  return app.getVersion();
});

ipcMain.handle('app-name', () => {
  return app.getName();
});

