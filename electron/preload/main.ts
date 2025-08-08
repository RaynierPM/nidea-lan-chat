import { contextBridge, ipcRenderer } from "electron";
import { InitServerPayload } from "../main";
import { MessageActionPayload } from "../../server/lib/chat/Action/variants/MessageAction";
import { Event, EventActionTypes } from "../../common/interfaces/event.interface";
import { configuration } from "../../server/config/configuration";

contextBridge.exposeInMainWorld('core', {
  init: (username: string) => ipcRenderer.invoke('init', {username}),
  createServer: (payload: InitServerPayload) => ipcRenderer.invoke("init:server", payload),
  searchRooms: () => ipcRenderer.invoke('search:rooms'),
  connectRoom: ({host, port = configuration.port, password}:{host: string, port?: number, password?: string}) => ipcRenderer.invoke("connect", {host, port, password}),
  getUser: () => ipcRenderer.invoke("get:user"),
  getRoom: () => ipcRenderer.invoke("action:getHistory"),
  sendMessage: (payload:MessageActionPayload) => ipcRenderer.invoke("action:message", payload),
  disconnect: () => ipcRenderer.invoke("disconnect"),
  leave: (chatId: number) => ipcRenderer.invoke("action:leave", chatId),
  // on: (type:EventActionTypes, callback: (event: Event) => void) => ipcRenderer.on(type, (_, event) => callback(event)),
  on: (type: EventActionTypes | "*", callback: (event: Event) => void) => {
    const wrappedCb = (_, event) => callback(event)
    ipcRenderer.on(type, wrappedCb)
    return () => {
      ipcRenderer.off(type, wrappedCb)
    }
  },
  onDisconnect: (callback: () => void) => {
    const wrappedCb = () => callback();
    ipcRenderer.on('disconnect', wrappedCb);
    return () => {
      ipcRenderer.off('disconnect', wrappedCb);
    };
  }
})  