import { RoomInfo } from "../../../../server/lib/interfaces/Chat.interface";
import { NotValidEventPayload } from "../../../errors/event.errors";
import { EventActionTypes } from "../../../interfaces/event.interface";
import { UserI } from "../../../interfaces/User.interface";
import { EventBase } from "../Event";

export class GetHistoryEvent extends EventBase {
  constructor(authorId: UserI['id'], payload: RoomInfo) {
    super(EventActionTypes.GET_HISTORY, authorId)
    this.validate(payload)
    this.payload = payload
  }

  validate(_: RoomInfo) {
    const errors = {}
    if (Object.keys(errors).length) {
      throw new NotValidEventPayload(errors)
    }
  }
}