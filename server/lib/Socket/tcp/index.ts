import net, { type Server, type Socket } from "net";
import { configuration } from "../../../config/configuration";
import { NetworkUtils } from "../../../../common/utils/network";
import { Room } from "../../chat/Room";
import { RoomRequired } from "../../../errors/chat/Room.errors";
import { RoomExposer } from "../udp";

export class SocketManager {
  
  private _server: Server;
  
  private connections: Record<string, Socket> = {}
  
  // private room: Room;
  
  private abort_controller = new AbortController()
  
  get server() {
    return this._server
  }
  
  private static _instance: SocketManager
  
  private roomExposer: RoomExposer = new RoomExposer()
  
  static getInstance() {
    if (!this._instance) {
      this._instance = new SocketManager()
    }
    return this._instance
  }

  private constructor() {
    this._server = net.createServer((socket) => {
      this.handleConnection(socket)
      socket.on("end", () => this.handleDisconnect(socket))
      socket.on("data", (data) => this.handleMessage(socket, data))
    })
  }

  public startServer() {
    // if (!this.room) throw new RoomRequired()

    // if (!this.room?.isHidden) 
    this.roomExposer.expose_room()

    this.server.listen({
      port: configuration.port,
      signal: this.abort_controller.signal
    }, () => {
      console.log(`Just listening: ${NetworkUtils.getPrivateIp()}:${configuration.port}`)    
    })
  }

  public exposeServer() {

  }

  public stopServer() {
    this.abort_controller.abort()
  }

  public send(addresses: string | string[], message:object) {
    if (!Array.isArray(addresses)) {
      addresses = [addresses]
    }

    addresses.forEach((addr) => {
      const socket = this.connections[addr]
      if (addr) {
        socket.write(JSON.stringify(message))
      }
    })
  }

  private handleConnection(socket: Socket) {
    const scId = this.getSocketIdentifier(socket)
    if (scId) this.connections[scId] = socket
  }

  private handleMessage = (socket: Socket, data: Buffer) => {
    const str = data.toString()
    try {
      const event = JSON.parse(str)
    } catch {
      // Send an 'Not valid event' to emitter
      console.error("Not valid payload", str)
    }
  }

  private handleDisconnect = (socket: Socket) => {
    // Execute a disconnet event to everybody
    const scId = this.getSocketIdentifier(socket)
    if (scId) delete this.connections[scId]
  }

  private getSocketIdentifier(socket:Socket) {
    return socket.localAddress
  }
}
