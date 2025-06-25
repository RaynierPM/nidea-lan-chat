import {createSocket, RemoteInfo, Socket} from 'node:dgram'
import { Room } from '../../chat/Room'
import { RoomRequired } from '../../../errors/chat/Room.errors'
import { configuration } from '../../../config/configuration'
import { NetworkUtils } from '../../../../common/utils/network'
import { CLIENT_BROADCAST_REQUEST } from '../../../../common/utils/socket'
import { ConnectionInfo, PublicRoomInfo } from '../../../../common/interfaces/Chat.interface'

export class RoomExposer {
  private socket: Socket
  private roomToExpose: Room

  constructor(room: Room) {
    if (!room) throw new RoomRequired()
    this.roomToExpose = room

    this.socket = createSocket('udp4')
    
    this.socket.on("listening", () => {this.handleListening()})

    this.socket.on("message", this.handleRequest)

  }
  
  private handleListening() {
    console.log(`Making room visible...${NetworkUtils.getPrivateIp()}:${configuration.exposePort}`)
  }

  private isAValidRequest(request:string) {
    return new RegExp(CLIENT_BROADCAST_REQUEST, 'g').test(request)
  }

  private handleRequest = (msg: Buffer, rInfo: RemoteInfo) => {
    const decodedMsg = msg.toString()
    if (this.isAValidRequest(decodedMsg)) {
      this.retrieveConnectionInfo(rInfo.address, rInfo.port)
    }
  }

  private retrieveConnectionInfo(addr: string, port: number) {
    this.socket.send(
      JSON.stringify(this.getConnectionInfo(), null, 2), 
      port, addr, 
      (err) => {
        console.log(`Unable to retrieve room exposition to ${addr}:${port}`)
        console.error(err)
      }
    )
  }

  private getConnectionInfo():ConnectionInfo {
    return {
      addr: NetworkUtils.getPrivateIp()!,
      port: configuration.port,
      room: this.getRoomInfo()
    }
  }

  private getRoomInfo():PublicRoomInfo {
    return {
      name: this.roomToExpose.roomName,
      withPassword: this.roomToExpose.withPassword,
      user: {
        id: this.roomToExpose.owner.id,
        username: this.roomToExpose.owner.username,
      }
    }
  }
  
  expose_room() {
    this.socket.bind(configuration.exposePort)
  }
}