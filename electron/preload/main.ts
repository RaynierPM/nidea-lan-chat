import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('core', {
  ping: () => {ipcRenderer.invoke('ping')}
})