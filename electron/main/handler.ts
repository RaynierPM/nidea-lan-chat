import { ConnectPayload, InitPayload, InitServerPayload } from "."
import { ValidationError } from "../../client/errors/core.error"
import { FakeUsernameUtil } from "../../client/utils/usernameFaker"
import { RoomInfo } from "../../common/interfaces/Chat.interface"
import { UserI } from "../../common/interfaces/User.interface"
import { MessageActionPayload } from "../../server/lib/chat/Action/variants/MessageAction"
import { MainState } from "./main.state"

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
  IpcMain.handle("init", (event, {username}:InitPayload): UserI => {
    MainState.Init(username || FakeUsernameUtil.generate(), event.sender)
    const user = MainState.instance?.app.user
    return {
      id: user!.id,
      username: user!.username
    }
  })
  IpcMain.handle("init:server", async (_, payload: InitServerPayload) => {
    const mainState = getMainState()
    return await mainState.initServer(payload)
  })
  IpcMain.handle("search:rooms", async () => {
    const mainState = getMainState()
    await mainState.app.searchRooms()
    return mainState.app.publicRooms
  })
  IpcMain.handle("connect", async (_, {password, host, port}: ConnectPayload) => {
    const mainState = getMainState()
    await mainState.app.connectToServer(host, port, password)
  })
  IpcMain.handle("get:user", async ():Promise<UserI | null> => {
    try {
      return getMainState().app.user
    } catch {
      return null
    }
  })
  IpcMain.handle("get:room", async ():Promise<RoomInfo | null> => {
    try {
      return getMainState().app.chatInfo
    } catch {
      return null
    }
  })
  IpcMain.handle("action:message", (_, {content, roomId}:MessageActionPayload) => {
    const mainState = getMainState()
    mainState.app.sendMessage(content, roomId)
  })
}