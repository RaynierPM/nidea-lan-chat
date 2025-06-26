import net, { Socket, type Server } from 'node:net'
import { configuration } from './config/configuration'
import { NetworkUtils } from '../common/utils/network'
import { SocketManager } from './lib/Socket/tcp'
import { Room } from './lib/chat/Room'
import { Participant } from './lib/User/Participant'
import { RoomExposer } from './lib/Socket/udp'

if (!NetworkUtils.getPrivateIp()) throw new Error('Required has connected to some Network to HOST a room')

const owner = new Participant(NetworkUtils.getNetworkMacAddr()!, 'Papotico', NetworkUtils.getPrivateIp()!)

const testingRoom = new Room({
  owner: owner,
})
if (!testingRoom.isHidden) new RoomExposer(testingRoom).expose_room()
SocketManager.instance.startServer(testingRoom)