import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { Message } from "../../Message";
import { TimestampUtils } from "../../../../../common/utils/timestamp";

export type MessageActionPayload = {
  content: string
  chatId?: number
}

export class MessageAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: MessageActionPayload;
  
  constructor(payload: MessageActionPayload) {
    super(EventActionTypes.MESSAGE)
    this._payload = payload
    this.metadata = {
      timestamp: TimestampUtils.getTimestampFrom(),
      room: payload.chatId
    }
  }

  handle(socket: SocketWithId, room: Room): void {
    const {content} = this._payload
    const participant = room.getParticipantBySocket(socket)
    if (participant) room.addMessage(new Message(participant?.id, content))
  }
}