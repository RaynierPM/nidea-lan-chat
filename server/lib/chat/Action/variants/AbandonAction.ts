import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { UserI } from "../../../../../common/interfaces/User.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { Participant } from "../../../User/Participant";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { GetHistoryEvent } from "../../../../../common/lib/Event/variants/GetHistory.event";
import { Message } from "../../Message";

export type AbandonActionPayload = {
  userId: UserI['id']
  chatId: number
}

export class AbanadonAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: AbandonActionPayload;
  
  constructor(payload: AbandonActionPayload) {
    super(EventActionTypes.JOIN)
    this._payload = payload
    this.metadata = {
      timestamp: Number(new Date()),
      user: payload.userId,
    }
  }

  handle(_: SocketWithId, room: Room): void {
    // @@ Replace by valid error
    const { chatId,userId } = this._payload
    if (room.id === chatId) room.removeParticipant(userId)
    else {
      const chat = room.findChat(chatId)
      if (chat) {
        chat.removeParticipant(userId)
      }
    }
  }
}