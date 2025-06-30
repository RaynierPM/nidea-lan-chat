import { EventActionTypes } from "../../../common/interfaces/event.interface";
import { UserI } from "../../../common/interfaces/User.interface";
import { RoomOwnerRequired } from "../../errors/chat/Room.errors";
import { InvalidEventType } from "../../errors/event/InvalidEventType";
import { CreationRoomOpts } from "../interfaces/Chat.interface";
import { BaseEvent } from "../interfaces/Event.interface";
import { Chat } from "./Chat";

export class Room extends Chat {
  private _owner: UserI;

  get owner() {
    return this._owner
  }

  private _roomName: string;

  get roomName() {
    return this._roomName
  }

  private _isHidden:boolean = false

  get isHidden() {
    return this._isHidden
  }

  private _password?: string;

  get withPassword() {
    return !!this._password
  }
  
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
    super("general")
    this._owner = owner
    this._password = password
    this._isHidden = isHidden ?? this._isHidden
    this._roomName = name ?? `${owner.username}'s Room`
  }

  expulseParticipant(userId: string): void {
    if (this.participants.some(u => u.id === userId)) {
      this._participants = this._participants.filter(u => u.id !== userId)
      // Notify participant expulsion
      this.chats.forEach(chat => {
        chat.expulseParticipant(userId)
      })
    }
  }

  findChat(chatId: number) {
    return this.chats.find(ch => ch.id === chatId)
  }

  handleEvent(event: BaseEvent) {
    switch(event.type) {
      case EventActionTypes.JOIN:
      case EventActionTypes.MESSAGE:        
      case EventActionTypes.EXIT:
      case EventActionTypes.EXPULSE:
      default:
        throw new InvalidEventType(event.type)
    }
  }
}