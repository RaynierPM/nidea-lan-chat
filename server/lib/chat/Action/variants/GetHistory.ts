import { Room } from "../../Room";
import { ActionBase } from "../Action";
import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { ActionMetadataI } from "../Action.interface";
import { TimestampUtils } from "../../../../../common/utils/timestamp";
import { SocketWithId } from "../../../interfaces/socket.interface";
import { GetHistoryEvent } from "../../../../../common/lib/Event/variants/GetHistory.event";

export class GetHistoryAction extends ActionBase {
  protected _payload: unknown;

  metadata: ActionMetadataI;

  constructor() {
    super(EventActionTypes.GET_HISTORY)
    this.metadata = {
      timestamp: TimestampUtils.getTimestampFrom(), 
    }
  }

  handle(socket: SocketWithId, room: Room): void {
    const participant = room.getParticipantBySocket(socket)
    if (participant) {
      participant.notify(new GetHistoryEvent(room.getRoomInfo()))
    }
  }
}