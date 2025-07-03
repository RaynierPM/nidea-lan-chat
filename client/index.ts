import { ConnectionInfo } from "../common/interfaces/Chat.interface";
import { Event } from "../common/interfaces/event.interface";
import { MessageI } from "../common/interfaces/message.interface";
import { UserI } from "../common/interfaces/User.interface";
import { User } from "../common/lib/User/User";
import { NetworkUtils } from "../common/utils/network";
import { TimestampUtils } from "../common/utils/timestamp";
import { configuration } from "../server/config/configuration";
import { MessageAction } from "../server/lib/chat/Action/variants/MessageAction";
import { EventHandler } from "./event/handler";
import { RoomInfo } from "./interfaces/chat.interface";
import { SocketManager } from "./socket-client/tcp";
import { RoomScanner } from "./socket-client/udp";

export class App {
  private availableRooms: ConnectionInfo[] = []

  private _chatInfo: RoomInfo | null = null

  private eventHandler = new EventHandler(this)

  set chatInfo(chatData: RoomInfo) {
    this._chatInfo = chatData
  }

  get participants() {
    return this._chatInfo?.participants.map(part => ({username: part.username, status: part.status}))
  }

  get messages() {
    return this._chatInfo?.messages
  }

  getParticipant(userId: UserI['id']) {
    return this._chatInfo?.participants.find(part => {console.log(part);return part.id === userId})
  }

  addMessage(chatId: number, message: MessageI) {
    this._chatInfo
      ?.chats
      .find(chat => chat.id === chatId)
      ?.messages.push(message)
    this.printMessage(message)
  }

  printMessage(message: MessageI) {
    const isMe = message.userId === this.user.id
    const username = !message.userId
      ? "System" 
      : isMe 
      ? "Me" 
      : this.getParticipant(message.userId)?.username || "Unknown"

    const date = TimestampUtils.getDateFrom(message.timestamp).toLocaleDateString()
      
    console.log(`${isMe? "--" : "**"}${username}: ${message.content} ~~date:${date}~~`)
  }

  printRoomName() {
    console.log(" + ===== Chat: " + this._chatInfo?.name + " ==== + ")
  }

  getUser(userId: UserI['id']) {
    return this._chatInfo?.participants.find(user => user.id === userId)
  }

  private user:UserI

  private socketManager: SocketManager

  addConnInfo(conn: ConnectionInfo) {
    this.availableRooms.push(conn)
  }

  private roomScanner: RoomScanner

  constructor(username: string, id:UserI['id'] = NetworkUtils.getNetworkMacAddr()!) {
    this.user = new User(id, username)
    this.roomScanner = new RoomScanner(this)
    this.socketManager = new SocketManager()
    this.loadListener()
  }

  search() {
    console.log("Scanning rooms...")
    this.availableRooms = []
    return this.roomScanner.scan()
    .then(() => {
      console.log("Scan finished")
      console.log(`Available room quantity: ${this.availableRooms.length}\n`)
      this.availableRooms.forEach(room => {
        this.printConnectionInfo(room)
      })
    })
  }

  private printConnectionInfo(room: ConnectionInfo) {
    console.log(`==== | ${room.room.name} | ===> \nAddress: ${room.addr}:${room.port} \nOwner: ${room.room.user.username} \n${new Array(30).fill('-').join('')}`)
  }

  loadListener() {
    this.socketManager.on("*", (event) => {
      this.handleEvent(event)
    })
  }

  private handleEvent = (event:Event) => {
    this.eventHandler.handle(event)
  }

  connectToServer(addr: string, port: number = configuration.port) {
    this.socketManager.connect(
      addr, 
      port, 
      {id: this.user.id, username: this.user.username}
    )
  }

  sendMessage(content: string) {
    this.socketManager.emit(new MessageAction({content, userId: this.user.id}))
  }
}
