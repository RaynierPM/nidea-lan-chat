import { App } from "..";
import { Event, EventActionTypes } from "../../common/interfaces/event.interface";
import { UserStatuses } from "../../common/interfaces/User.interface";
import { AbandonEventPayload } from "../../common/lib/Event/variants/Abandon.event";
import { JoinEventPayload } from "../../common/lib/Event/variants/JoinEvent";
import { MessageEventPayload } from "../../common/lib/Event/variants/MessageEvent";
import { printMessage } from "../cli";
import { RoomInfo } from "../interfaces/chat.interface";

export class EventHandler {
  constructor(private readonly app: App) {}

  handle(event: Event) {
    switch (event.type) {
      case EventActionTypes.GET_HISTORY:
        this.app.chatInfo = event.payload as RoomInfo
        break;
      case EventActionTypes.MESSAGE:  
        const messagePayload: MessageEventPayload = event.payload as MessageEventPayload
        this.app.addMessage(messagePayload.roomId, {
          content: messagePayload.content,
          timestamp: event.timestamp,
          userId: event.authorId ?? null
        })
        break;
      case EventActionTypes.JOIN:
        const joinPayload: JoinEventPayload = event.payload as JoinEventPayload
        this.app.addParticipant(joinPayload)
        break;
      case EventActionTypes.CONNECT:
        this.app.updateParticipant(event.authorId!, {status: UserStatuses.ACTIVE})
        break;
      case EventActionTypes.DISCONNECT:
        this.app.updateParticipant(event.authorId!, {status: UserStatuses.DISCONNECTED})
        break;
      case EventActionTypes.ABANDON:
        this.app.removeParticipant((event.payload as AbandonEventPayload).userId)
    }
  }
}