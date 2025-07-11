import { UserI } from "../../../common/interfaces/User.interface";
import { RoomOwnerRequired } from "../../errors/chat/Room.errors";
import { CreationRoomOpts} from "../interfaces/Chat.interface";
import { Chat } from "./Chat";
import { NetworkUtils } from "../../../common/utils/network";
import { configuration } from "../../config/configuration";
import { SocketManager } from "../Socket/tcp";
import { ActionFactory } from "./Action/Action.factory";
import { RoomInfo } from "../../../common/interfaces/Chat.interface";

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
  
  verifyPassword(password: string = ""):boolean {
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

  removeParticipant(userId: string): void {
    const participant = this.getParticipant(userId)
    super.removeParticipant(userId)
    this.chats.forEach(chat => {
      chat.removeParticipant(userId)
    })
    participant?.disconnect()
  }

  findChat(chatId: number) {
    return this.chats.find(ch => ch.id === chatId)
  }

  loadListeners(socketManager: SocketManager) {
    socketManager.on("*", (socket, action) => {
      ActionFactory.getEventHandler(action).handle(socket, this)
    })
  }

  getRoomInfo():RoomInfo {
    return {
      ...this.getChatInfo(),
      roomName: this.roomName,
      chats: this.chats.map(chat => chat.getChatInfo()),
      owner: {id: this.owner.id, username: this.owner.username}
    }
  }
}