import { UserStatuses } from "../../../common/interfaces/User.interface"

export interface UserI {
  id: string
  username: string
  status: UserStatuses
  address: string
  
  getConnData(): {address: UserI['address'], id: UserI['id']}
}