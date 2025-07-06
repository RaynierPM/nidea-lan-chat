import { NetworkUtils } from '../common/utils/network'
import { SocketManager } from './lib/Socket/tcp'
import { Room } from './lib/chat/Room'
import { RoomExposer } from './lib/Socket/udp'
import { User } from '../common/lib/User/User'

if (!NetworkUtils.getPrivateIp()) throw new Error('Required has connected to some Network to HOST a room')

const owner = new User(NetworkUtils.getNetworkMacAddr()!, process.env.username || 'Testing user')

const testingRoom = new Room({
  owner: owner,
  password: process.env.password,
  name: process.env.name
})
if (!testingRoom.isHidden) new RoomExposer(testingRoom).expose_room()
SocketManager.instance.startServer(testingRoom)