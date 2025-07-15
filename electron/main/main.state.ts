import { InitServerPayload } from ".";
import { App } from "../../client";
import { ValidationError } from "../../client/errors/core.error";
import { NetworkUtils } from "../../common/utils/network";
import { Server } from "../../server";
import { Room } from "../../server/lib/chat/Room";

export class MainState {

  private static _instance: MainState | null

  static get instance() {
    return this._instance
  }

  private _app: App

  get app() {
    return this._app
  }
  
  private _username: string | null = null
  
  get username() {
    return this._username
  }

  private _server: Server | null = null;

  get hasServer() {
    return !!this._server
  }

  private constructor(username: string) {
    this._app = new App(username)
  }

  public static Init(username: string) {
    if (this._instance) {
      throw new ValidationError("App has been initiated!")
    }
    this._instance = new MainState(username)
  }

  async initServer({
    isHidden = false,
    name,
    password
  }: InitServerPayload) {
    if (!this.username) throw new ValidationError("App not initiated!") 
    const room = new Room({
      name,
      owner: {
        username: this.username, 
        id: NetworkUtils.getNetworkMacAddr()!,
      },
      isHidden,
      password
    })
    this._server = new Server(room)
    return await this._server.startServer()
  }
}