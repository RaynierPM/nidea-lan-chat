import { Socket } from "net"
import { EventBase } from "../Event/Event"

export type JoinEventOpts = {
  id: string
  username: string
  address: string
}

export interface EventHandler {
  handle(socket: Socket, event: EventBase): void
}