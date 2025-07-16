import { NetworkUtils } from '../common/utils/network'
import { SocketManager } from './lib/Socket/tcp'
import { Room } from './lib/chat/Room'
import { RoomExposer } from './lib/Socket/udp'


export class Server {
  private _socketManager: SocketManager;

  private _exposureServer: RoomExposer

  constructor(private _room: Room) {
    this._socketManager = SocketManager.instance
    this._exposureServer = new RoomExposer(this._room)
  }

  async startServer() {
    try {
      NetworkUtils.checkConnectivity()
      await this._socketManager.startServer(this._room)
      if (!this._room.isHidden) await this._exposureServer.expose_room()
      return true
    } catch (err) {
      console.log("LOG: Error initiating server")
      console.log(err)
      return false
    }
  }

  stopExposure() {
    this._exposureServer.stop_exposure()
  }

  stopServer() {
    this.stopExposure()
    this._socketManager.stopServer()
  }
  
}