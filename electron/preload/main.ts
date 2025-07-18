import { contextBridge, ipcRenderer } from "electron";
import { InitServerPayload } from "../main";
import { MessageActionPayload } from "../../server/lib/chat/Action/variants/MessageAction";
import { Event, EventActionTypes } from "../../common/interfaces/event.interface";

contextBridge.exposeInMainWorld('core', {
  init: (username: string) => ipcRenderer.invoke('init', {username}),
  initServer: (payload: InitServerPayload) => ipcRenderer.invoke("init:server", payload),
  searchRooms: () => ipcRenderer.invoke('search:rooms'),
  connectRoom: (host: string, port: number, password?: string) => ipcRenderer.invoke("connect", {
    host,
    port,
    password
  }),
  getUser: () => ipcRenderer.invoke("get:user"),
  getRoom: () => ipcRenderer.invoke("get:room"),
  sendMessage: (payload:MessageActionPayload) => ipcRenderer.invoke("action:message", payload),
  on: (type:EventActionTypes, callback: (event: Event) => void) => ipcRenderer.on(type, (_, event) => callback(event)),
})  