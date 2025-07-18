import { WebContents } from "electron/main";
import { ValidationError } from "../../client/errors/core.error";
import { SocketManager } from "../../client/socket-client/tcp";
import { RoomScanner } from "../../client/socket-client/udp";
import { ConnectionInfo } from "../../common/interfaces/Chat.interface";
import { UserI } from "../../common/interfaces/User.interface";
import { NetworkUtils } from "../../common/utils/network";
import { configuration } from "../../server/config/configuration";
import { MessageAction, MessageActionPayload } from "../../server/lib/chat/Action/variants/MessageAction";
import { InitServerPayload } from ".";
import { Room } from "../../server/lib/chat/Room";
import { Server } from "../../server";

export class MainState {

  private static _instance?: MainState;
  
  private _user: UserI | null = null

  private _server: Server | null = null

  get user() {
    return this._user
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new MainState()
    }
    return this._instance
  }

  private _socketManager: SocketManager = new SocketManager();

  private _roomScanner: RoomScanner = new RoomScanner()
  
  private constructor() {}

  private _searching = false
  
  async searchRooms() {
    if (this._searching) throw new ValidationError("Room Scanner already searching...")
    return new Promise<ConnectionInfo[]>((res) => {
      this._searching = true
      this._roomScanner.scan()
      .then(rooms => res(rooms))
      .finally(() => this._searching = false)
    })
  }

  get isConnected() {
    return this._socketManager.isConnected
  }

  async connectToServer(addr: string, port: number = configuration.port, password?: string) {
    if (this.isConnected) throw new ValidationError("Client is already connected.")
    if (!this._user) throw new ValidationError("User has not made login on app.")
    this._socketManager.connect(
      addr,
      port,
      {
        userId: this._user.id,
        username: this._user.username,
        password
      }
    )
  }

  async hostServer({name, isHidden, password}:InitServerPayload) {
    NetworkUtils.checkConnectivity()
    if (!this._user) throw new ValidationError("Not allowed to init server")
    const room = new Room({
      name,
      owner: this._user,
      isHidden,
      password
    })
    this._server = new Server(room)
    return await this._server.startServer()
  
  }

  auth(username:string) {
    NetworkUtils.checkConnectivity()
    this._user = {
      username,
      id: NetworkUtils.getNetworkMacAddr()!
    }
    return {
      id: this._user.id,
      username: this._user.username
    }
  }

  sendMessage({content, chatId}:MessageActionPayload) {
    this._socketManager.emit(new MessageAction({content, chatId}))
  }

  redirectEvents(wb: WebContents) {
    this._socketManager.on("*", (event) => {
      wb.send(event.type, event)
    })
  }
}