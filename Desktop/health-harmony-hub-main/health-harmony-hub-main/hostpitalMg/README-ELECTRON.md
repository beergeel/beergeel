# Hospital Management System - Electron Desktop Application

This is an Electron desktop application built with React, TypeScript, and Vite.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Development

### Running the application in development mode

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run electron:dev
```

This will:
- Compile the Electron main process TypeScript files
- Start the Vite dev server
- Launch the Electron app

### Building for production

1. Build the React app and compile Electron files:
```bash
npm run electron:build
```

2. Create distributable packages:
```bash
npm run electron:dist
```

This will create platform-specific installers in the `release` directory:
- Windows: NSIS installer (.exe)
- macOS: DMG file
- Linux: AppImage and .deb packages

## Project Structure

```
hostpitalMg/
├── electron/              # Electron main process files
│   ├── main.ts            # Main Electron process
│   └── preload.ts         # Preload script for secure IPC
├── src/                   # React application source
├── dist/                  # Built React app (generated)
├── electron-dist/        # Compiled Electron files (generated)
└── release/               # Built installers (generated)
```

## Scripts

- `npm run dev` - Start Vite dev server only (for web development)
- `npm run electron:dev` - Start Electron app in development mode
- `npm run electron:build` - Build React app and compile Electron files
- `npm run electron:compile` - Compile Electron TypeScript files only
- `npm run electron:dist` - Build and create distributable packages
- `npm run electron:pack` - Build and pack (same as dist)

## Building for Specific Platforms

### Windows
```bash
npm run electron:dist -- --win
```

### macOS
```bash
npm run electron:dist -- --mac
```

### Linux
```bash
npm run electron:dist -- --linux
```

## Configuration

### Electron Builder Configuration

The Electron Builder configuration is in `package.json` under the `build` key. You can customize:
- App ID and name
- Icons
- Installer options
- Target platforms

### Main Process

The main Electron process is in `electron/main.ts`. This file:
- Creates the browser window
- Handles app lifecycle events
- Sets up IPC communication
- Loads the React app

### Preload Script

The preload script (`electron/preload.ts`) exposes secure APIs to the renderer process using `contextBridge`.

## Troubleshooting

### Electron window doesn't open
- Make sure the Vite dev server is running on port 8080
- Check that `electron-dist/main.js` exists (run `npm run electron:compile`)

### Build fails
- Ensure all dependencies are installed: `npm install`
- Clear build directories: Delete `dist`, `electron-dist`, and `release` folders
- Try rebuilding: `npm run electron:build`

### TypeScript errors in Electron files
- Make sure `tsconfig.electron.json` is properly configured
- Run `npm run electron:compile` to see specific errors

## Notes

- The app uses IndexedDB for local data storage
- In development, the app loads from `http://localhost:8080`
- In production, the app loads from the built `dist/index.html` file
- The Electron main process is compiled to `electron-dist/` directory
- All paths are relative to ensure the app works when packaged

