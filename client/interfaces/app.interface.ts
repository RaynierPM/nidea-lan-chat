import { ConnectionInfo } from "../../common/interfaces/Chat.interface";
import { Event } from "../../common/interfaces/event.interface";

export interface ConnInfoStore {
  addConnInfo(conn: ConnectionInfo): void
}

export type TCPSocketListener = ( event: Event) => void