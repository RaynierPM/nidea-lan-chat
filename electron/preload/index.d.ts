import '@electron-toolkit'
import { ConnectionInfo, RoomInfo } from '../../common/interfaces/Chat.interface'
import { InitServerPayload } from '../main'
import { MessageActionPayload } from '../../server/lib/chat/Action/variants/MessageAction'
import { EventActionTypes } from '../../common/interfaces/event.interface'
import { UserI } from '../../common/interfaces/User.interface'
declare global {
  interface Window {
    core: {
      getUser: () => Promise<UserI | null>,
      getRoom: () => Promise<RoomInfo | null>,
      searchRooms: () => Promise<ConnectionInfo[]>,
      init: (username: string) => UserI,
      connectRoom: (host: string, port: number, password?: string) => Promise<void>,
      createServer: (payload: InitServerPayload) => Promise<boolean>,
      sendMessage: (payload: MessageActionPayload) => Promise<void>,
      on: (type: EventActionTypes, cb: (payload) => void) => void
    }
  }
}
