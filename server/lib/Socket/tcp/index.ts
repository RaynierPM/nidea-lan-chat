import { type Server, type Socket } from "net";

export class app {
  private _server: Server;
  get server() {
    return this._server
  }
  
  private static _instance: app

  static getInstance(server: Server) {
    if (!this._instance) {
      this._instance = new app(server)
    }
    return this._instance
  }

  private constructor(server: Server) {
    this._server = server;
  }

  public listen() {

  }

  public send<T>(address: string, message:T) {
    
  }
}