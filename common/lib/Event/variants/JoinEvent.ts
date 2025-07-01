import { NotValidEventPayload } from "../../../errors/event.errors";
import { EventActionTypes } from "../../../interfaces/event.interface";
import { UserI } from "../../../interfaces/User.interface";
import { EventBase } from "../Event";

type JoinEventPayload = {
  userId: UserI['id']
  timestamp: number
  username: string
}

export class JoinEvent extends EventBase {
  constructor(authorId: UserI['id'], payload: JoinEventPayload) {
    super(EventActionTypes.JOIN, authorId)
    this.validate(payload)
    this.payload = payload
  }

  validate(payload: JoinEventPayload) {
    const errors = {}
    console.log(payload)
    if (Object.keys(errors).length) {
      throw new NotValidEventPayload(errors)
    }
  }
}