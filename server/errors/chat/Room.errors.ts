export class RoomOwnerRequired extends Error {
  constructor() {
    super("A room owner it's required to create a new room")
  }
}

export class RoomRequired extends Error {
  constructor() {
    super("Room required to init/expose a server.")
  }
}