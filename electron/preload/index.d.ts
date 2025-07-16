import '@electron-toolkit'
import { ConnectionInfo } from '../../common/interfaces/Chat.interface'
import { InitServerPayload } from '../main'
import { MessageActionPayload } from '../../server/lib/chat/Action/variants/MessageAction'
declare global {
  interface Window {
    core: {
      getUser: () => Promise<UserI | null>
      searchRooms: () => Promise<ConnectionInfo[]>,
      init: (username: string) => void,
      connectRoom: (host: string, port: number, password?: string) => Promise<void>,
      createServer: (payload: InitServerPayload) => Promise<boolean>,
      sendMessage: (payload: MessageActionPayload) => Promise<void>
    }
  }
}
