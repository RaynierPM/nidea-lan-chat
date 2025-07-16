import { WebContents } from "electron/main";
import { InitServerPayload } from ".";
import { App } from "../../client";
import { ValidationError } from "../../client/errors/core.error";
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

  private _server: Server | null = null;

  get hasServer() {
    return !!this._server
  }

  private constructor(username: string) {
    this._app = new App(username)
  }

  public static Init(username: string, webContents: WebContents) {
    if (this._instance) {
      throw new ValidationError("App has been initiated!")
    }
    this._instance = new MainState(username)
    this._instance.resendEvents(webContents)
  }

  async initServer({
    isHidden = false,
    name,
    password
  }: InitServerPayload) {
    if (!this._app) throw new ValidationError("Not allowed to init server")
    const room = new Room({
      name,
      owner: this._app.user,
      isHidden,
      password
    })
    this._server = new Server(room)
    return await this._server.startServer()
  }

  private resendEvents(wc: WebContents) {
    this._app?.on("*", (event) => { wc.send(event.type, event)})
  }
}