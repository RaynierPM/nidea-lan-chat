import '@electron-toolkit'
import { ConnectionInfo } from '../../common/interfaces/Chat.interface'
import { InitServerPayload } from '../main'
declare global {
  interface Window {
    core: {
      getUser: () => Promise<boolean>
      searchRooms: () => Promise<ConnectionInfo[]>,
      init: (username: string) => void,
      connectRoom: (host: string, port: number, password?: string) => void,
      createServer: (payload: InitServerPayload) => Promise<boolean>
    }
  }
}
