import { RoomInfo } from "../../../../client/interfaces/chat.interface";
import { NotValidEventPayload } from "../../../errors/event.errors";
import { EventActionTypes } from "../../../interfaces/event.interface";
import { EventBase } from "../Event";

export class GetHistoryEvent extends EventBase {
  constructor(payload: RoomInfo) {
    super(EventActionTypes.GET_HISTORY)
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