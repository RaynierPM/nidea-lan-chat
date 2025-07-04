import net, { type Server, type Socket } from "net";
import { configuration } from "../../../config/configuration";
import { NetworkUtils } from "../../../../common/utils/network";
import { Room } from "../../chat/Room";
import { RoomRequired } from "../../../errors/chat/Room.errors";
import { SocketWithId, TCPSocketListener } from "../../interfaces/socket.interface";
import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { ActionFactory } from "../../chat/Action/Action.factory";
import { AutoIncrementSequence } from "../../../../common/utils/autoIncrementManager";

export class SocketManager {
  
  private static _instance: SocketManager
  
  private _server: Server;
  
  private connections: Record<string, Socket> = {}
  
  private abort_controller = new AbortController()

  private listeners: Partial<Record<EventActionTypes | "*", TCPSocketListener[]>> = {}

  private socketSequence = new AutoIncrementSequence()
  
  get server() {
    return this._server
  }
  
  private room?: Room;
  
  static get instance() {
    if (!this._instance) {
      this._instance = new SocketManager()
    }
    return this._instance
  }

  private constructor() {
    this._server = net.createServer((socket) => {
      (socket as SocketWithId)._id = this.socketSequence.getNext()
      this.handleConnection(socket as SocketWithId)
      socket.on("close", () => this.handleDisconnect(socket as SocketWithId))
      socket.on("data", (data) => this.handleMessage(socket, data))
      socket.on("error", (err) => this.handleError(err))
    })
  }

  public startServer(room: Room) {
    if (!room) throw new RoomRequired()
    this.room = room

    this.server.listen({
      port: configuration.port,
      signal: this.abort_controller.signal
    }, () => {
      console.log(`Just listening: ${NetworkUtils.getPrivateIp()}:${configuration.port}`)
      room.loadListeners(this)   
    })
  }

  public stopServer() {
    this.abort_controller.abort()
  }

  public on(type:EventActionTypes | "*", listener:TCPSocketListener) {
    if (this.listeners[type]) {
      this.listeners[type].push(listener)
    }else {
      this.listeners[type] = [listener]
    }
  }

  private handleConnection(socket: SocketWithId) {
    const scId = this.getSocketIdentifier(socket)
    if (scId) this.connections[scId] = socket

    // const participant = this.room?.participants
    //   .find(usr => [usr.socketRemoteAddr]
    //     .includes(socket.remoteAddress)
    //   )
    // if (participant) {
    //   this.room?.connect(participant.id, socket)
    // }
  }

  private handleMessage = (socket: Socket, data: Buffer) => {
    const messages = data.toString().split('\n').filter(msg => !!msg)
    console.log(messages)
    messages.pop()
    for (const message of messages) {
      try {
        const action = ActionFactory.getEventHandler(JSON.parse(message))
        const listeners = this.listeners[action.type]
        if (listeners) {
          listeners.forEach((listener) => {
            listener(socket, action)
          })
        }
        this.listeners["*"]?.forEach(listener => listener(socket, action))
      } catch (err) {
        socket.write(JSON.stringify({
          response: "Error",
          reason: err instanceof Error? err.message : "Unexpected error"
        })+'\n')
        console.error("Not valid payload: \n", err)
      }
    }
  }

  private handleDisconnect = (socket: SocketWithId) => {
    const scId = this.getSocketIdentifier(socket)
    if (scId) delete this.connections[scId]
    const participant = this.room?.participants.find(usr => usr.socketId === socket._id)
    if (participant) {
      this.room!.disconnect(participant.id)
    }
  }

  private handleError = (err: Error) => {
    console.error(err.message)
  }

  private getSocketIdentifier(socket:Socket) {
    return socket.remoteAddress ?? socket.localAddress
  }
}
