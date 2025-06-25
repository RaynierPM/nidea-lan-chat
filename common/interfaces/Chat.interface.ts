import { UserI } from "../../server/lib/interfaces/User.interface"

export type ConnectionInfo = {
  room: PublicRoomInfo
  addr: string
  port: number
}

export type PublicRoomInfo = {
  name: string
  withPassword: boolean
  user: Pick<UserI, 'id'> & Pick<UserI, 'username'>
}