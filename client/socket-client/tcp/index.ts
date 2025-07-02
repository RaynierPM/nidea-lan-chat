import {createConnection, Socket} from 'net'
import { Event, EventActionTypes } from '../../../common/interfaces/event.interface'
import { TCPSocketListener } from '../../interfaces/app.interface'
import { ActionI } from '../../../server/lib/chat/Action/Action.interface'
import { ConnectionRequiredError } from '../../errors/socket'

export class SocketManager {
  private connection?: Socket

  private listeners: Partial<Record<EventActionTypes | "*", TCPSocketListener[]>> = {} 

  constructor() {

  }

  connect(addr: string, port: number) {
    this.connection = createConnection({port, path: addr}, () => {

    })
  }

  on(type: EventActionTypes | "*", listener: TCPSocketListener) {
    if (this.listeners[type]) {
      this.listeners[type].push(listener)
    }else {
      this.listeners[type] = [listener]
    }
  }

  emit(action: ActionI) {
    // @@ Connection needed error
    if (!this.connection) throw new ConnectionRequiredError()
    this.connection.write(JSON.stringify(action))
  }

  private handleMessages(data: Buffer) {
    try {
      const event = JSON.parse(data.toString()) as Event
      const listeners = this.listeners[event.type]
      if (listeners) {
        listeners.forEach(listener => listener(event))
      }
      this.listeners['*']?.forEach(listener => listener(event))
    } catch {
      console.log(" +== Unprocesable event received ==+")
    }
  }
}