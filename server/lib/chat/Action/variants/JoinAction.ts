import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { UserI } from "../../../../../common/interfaces/User.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";
import { Room } from "../../Room";
import { Participant } from "../../../User/Participant";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { GetHistoryEvent } from "../../../../../common/lib/Event/variants/GetHistory.event";
import { Message } from "../../Message";

export type JoinActionPayload = {
  userId: UserI['id']
  username: string
  password?: string
}

export class JoinAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  protected _payload: JoinActionPayload;
  
  constructor(payload: JoinActionPayload) {
    super(EventActionTypes.JOIN)
    this._payload = payload
    this.metadata = {
      timestamp: Number(new Date()),
      user: payload.userId,
    }
  }

  handle(socket: SocketWithId, room: Room): void {
    const {userId, username} = this._payload
    if (room.withPassword) {
      const isValid = room.verifyPassword(this._payload.password)
      if (!isValid) {
        const error = new Error("Not valid password")
        socket.destroy(error)
        throw error
      }
    }
    let participant = (room
      .participants
      .find(part => part.id === userId))
      
    if (participant) {
      room.connect(participant.id, socket)
      participant.notify(new GetHistoryEvent(room.getRoomInfo()))
    }else {
      participant = new Participant(userId, username, socket)
      room.addParticipant(participant)
      participant.notify(new GetHistoryEvent(room.getRoomInfo()))
      room.addMessage(new Message(null, `@Everyone say hello.`))
      room.addMessage(new Message(null, `-- ${username} -- Has been joined`))
    }
  }
}