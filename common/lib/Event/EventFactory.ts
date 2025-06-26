import { EventTypes } from "../../../common/interfaces/event.interface";
import { InvalidEventType } from "../../../server/errors/event/InvalidEventType";
import { EventHandler } from "../../../server/lib/interfaces/Event.interface";
import { EventBase } from "./Event";

export abstract class EventFactory {
  static getEventHandler(event: EventBase): EventHandler {
    switch(event.type) {
      case EventTypes.JOIN:
      case EventTypes.MESSAGE:
      default:
        throw new InvalidEventType(event.type)
    }
  }
}