import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { InvalidEventType } from "../../../errors/event/InvalidEventType";
import { ActionBase } from "./Action";
import { ActionI } from "./Action.interface";
import { AbanadonAction, AbandonActionPayload } from "./variants/AbandonAction";
import { JoinAction, JoinActionPayload } from "./variants/JoinAction";
import { MessageAction, MessageActionPayload } from "./variants/MessageAction";

export abstract class ActionFactory {
  static getEventHandler(event: ActionI): ActionBase {
    switch(event.type) {
      case EventActionTypes.JOIN:
        return new JoinAction(event.payload as JoinActionPayload)
      case EventActionTypes.MESSAGE:
        return new MessageAction(event.payload as MessageActionPayload)
      case EventActionTypes.ABANDON:
        return new AbanadonAction(event.payload as AbandonActionPayload)
      case EventActionTypes.EXPULSE:
        
      default:
        throw new InvalidEventType(event.type)
    }
  }
}