import { EventTypes } from "../../../common/interfaces/event.interface";
import { InvalidEventType } from "../../errors/event/InvalidEventType";
import { BaseEvent, EventHandler } from "../interfaces/Event.interface";

export abstract class EventFactory {
  static getEventHandler(event: BaseEvent): EventHandler {
    switch(event.type) {
      case EventTypes.JOIN:
        
      case EventTypes.MESSAGE:
        
      case EventTypes.EXIT:
        
      case EventTypes.EXPULSE:
        
      case EventTypes.JOINED:
        
      default:
        throw new InvalidEventType(event.type)
    }
  }
}