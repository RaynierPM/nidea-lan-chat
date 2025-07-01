import { EventActionTypes } from "../../../interfaces/event.interface"
import { UserI } from "../../../interfaces/User.interface"
import { EventBase } from "../Event"


export class DisconnectEvent extends EventBase {
  constructor(authorId: UserI['id']) {
    super(EventActionTypes.DISCONNECT, authorId)
  }

  protected validate(_: unknown): void {
    return 
  }
}