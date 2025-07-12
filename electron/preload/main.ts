import { contextBridge } from "electron";

console.log("PRELOAD FILE")

contextBridge.exposeInMainWorld('core', {
  ping: () => {console.log("PONG")}
})