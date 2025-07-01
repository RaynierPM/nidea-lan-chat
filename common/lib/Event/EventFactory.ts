import { EventActionTypes } from "../../../common/interfaces/event.interface";
import { InvalidEventType } from "../../../server/errors/event/InvalidEventType";
import { EventBase } from "./Event";

export abstract class EventFactory {
  static getEvent(event: EventBase) {
    switch(event.type) {
      case EventActionTypes.JOIN:
      case EventActionTypes.MESSAGE:
      case EventActionTypes.EXIT:
      case EventActionTypes.EXPULSE:
      default:
        throw new InvalidEventType(event.type)
    }
  }
}