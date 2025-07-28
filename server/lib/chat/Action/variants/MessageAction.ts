import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { Message } from "../../Message";
import { TimestampUtils } from "../../../../../common/utils/timestamp";
import { Limits } from "../../../../../common/utils/constants";

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

  validate(): boolean {
    return this._payload.content.length <= Limits.MAX_MESSAGE_LENGTH && this._payload.content.length > 0;
  }

  handle(socket: SocketWithId, room: Room): void {
    if (this.validate()) {
      const {content} = this._payload
      const participant = room.getParticipantBySocket(socket)
      if (participant) room.addMessage(new Message(participant?.id, content))
    }
  }
}