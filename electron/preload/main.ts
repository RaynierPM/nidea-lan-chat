import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('core', {
  init: (username: string) => ipcRenderer.invoke('init', {username}),
  searchRooms: () => ipcRenderer.invoke('search:rooms'),
  connectRoom: (host: string, port: number, password?: string) => ipcRenderer.invoke("connect", {
    host,
    port,
    password
  }), 
})