import net from 'node:net'
import {createSocket} from 'node:dgram'
import { configuration } from './config/configuration'
import { NetworkUtils } from '../common/utils/network'

const broadcast = createSocket('udp4')
broadcast.on('listening', () => {
  
})
broadcast.bind(configuration.exposePort)

const sockets: net.Socket[] = []

const server = net.createServer((socket) => {
  console.log("New client: " + socket.localAddress)
  sockets.push(socket)
  
  socket.on("data", (data) => {
    const message = data.toString()
    if (message) {
      sockets.forEach(sc => {
        if (sc.localAddress !== socket.localAddress) {
          sc.write(socket.localAddress + ": " + message)
        }
      })
    }
  })
  
  socket.on("end", () => {    
    console.log(`Client disconnected`)
    sockets.filter(sc => sc.localAddress !== socket.localAddress)
  })
})

server.listen(configuration, () => {
  console.log(`Just listening PORT:${NetworkUtils.getPrivateIp()}:${configuration.port}`)
})