import { UserI } from "./User.interface"

export interface MessageI {
  content: string
  userId: UserI['id'] | null
  timestamp: number
}