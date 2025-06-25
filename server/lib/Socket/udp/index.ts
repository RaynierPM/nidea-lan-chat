import {createSocket, Socket} from 'node:dgram'
import { Room } from '../../chat/Room'
import { RoomRequired } from '../../../errors/chat/Room.errors'
import { configuration } from '../../../config/configuration'
import { NetworkUtils } from '../../../../common/utils/network'

export class RoomExposer {
  private socket: Socket
  // private roomToExpose: Room

  constructor(room?: Room) {
    // if (!room) throw new RoomRequired()
    // this.roomToExpose = room

    this.socket = createSocket('udp4')
    
    this.socket.on("message", (msg) => {
      console.log(msg.toString())
    })

    console.log(`Making room visible...${NetworkUtils.getPrivateIp()}:${configuration.exposePort}`)
  }
  
  expose_room() {
    this.socket.bind(configuration.exposePort)
  }
}