import { ConnectPayload, InitPayload } from "."
import { ValidationError } from "../../client/errors/core.error"
import { FakeUsernameUtil } from "../../client/utils/usernameFaker"
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
  IpcMain.handle("init", (_, {username}:InitPayload) => {
    MainState.Init(username || FakeUsernameUtil.generate())
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
}