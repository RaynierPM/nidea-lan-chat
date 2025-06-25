import net, { Socket, type Server } from 'node:net'
import { configuration } from './config/configuration'
import { NetworkUtils } from '../common/utils/network'
import { SocketManager } from './lib/Socket/tcp'

SocketManager.getInstance().startServer()