import { EventActionTypes } from "../../../interfaces/event.interface"
import { UserI } from "../../../interfaces/User.interface"
import { EventBase } from "../Event"


export class ConnectEvent extends EventBase {
  constructor(authorId: UserI['id']) {
    super(EventActionTypes.CONNECT, authorId)
  }

  protected validate(_: unknown): void {
    return 
  }
}