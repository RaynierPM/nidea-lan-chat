import net, { type Server, type Socket } from "net";
import { configuration } from "../../../config/configuration";
import { NetworkUtils } from "../../../../common/utils/network";
import { Room } from "../../chat/Room";
import { RoomRequired } from "../../../errors/chat/Room.errors";
import { BaseEvent } from "../../interfaces/Event.interface";
import { TCPSocketListener } from "../../interfaces/socket.interface";
import { EventTypes } from "../../../../common/interfaces/event.interface";

export class SocketManager {
  
  private static _instance: SocketManager
  
  private _server: Server;
  
  private connections: Record<string, Socket> = {}
  
  private abort_controller = new AbortController()

  private listeners: Partial<Record<EventTypes, TCPSocketListener[]>> = {}
  
  get server() {
    return this._server
  }
  
  private _room?: Room;
  
  static get instance() {
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

  public startServer(room: Room) {
    if (!room) throw new RoomRequired()
    this._room = room

    this.server.listen({
      port: configuration.port,
      signal: this.abort_controller.signal
    }, () => {
      console.log(`Just listening: ${NetworkUtils.getPrivateIp()}:${configuration.port}`)    
    })
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

  public on(type:EventTypes, listener:TCPSocketListener) {
    if (this.listeners[type]) {
      this.listeners[type].push(listener)
    }else {
      this.listeners[type] = [listener]
    }
  }

  private handleConnection(socket: Socket) {
    const scId = this.getSocketIdentifier(socket)
    if (scId) this.connections[scId] = socket
  }

  private handleMessage = (socket: Socket, data: Buffer) => {
    const str = data.toString()
    try {
      const event = JSON.parse(str) as BaseEvent
      this._room?.handleEvent(event)
    } catch {
      socket.write(`${str.slice(0, str.length-1)} is not valid payload`)
      console.error("Not valid payload")
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
