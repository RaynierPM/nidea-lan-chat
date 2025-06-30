import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { InvalidEventType } from "../../../errors/event/InvalidEventType";
import { EventHandler } from "../../interfaces/Event.interface";
import { ActionBase } from "./Action";

export abstract class ActionFactory {
  static getEventHandler(event: ActionBase): EventHandler {
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