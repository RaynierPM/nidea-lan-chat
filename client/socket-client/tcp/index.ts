import {createConnection, Socket} from 'net'
import { Event, EventActionTypes } from '../../../common/interfaces/event.interface'
import { TCPSocketListener } from '../../interfaces/app.interface'
import { ConnectionRequiredError } from '../../errors/socket'
import { JoinAction, JoinActionPayload } from '../../../server/lib/chat/Action/variants/JoinAction'
import { ActionBase } from '../../../server/lib/chat/Action/Action'

export class SocketManager {
  private connection?: Socket

  private listeners: Partial<Record<EventActionTypes | "*", TCPSocketListener[]>> = {} 

  private _connectCallbacks:(() => void)[] = []

  connect(addr: string, port: number, payload: JoinActionPayload) {
    console.log("Trying to connect to: ", addr, port)
    this.connection = createConnection(port, addr, () => {
      this.emit(new JoinAction(payload))
      this._connectCallbacks.forEach(cb => {
        cb()
      })
    })
    this.connection.on("data", this.handleMessages)
    this.connection.on("close", this.onClose)
    this.connection.on("error", (err) => console.log(err))
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
        const listeners = this.listeners[event.type]
        if (listeners) {
          listeners.forEach(listener => listener(event))
        }
        this.listeners['*']?.forEach(listener => listener(event))
      } catch (err) {
        console.log(err)
        console.log(" +== Unprocesable event received ==+")
      }
    }
  }

  private onClose(error: boolean) {
    if (error) {
      console.log("Unexpected error registered")
    }
    console.log("Closing app by server desconnection")
    process.exit(0)
  }
}