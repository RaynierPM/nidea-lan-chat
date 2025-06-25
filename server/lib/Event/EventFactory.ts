import { EventTypes } from "../../../common/interfaces/event.interface";
import { InvalidaEventType } from "../../errors/event/InvalidEventType";
import { EventHandler } from "../interfaces/Event.interface";
import { EventBase } from "./Event";
import { JoinEvent } from "./variants/JoinEvent";

export abstract class EventFactory {
  static getEventHandler(event: EventBase): EventHandler {
    switch(event.type) {
      // case EventTypes.JOIN:
      //   return 
      // case EventTypes.MESSAGE:
      //   return new MessageEven()
      default:
        throw new InvalidaEventType(event.type)
    }
  }
}