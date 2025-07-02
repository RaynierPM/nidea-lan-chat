import { ConnectionInfo } from "../../common/interfaces/Chat.interface";

export interface ConnInfoStore {
  addConnInfo(conn: ConnectionInfo): void
}