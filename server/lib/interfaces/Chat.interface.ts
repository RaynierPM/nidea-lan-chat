import { UserI, UserStatuses } from "../../../common/interfaces/User.interface"

export type CreationRoomOpts = {
  name?: string
  password?: string
  owner: UserI
  isHidden?: boolean
}