import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { UserI } from "../../../../../common/interfaces/User.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { Participant } from "../../../User/Participant";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { GetHistoryEvent } from "../../../../../common/lib/Event/variants/GetHistory.event";
import { Message } from "../../Message";
import { styleText } from "node:util";

export type JoinActionPayload = {
  id: UserI['id']
  username: string
}

export class JoinAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: JoinActionPayload;
  
  constructor(payload: JoinActionPayload) {
    super(EventActionTypes.JOIN)
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
    const existsOnRoom = room
      .participants
      .some(part => part.id === id)
    if (existsOnRoom) {
      room.connect(id, socket)
    }else {
      room.addParticipant(new Participant(id, username, socket))
      room.addMessage(new Message(null, `-- ${username} -- Has been joined`))
      room.addMessage(new Message(null, `@Everyone say hello.`))
    }
    socket.write(new GetHistoryEvent(room.getRoomInfo()).toJson())
  }
}