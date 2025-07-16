import { ConnectionInfo, RoomInfo } from "../common/interfaces/Chat.interface";
import { Event, EventActionTypes } from "../common/interfaces/event.interface";
import { MessageI } from "../common/interfaces/message.interface";
import { UserI, UserStatuses } from "../common/interfaces/User.interface";
import { JoinEventPayload } from "../common/lib/Event/variants/JoinEvent";
import { User } from "../common/lib/User/User";
import { NetworkUtils } from "../common/utils/network";
import { configuration } from "../server/config/configuration";
import { AbanadonAction } from "../server/lib/chat/Action/variants/AbandonAction";
import { MessageAction } from "../server/lib/chat/Action/variants/MessageAction";
import { EventHandler } from "./event/handler";
import { ConnInfoStore } from "./interfaces/app.interface";
import { SocketManager } from "./socket-client/tcp";
import { RoomScanner } from "./socket-client/udp";

export class App implements ConnInfoStore {
  private availableRooms: ConnectionInfo[] = []

  get publicRooms() {
    return this.availableRooms
  }

  private _chatInfo: RoomInfo | null = null

  private eventHandler = new EventHandler(this)

  get owner() {
    return this._chatInfo?.owner
  }

  get messages() {
    return this._chatInfo?.messages
  }

  private _user:UserI

  get user() {
    return this._user
  }

  addMessage(chatId: number, message: MessageI) {
    if (chatId === this._chatInfo?.id) {
      this._chatInfo.messages.push(message)
    }else {
      this._chatInfo
        ?.chats
        .find(chat => chat.id === chatId)
        ?.messages.push(message)
    }
  }

  set chatInfo(chatData: RoomInfo | null) {
    if (chatData) {
      this._chatInfo = chatData
    }
  }

  get chatInfo() {
    return this._chatInfo
  }
  

  get participants() {
    return this._chatInfo?.participants.map(part => ({
      id: part.id,
      username: part.username, 
      status: part.status,
    }))
  }

  addParticipant(user: JoinEventPayload) {
    this._chatInfo?.participants.push({
      id: user.userId,
      status: user.status,
      timestamp: user.timestamp,
      username: user.username
    })
  }

  removeParticipant(userId: UserI['id']) {
    if (this._chatInfo) 
      this._chatInfo.participants = this._chatInfo?.participants.filter(part => part.id !== userId)
  }

  updateParticipant(id: UserI['id'], data: Partial<{username: string, status: UserStatuses}>) {
    const participant = this._chatInfo?.participants.find(usr => usr.id === id)
    if (participant) {
      participant.username = data.username ?? participant.username
      participant.status = data.status ?? participant.status
    }
  }
  
  getParticipant(userId: UserI['id']) {
    return this._chatInfo?.participants.find(part =>part.id === userId)
  }  

  getUser(userId: UserI['id']) {
    return this._chatInfo?.participants.find(user => user.id === userId)
  }

  private socketManager: SocketManager

  addConnInfo(conn: ConnectionInfo) {
    this.availableRooms.push(conn)
  }

  private roomScanner: RoomScanner

  constructor(username: string, id:UserI['id'] = NetworkUtils.getNetworkMacAddr()!) {
    this._user = new User(id, username)
    this.roomScanner = new RoomScanner(this)
    this.socketManager = new SocketManager()
    this.loadListener()
  }

  searchRooms() {
    this.availableRooms = []
    return this.roomScanner.scan()
  }

  private loadListener() {
    this.socketManager.on("*", (event) => {
      this.eventHandler.handle(event)
    })
  }

  on(type: EventActionTypes | "*", listener: (event: Event) => void) {
    this.socketManager.on(type, listener)
  }

  onConnect(listener: () => void) {
    this.socketManager.onConnect(listener)
  } 
  
  async connectToServer(addr: string, port: number = configuration.port, password?: string) {
    return await this.socketManager.connect(
      addr, 
      port, 
      {
        userId: this._user.id, 
        username: this._user.username,
        password
      }
    )
  }
  
  sendMessage(content: string, roomId?: number) {
    this.socketManager.emit(new MessageAction({content, roomId}))
  }
  
  abandonRoom(chatId: number) {
    this.socketManager.emit(new AbanadonAction({
      chatId,
    }))
  }
}
