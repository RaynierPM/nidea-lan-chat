import net from 'node:net'
import {createSocket} from 'node:dgram'
import { configuration } from './config/configuration'
import { NetworkUtils } from '../common/utils/network'

const broadcast = createSocket('udp4')
broadcast.on('listening', () => {
  
})
broadcast.bind(configuration.exposePort)

const server = net.createServer((socket) => {  
  socket.on("data", (data) => {
    try {
      console.log(JSON.parse(data.toString()))
      console.log(`${socket.remoteAddress}: ${data.toString()}`)  
    } catch (err) {
      console.log("Not valid action/payload")
      socket.write(JSON.stringify({message: "No gays here"}))
    }
  })
  
  socket.on("end", () => {    
    console.log(`Client disconnected`)
  })
})

server.listen(configuration, () => {
  console.log(`Just listening PORT:${NetworkUtils.getPrivateIp()}:${configuration.port}`)
})