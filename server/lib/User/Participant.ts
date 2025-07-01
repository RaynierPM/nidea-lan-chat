import { Socket } from "net";
import { UserI, UserStatuses } from "../../../common/interfaces/User.interface";
import { EventBase } from "../../../common/lib/Event/Event";
import { SocketWithId } from "../interfaces/socket.interface";
import { SocketCloseByOtherInstance } from "../../../common/errors/event.errors";

export class Participant implements UserI {
  private _id: string
  get id() {
    return this._id
  }
  
  private _username: string
  get username() {
    return this._username
  }
  
  private _status: UserStatuses 
  get status() {
    return this._status
  }

  set status(newStatus: UserStatuses) {
    if (Object.values(UserStatuses).includes(newStatus)) this._status = newStatus      
  }
  
  private _socket: SocketWithId | null

  get socketId() {
    return this._socket?._id
  }

  get socketRemoteAddr() {
    return this._socket?.remoteAddress
  }

  get socketLocalAddr() {
    return this._socket?.localAddress
  }

  private _createdAt: Date
  
  get createdAt() {
    return this._createdAt
  }
  
  constructor(id: string, username: string, socket: SocketWithId) {
    this._id = id
    this._username = username
    this._status = UserStatuses.ACTIVE
    this._socket = socket
    this._createdAt = new Date()
  }

  notify(event:EventBase) {
    this._socket?.write(event.toJson())
  }

  disconnect() {
    this._status = UserStatuses.DISCONNECTED
    this._socket = null
  }

  connect(socket: SocketWithId) {
    // @@ Add a better error instance
    if (this._socket) this._socket.destroy(new SocketCloseByOtherInstance(this._socket, socket))
    this._status = UserStatuses.ACTIVE
    this._socket = socket
  }
}