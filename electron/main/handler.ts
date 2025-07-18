import { ConnectPayload, InitPayload, InitServerPayload } from "."
import { ValidationError } from "../../client/errors/core.error"
import { FakeUsernameUtil } from "../../client/utils/usernameFaker"
import { RoomInfo } from "../../common/interfaces/Chat.interface"
import { UserI } from "../../common/interfaces/User.interface"
import { MessageActionPayload } from "../../server/lib/chat/Action/variants/MessageAction"
import { MainState } from "./main.state2"

function getMainState() {
  const mainState = MainState.instance
  if (!mainState) {
    throw new ValidationError("App not initiated yet.")
  }
  return mainState
}

export function loadHandlers(IpcMain: Electron.IpcMain) {
  // IpcMain.handle("action", (_, action: ActionI ) => {
  //   try {
  //     const mainState = getMainState()
      
  //   } catch (error) {
  //     return (error as Error).message
  //   }
  // })
  IpcMain.handle("init", (_, {username}:InitPayload): UserI => {
    return MainState.instance.auth(username || FakeUsernameUtil.generate())
  })
  IpcMain.handle("init:server", async (_, payload: InitServerPayload) => {
    const mainState = getMainState()
    return await mainState.hostServer(payload)
  })
  IpcMain.handle("search:rooms", async () => {
    const mainState = getMainState()
    return await mainState.searchRooms()
  })
  IpcMain.handle("connect", async (_, {password, host, port}: ConnectPayload) => {
    const mainState = getMainState()
    await mainState.connectToServer(host, port, password)
  })
  IpcMain.handle("get:user", async ():Promise<UserI | null> => {
    try {
      return getMainState().user
    } catch {
      return null
    }
  })
  IpcMain.handle("get:room", async ():Promise<RoomInfo | null> => {
    try {
      return null
    } catch {
      return null
    }
  })
  IpcMain.handle("action:message", (_, {content, chatId}:MessageActionPayload) => {
    const mainState = getMainState()
    mainState.sendMessage({content, chatId})
  })
}