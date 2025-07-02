export class ConnectionRequiredError extends Error {
  constructor() {
    super("Invalid action emitted, first start the socket connection.")
  }
}