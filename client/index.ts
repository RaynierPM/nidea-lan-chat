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
    console.log("Scanning rooms...")
    this.availableRooms = []
    this.roomScanner.scan()
    .then(() => {
      console.log("Scan finished")
      console.log(`Available room quantity: ${this.availableRooms.length}`)
      this.availableRooms.forEach(room => {
        this.printConnectionInfo(room)
      })
    })
  }

  private printConnectionInfo(room: ConnectionInfo) {
    console.log(`==== | ${room.room.name} | ===> \nAddress: ${room.addr}:${room.port} \nOwner: ${room.room.user.username} \n${new Array(20).fill('-').join('')}`)
  }
}

new App().search()