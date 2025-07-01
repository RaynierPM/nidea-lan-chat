import { SocketWithId } from "../../server/lib/interfaces/socket.interface"

export class NotValidEventPayload extends Error {
  errors?: Record<string, string>
  constructor(errors: Record<string, string>) {
    super("This payload not satisfy the requirements")
    this.errors = errors
  }
}

export class SocketCloseByOtherInstance extends Error {
  private closedSocket: SocketWithId
  private newSocket: SocketWithId
  constructor(closedSSocket: SocketWithId, newSocket: SocketWithId) {
    super("The actual socket was ~~closed~~ by othe instance on the same PC/Account")
    this.closedSocket = closedSSocket
    this.newSocket = newSocket
  }

  // @@ Send a event to the new socket with the information about the socket closed
  toString() {
    return `The socket ${this.closedSocket._id} was closed by socket ${this.newSocket._id}`
  }
}