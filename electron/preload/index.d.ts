import '@electron-toolkit'
import { ConnectionInfo } from '../../common/interfaces/Chat.interface'
declare global {
  interface Window {
    core: {
      searchRooms: () => Promise<ConnectionInfo[]>,
      init: (username: string) => void,
      connectRoom: (host: string, port: number, password?: string) => void,
    }
  }
}
