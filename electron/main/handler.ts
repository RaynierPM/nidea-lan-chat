import { ConnectPayload, InitPayload, InitServerPayload } from "."
import { FakeUsernameUtil } from "../../client/utils/usernameFaker"
import { UserI } from "../../common/interfaces/User.interface"
import { MessageActionPayload } from "../../server/lib/chat/Action/variants/MessageAction"
import { MainState } from "./main.state"

export function loadHandlers(IpcMain: Electron.IpcMain) {
  IpcMain.handle("init", (_, {username}:InitPayload): UserI => {
    return MainState.instance.auth(username || FakeUsernameUtil.generate())
  })
  IpcMain.handle("init:server", async (_, payload: InitServerPayload) => {
    return await MainState.instance.hostServer(payload)
  })
  IpcMain.handle("search:rooms", async () => {
    return await MainState.instance.searchRooms()
  })
  IpcMain.handle("connect", async (_, {password, host, port}: ConnectPayload) => {
    await MainState.instance.connectToServer(host, port, password)
  })
  IpcMain.handle("get:user", async ():Promise<UserI | null> => {
    return MainState.instance.user
  })
  IpcMain.handle("disconnect", async ():Promise<void> => {
    await MainState.instance.disconnect()
  }) 
  // Actions
  IpcMain.handle("action:message", (_, {content, chatId}:MessageActionPayload) => {
    MainState.instance.sendMessage({content, chatId})
  })
  IpcMain.handle("action:leave", (_, chatId: number) => {
    MainState.instance.leaveChat(chatId)
  })
  IpcMain.handle("action:getHistory", () => {
    MainState.instance.getHistory()
  })
}