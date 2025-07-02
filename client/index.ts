import { ConnectionInfo } from "../common/interfaces/Chat.interface";
import { RoomScanner } from "./socket-client/udp";

class App {
  private availableRooms: ConnectionInfo[] = []

  addConnInfo(conn: ConnectionInfo) {
    this.availableRooms.push(conn)
  }

  private roomScanner: RoomScanner

  constructor() {
    this.roomScanner = new RoomScanner(this)
  }

  search() {
    this.roomScanner.scan()
    .then(() => {
      console.log(`Available room quantity: ${this.availableRooms.length}`)
      this.availableRooms.forEach(room => {
        console.log(room)
      })
    })
  }
}

new App().search()