import {createConnection, Socket} from 'net'
import { Event, EventActionTypes } from '../../../common/interfaces/event.interface'
import { TCPSocketListener } from '../../interfaces/app.interface'
import { AlreadyConnectedError, ConnectionRequiredError } from '../../errors/socket'
import { JoinAction, JoinActionPayload } from '../../../server/lib/chat/Action/variants/JoinAction'
import { ActionBase } from '../../../server/lib/chat/Action/Action'

const alreadyConnectedError = new AlreadyConnectedError()

export class SocketManager {
  private connection?: Socket

  private listeners: Partial<Record<EventActionTypes | "*", TCPSocketListener[]>> = {} 

  private _connectCallbacks:(() => void)[] = []
  private _disconnectCallbacks: (() => void)[] = []

  get isConnected() {
    return this.connection && !this.connection?.closed
  }

  connect(addr: string, port: number, payload: JoinActionPayload) {
    return new Promise<void>((res, rej) => {
      if (this.isConnected) rej(alreadyConnectedError)
      
      console.log("Trying to connect to: ", addr, port)
      this.connection = createConnection(port, addr, () => {
        this.emit(new JoinAction(payload))
        this._connectCallbacks.forEach(cb => {
          cb()
        })
      })
      this.connection.on("data", this.handleMessages)
      this.connection.on("close", this.onClose)
      this.connection.on("error", (err) => rej(err))
      this.connection.on("connect", () => res())
    })
  }

  disconnect() {
    if (this.isConnected) {
      this.connection!.destroy()
      this.connection = undefined
    }
  }

  on(type: EventActionTypes | "*" , listener: TCPSocketListener) {
    if (this.listeners[type]) {
      this.listeners[type].push(listener)
    }else {
      this.listeners[type] = [listener]
    }
  }

  onConnect(callback: () => void) {
    this._connectCallbacks.push(callback)
  }

  onDisconnect(callback: () => void) {
    this._disconnectCallbacks.push(callback)
  }

  emit(action: ActionBase) {
    // @@ Connection needed error
    if (!this.connection) throw new ConnectionRequiredError()
    this.connection.write(action.toJson()+'\n')
  }

  private _pendingBuffer = ''

  private handleMessages = (data: Buffer) => {
    this._pendingBuffer += data.toString()
    const messages = this._pendingBuffer.split('\n')

    this._pendingBuffer = messages.pop()!

    for (const message of messages) {
      try {
        const event = JSON.parse(message) as Event
        this.listeners['*']?.forEach(listener => listener(event))
        
        const listeners = this.listeners[event.type]
        if (listeners) {
          listeners.forEach(listener => listener(event))
        }
      } catch (err) {
        console.log(err)
        console.log(" +== Unprocesable event received ==+")
      }
    }
  }

  private onClose = (error: boolean) => {
    if (error) {
      console.log("Unexpected error registered")
    }
    console.log("Closing app by server desconnection")
    this.connection = undefined
    this._disconnectCallbacks.forEach(cb => cb())
  }
}