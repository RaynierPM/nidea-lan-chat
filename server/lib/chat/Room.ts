import { Socket } from "net";
import { EventActionTypes } from "../../../common/interfaces/event.interface";
import { UserI } from "../../../common/interfaces/User.interface";
import { RoomOwnerRequired } from "../../errors/chat/Room.errors";
import { InvalidEventType } from "../../errors/event/InvalidEventType";
import { CreationRoomOpts } from "../interfaces/Chat.interface";
import { Chat } from "./Chat";
import { NetworkUtils } from "../../../common/utils/network";
import { configuration } from "../../config/configuration";
import { ActionI } from "./Action/Action.interface";
import { JoinAction } from "./Action/variants/JoinAction";
import { SocketManager } from "../Socket/tcp";
import { ActionFactory } from "./Action/Action.factory";
import { Message } from "./Message";

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

  get connString() {
    return {
      address: NetworkUtils.getPrivateIp(),
      port: configuration.port
    }
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

  loadListeners(socketManager: SocketManager) {
    socketManager.on("*", (socket, action) => {
      ActionFactory.getEventHandler(action).handle(socket, this)
    })
  }
}