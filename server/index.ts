import net, { Socket, type Server } from 'node:net'
import { configuration } from './config/configuration'
import { NetworkUtils } from '../common/utils/network'
import { SocketManager } from './lib/Socket/tcp'
import { Room } from './lib/chat/Room'
import { User } from '../common/interfaces/User/User'

if (!NetworkUtils.getPrivateIp()) throw new Error('Required has connected to some Network to HOST a room')

const owner = new User(NetworkUtils.getNetworkMacAddr()!, 'Papotico', NetworkUtils.getPrivateIp()!)

const testingRoom = new Room({
  owner: owner,
})

SocketManager.getInstance().startServer(testingRoom)