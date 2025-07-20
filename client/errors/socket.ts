export class ConnectionRequiredError extends Error {
  constructor() {
    super("Invalid action emitted, first start the socket connection.")
  }
}

export class AlreadyConnectedError extends Error {
  constructor() {
    super("Already has a connection")
  }
}