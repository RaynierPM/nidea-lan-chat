import { ConnectionInfo } from "../common/interfaces/Chat.interface";
import { RoomScanner } from "./socket-client/udp";

class App {
  private availableRooms: ConnectionInfo[] = []

  addConnInfo(conn: ConnectionInfo) {
    this.availableRooms.push(conn)
  }

  private roomScanner: RoomScanner

  constructor() {}

  search() {
    
  }
}