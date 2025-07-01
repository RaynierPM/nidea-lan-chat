import { UserI } from "./User.interface"

export type ConnectionInfo = {
  room: PublicRoomInfo
  addr: string
  port: number
}

export type PublicRoomInfo = {
  id: number
  name: string
  withPassword: boolean
  user: Pick<UserI, 'id'> & Pick<UserI, 'username'>
}