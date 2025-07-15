import {createSocket, Socket} from 'node:dgram'
import { ConnInfoStore } from '../../interfaces/app.interface'
import { configuration } from '../../../server/config/configuration'
import { ConnectionInfo } from '../../../common/interfaces/Chat.interface'
import { CLIENT_BROADCAST_REQUEST } from '../../../common/utils/socket'
import { NetworkUtils } from '../../../common/utils/network'

export class RoomScanner {
  private connectionStore: ConnInfoStore

  private abortController: AbortController = new AbortController()

  private socket: Socket = createSocket({
    type: 'udp4',
    signal: this.abortController!.signal
  })

  constructor(store: ConnInfoStore) {
    this.connectionStore = store
    this.configurateSocket()
  }

  private configurateSocket() {
    this.socket = createSocket({
      type:'udp4',
      signal: this.abortController.signal
    })
    this.socket.on('message', this.handleMessage)
    this.socket.on('listening', () => {
      this.socket.setBroadcast(true)
      this.sendRequest()
    })
  }

  scan():Promise<void> {
    let resolver: () => void;
    const promise = new Promise<void>((res) => {resolver=res;})
    this.socket.bind(7777)

    setTimeout(() => {
      this.socket.close()
      this.configurateSocket()
      resolver()
    }, 1e3)

    return promise
  }

  private handleMessage = (msg: Buffer) => {
    try {
      const connInfo = JSON.parse(msg.toString()) as ConnectionInfo
      //@@ Validate room info
      this.connectionStore.addConnInfo(connInfo)
    } catch (err) {
      console.error(err)
    }
  }

  private sendRequest() {
    let message = Buffer.from(CLIENT_BROADCAST_REQUEST)
    this.socket.send(
      message, 
      0, 
      message.length, 
      configuration.exposePort, 
      NetworkUtils.getBroadcastableAddr(), (err) => {
      if (err) {
        console.log(err)
      }
    })
  }
}