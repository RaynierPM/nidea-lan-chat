import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { UserI } from "../../../../../common/interfaces/User.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { Message } from "../../Message";

export type MessageActionPayload = {
  userId: UserI['id']
  content: string
  roomId?: number
}

export class MessageAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: MessageActionPayload;
  
  constructor(type: EventActionTypes, payload: MessageActionPayload) {
    super(type)
    this._payload = payload
    this.metadata = {
      timestamp: Number(new Date()),
      user: payload.userId,
      room: payload.roomId
    }
  }

  handle(_: SocketWithId, room: Room): void {
    const {userId, roomId, content} = this._payload
    room.addMessage(new Message(userId, content))
  }
}