import {createSocket, Socket} from 'node:dgram'
import { ConnInfoStore } from '../../interfaces/app.interface'
import { configuration } from '../../../server/config/configuration'
import { ConnectionInfo } from '../../../common/interfaces/Chat.interface'
import { CLIENT_BROADCAST_REQUEST } from '../../../common/utils/socket'

export class RoomScanner {
  private connectionStore: ConnInfoStore

  private abortController: AbortController

  private socket: Socket

  constructor(store: ConnInfoStore) {
    this.connectionStore = store
    this.abortController = new AbortController()
    this.socket = createSocket({
      type:'udp4',
      signal: this.abortController.signal
    })
    this.socket.on('message', this.handleMessage)
    this.socket.on('listening', () => {
      this.socket.setBroadcast(true)
      console.log('Scanning rooms...')
      this.sendRequest()
    })
  }

  scan():Promise<void> {
    let resolver: () => void, rejecter: () => void;
    const promise = new Promise<void>((res, rej) => {resolver=res; rejecter=rej;})
    this.socket.bind(7777)

    setTimeout(() => {
      console.log("Finishing Scan...")
      this.socket.close()
      resolver()
    }, 5000)

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
    this.socket.send(message, 0, message.length, configuration.exposePort, '192.168.0.220', (err) => {
      console.log("Sended request?")
      if (err) {
        console.log(err)
      }
    })
  }
}