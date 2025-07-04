import { EventActionTypes } from "../../../interfaces/event.interface"
import { UserI } from "../../../interfaces/User.interface"
import { EventBase } from "../Event"

export interface AbandonEventPayload {
  userId: UserI['id']
}

export class AbandonEvent extends EventBase {
  constructor({userId}:AbandonEventPayload) {
    super(EventActionTypes.ABANDON)
    this.payload = {userId}
  }

  protected validate(_: unknown): void {
    return 
  }
}