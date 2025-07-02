import {createSocket, RemoteInfo, Socket} from 'node:dgram'
import { ConnInfoStore } from '../../interfaces/app.interface'
import { configuration } from '../../../server/config/configuration'

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
  }

  scan():Promise<void> {
    let resolver, rejecter;
    const promise = new Promise<void>((res, rej) => {resolver=res; rejecter=rej;})

    this.socket.bind(configuration.exposePort, '255.255.255.255', () => {
      this.socket.setBroadcast(true)
      console.log('Scanning rooms...')
    })

    setTimeout(() => {
      console.log("Waiting...")
      
    }, 2000)

    return promise
  }



  private handleMessage = (msg: Buffer, rinfo:RemoteInfo) => {
    try {

    } catch (err) {
      console.error(err)
    }
  }
}