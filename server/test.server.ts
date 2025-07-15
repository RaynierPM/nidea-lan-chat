import { Server } from "."
import { User } from "../common/lib/User/User"
import { NetworkUtils } from "../common/utils/network"
import { Room } from "./lib/chat/Room"

NetworkUtils.checkConnectivity()

const owner = new User(NetworkUtils.getNetworkMacAddr()!, process.env.username || 'Testing user')

const testingRoom = new Room({
  owner: owner,
  password: process.env.password,
  name: process.env.name
})

const server = new Server(testingRoom)
console.log("Turning on server...")
server.startServer()
.then(() => {
  console.log("Server ON!")
})