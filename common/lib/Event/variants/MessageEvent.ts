import { NotValidEventPayload } from "../../../errors/event.errors"
import { EventActionTypes, EventEssential } from "../../../interfaces/event.interface"
import { UserI } from "../../../interfaces/User.interface"
import { EventBase } from "../Event"

type MessageEventPayload = {
  content: string
  roomId: number
}

export class MessageEvent extends EventBase {
  constructor(authorId: UserI['id'], payload:MessageEventPayload ) {
    super(EventActionTypes.MESSAGE, authorId)
    this.validate(payload)
    this.payload = payload
  }

  protected validate(_: MessageEventPayload): void {
    const errors = {}
    if (Object.keys(errors).length) throw new NotValidEventPayload(errors)
  }
}