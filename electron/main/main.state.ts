import { App } from "../../client";
import { ValidationError } from "../../client/errors/core.error";

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

  private constructor(username: string) {
    this._app = new App(username)
  }

  public static Init(username: string) {
    if (this._instance) {
      throw new ValidationError("App has been initiated!")
    }
    this._instance = new MainState(username)
  }
}