import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  getVersion: () => ipcRenderer.invoke('app-version'),
  getName: () => ipcRenderer.invoke('app-name'),
  // File System APIs
  fsInit: () => ipcRenderer.invoke('fs-init'),
  fsRead: (collection: string, id: string, isBinary?: boolean) => ipcRenderer.invoke('fs-read', collection, id, isBinary),
  fsWrite: (collection: string, id: string, data: any, isBinary?: boolean) => ipcRenderer.invoke('fs-write', collection, id, data, isBinary),
  fsDelete: (collection: string, id: string) => ipcRenderer.invoke('fs-delete', collection, id),
  fsList: (collection: string) => ipcRenderer.invoke('fs-list', collection),
  fsExists: (collection: string, id: string) => ipcRenderer.invoke('fs-exists', collection, id),
  fsSearch: (collection: string, query: (item: any) => boolean) => ipcRenderer.invoke('fs-search', collection, query),
  fsGetPath: () => ipcRenderer.invoke('fs-get-path'),
});

// Type definitions for TypeScript
declare global {
  interface Window {
    electronAPI: {
      getVersion: () => Promise<string>;
      getName: () => Promise<string>;
      fsInit: () => Promise<{ success: boolean; path?: string; error?: string }>;
      fsRead: (collection: string, id: string, isBinary?: boolean) => Promise<{ success: boolean; data?: any; error?: string }>;
      fsWrite: (collection: string, id: string, data: any, isBinary?: boolean) => Promise<{ success: boolean; error?: string }>;
      fsDelete: (collection: string, id: string) => Promise<{ success: boolean; error?: string }>;
      fsList: (collection: string) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      fsExists: (collection: string, id: string) => Promise<{ success: boolean; exists?: boolean; error?: string }>;
      fsSearch: (collection: string, query: (item: any) => boolean) => Promise<{ success: boolean; data?: any[]; error?: string }>;
      fsGetPath: () => Promise<string>;
    };
  }
}

