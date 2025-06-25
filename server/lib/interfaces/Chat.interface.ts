import { UserI } from "./User.interface"

export type CreationRoomOpts = {
  name?: string
  password?: string
  owner: UserI
  isHidden?: boolean
}