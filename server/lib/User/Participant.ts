import { Socket } from "net";
import { UserI, UserStatuses } from "../../../common/interfaces/User.interface";
import { EventBase } from "../../../common/lib/Event/Event";

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
  
  private _socket: Socket

  private _createdAt: Date
  get createdAt() {
    return this._createdAt
  }
  
  constructor(id: string, username: string, socket: Socket) {
    this._id = id
    this._username = username
    this._status = UserStatuses.ACTIVE
    this._socket = socket
    this._createdAt = new Date()
  }

  notify(event:EventBase) {
    this._socket.write(event.toJson())
  }
}