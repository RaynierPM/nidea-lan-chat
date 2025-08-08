import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { ValidationError } from "../../../../../client/errors/core.error";

export type AbandonActionPayload = {
  chatId?: number
}

export class AbanadonAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: AbandonActionPayload;
  
  constructor(payload: AbandonActionPayload) {
    super(EventActionTypes.ABANDON)
    this._payload = payload
    this.metadata = {
      timestamp: Number(new Date()),
    }
  }

  handle(socket: SocketWithId, room: Room): void {
    // @@ Replace by valid error

    const { chatId } = this._payload
    const user = room.getParticipantBySocket(socket)
    if (user) {
      if (room.id === chatId || !chatId) {
        room.removeParticipant(user.id)
      }
      else {
        const chat = room.findChat(chatId)
        if (!chat) throw new ValidationError("Chat not found")
        if (chat) {
          chat.removeParticipant(user.id)
        }
      }
    }
  }
}