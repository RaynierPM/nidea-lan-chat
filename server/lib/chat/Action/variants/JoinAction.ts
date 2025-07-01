import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { UserI } from "../../../../../common/interfaces/User.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { Participant } from "../../../User/Participant";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { GetHistoryEvent } from "../../../../../common/lib/Event/variants/GetHistory.event";

export type JoinActionPayload = {
  id: UserI['id']
  username: string
}

export class JoinAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: JoinActionPayload;
  
  constructor(type: EventActionTypes, payload: JoinActionPayload) {
    super(type)
    this._payload = payload
    this.metadata = {
      timestamp: Number(new Date()),
      user: payload.id,
    }
  }

  handle(socket: SocketWithId, room: Room): void {
    // @@ Replace by valid error
    if (room.participants.some(participant => participant.socketId === socket._id)) throw new Error('No valid re-join from same PC')
    const {id, username} = this._payload
    room.addParticipant(new Participant(id, username, socket))
    socket.write(new GetHistoryEvent(id, room.getRoomInfo()).toJson())
  }
}