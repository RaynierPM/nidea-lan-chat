import { BrowserWindow, Notification, WebContents } from "electron/main";
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
import { AbanadonAction } from "../../server/lib/chat/Action/variants/AbandonAction";
import { GetHistoryAction } from "../../server/lib/chat/Action/variants/GetHistory";
import { EventActionTypes } from "../../common/interfaces/event.interface";
import { MessageEventPayload } from "../../common/lib/Event/variants/MessageEvent";

export class MainState {

  private static _instance?: MainState;
  
  private _user: UserI | null = null

  private _server: Server | null = null

  private _window: BrowserWindow | null = null

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

  disconnect() {
    if (!this.isConnected) throw new ValidationError("User is not in any room!")
    this._socketManager.disconnect()
  }

  leaveChat(chatId: number) {
    if (!this.isConnected) throw new ValidationError("User is not in any room!")
    this._socketManager.emit(new AbanadonAction({chatId}))
  }

  getHistory() {
    this._socketManager?.emit(new GetHistoryAction())
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

  onDisconnect(callback: () => void) {
    this._socketManager.onDisconnect(callback)
  }

  setWindow(window: BrowserWindow) {
    this._window = window
    this.redirectEvents(window.webContents)
    this.loadWindowEvents()
    this._socketManager.onDisconnect(() => {
      window.webContents.send('disconnect')
    })
  }

  redirectEvents(wb: WebContents) {
    this._socketManager.on("*", (event) => {
      wb.send(event.type, event)
    })
  }

  private _lastNotificationTime: number = 0;
  
  private loadWindowEvents() {
    this._socketManager.on(EventActionTypes.MESSAGE, (event) => {
      const { content } = event.payload as MessageEventPayload
      if (!this._window?.isFocused()) {
        const now = Date.now();
        if (now - this._lastNotificationTime > 5e3) {
          new Notification({
            title: "New message!",
            body: content
          }).show();
          this._lastNotificationTime = now;
        }
      }
    })
  }
}