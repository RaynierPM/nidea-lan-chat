import net from 'node:net'
import {createSocket} from 'node:dgram'
import { configuration } from './config/configuration'
import { getPrivateIp } from '../common/utils/ip'

// Testing

const broadcast = createSocket('udp4')
broadcast.on('listening', () => {

})
broadcast.bind(configuration.exposePort)

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    try {
      console.log(JSON.parse(data.toString()))
    } catch (err) {
      console.log("Not valid action/payload")
    }
    console.log(`${socket.remoteAddress}: ${data.toString()}`)  
  })
  
  socket.on("end", () => {    
    console.log(`Client disconnected`)
  })
})

server.listen(configuration, () => {
  console.log(`Just listening PORT:${getPrivateIp()}:${configuration.port}`)
})