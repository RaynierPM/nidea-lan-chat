import { Event, EventActionTypes } from "../../common/interfaces/event.interface";
import { InvalidEventType } from "../../server/errors/event/InvalidEventType";

export abstract class EventFactory {
  static getEvent(event: Event) {
    switch(event.type) {
      case EventActionTypes.GET_HISTORY:
        
      case EventActionTypes.MESSAGE:
      case EventActionTypes.JOIN:
      case EventActionTypes.DISCONNECT:
      default:
        throw new InvalidEventType(event.type)
    }
  }
}