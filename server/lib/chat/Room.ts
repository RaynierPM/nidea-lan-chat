import { RoomOwnerRequired } from "../../errors/chat/Room.errors";
import { CreationRoomOpts } from "../interfaces/Chat.interface";
import { UserI } from "../interfaces/User.interface";
import { Chat } from "./Chat";

export class Room extends Chat {
  private _owner: UserI;

  get owner() {
    return this._owner
  }

  private _isHidden:boolean = false

  get isHidden() {
    return this._isHidden
  }

  private _password?: string;
  
  verifyPassword(password: string):boolean {
    return this._password === password
  }

  private _chats: Chat[] = []

  get chats() {
    return this._chats
  }

  constructor({name, owner, password, isHidden}:CreationRoomOpts) {
    if (!owner) {
      throw new RoomOwnerRequired()
    }
    super(name)
    this._owner = owner
    this._password = password
    this._isHidden = isHidden ?? this._isHidden
  }
}