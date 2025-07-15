import { App } from "../../client"
import { UserI } from "../../common/interfaces/User.interface"

export type InitPayload = {
  username: string
}

export type ConnectPayload = {
  password?: string
  host: string
  port?: number
}

export type InitServerPayload = {
  name?: string
  password?: string
  isHidden?: boolean
}