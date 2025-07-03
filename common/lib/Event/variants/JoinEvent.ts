import { NotValidEventPayload } from "../../../errors/event.errors";
import { EventActionTypes } from "../../../interfaces/event.interface";
import { UserI, UserStatuses } from "../../../interfaces/User.interface";
import { EventBase } from "../Event";

export type JoinEventPayload = {
  userId: UserI['id']
  username: string
  timestamp: number
  status: UserStatuses
}

export class JoinEvent extends EventBase {
  constructor(authorId: UserI['id'], payload: JoinEventPayload) {
    super(EventActionTypes.JOIN, authorId)
    this.validate(payload)
    this.payload = payload
  }

  validate(_: JoinEventPayload) {
    const errors = {}
    if (Object.keys(errors).length) {
      throw new NotValidEventPayload(errors)
    }
  }
}