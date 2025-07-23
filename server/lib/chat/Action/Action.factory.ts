import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { InvalidEventType } from "../../../errors/event/InvalidEventType";
import { ActionBase } from "./Action";
import { ActionI } from "./Action.interface";
import { AbanadonAction, AbandonActionPayload } from "./variants/AbandonAction";
import { GetHistoryAction } from "./variants/GetHistory";
import { JoinAction, JoinActionPayload } from "./variants/JoinAction";
import { MessageAction, MessageActionPayload } from "./variants/MessageAction";

export abstract class ActionFactory {
  static getActionHandler(event: ActionI): ActionBase {
    switch(event.type) {
      case EventActionTypes.JOIN:
        return new JoinAction(event.payload as JoinActionPayload)
      case EventActionTypes.MESSAGE:
        return new MessageAction(event.payload as MessageActionPayload)
      case EventActionTypes.ABANDON:
        return new AbanadonAction(event.payload as AbandonActionPayload)
      case EventActionTypes.GET_HISTORY:
        return new GetHistoryAction()
      default:
        throw new InvalidEventType(event.type)
    }
  }
}