import { App } from "..";
import { Event, EventActionTypes } from "../../common/interfaces/event.interface";
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
        printMessage({
          content: messagePayload.content,
          timestamp: event.timestamp,
          userId: event.authorId ?? null
        })
        break;
      case EventActionTypes.JOIN:
        const joinPayload: JoinEventPayload = event.payload as JoinEventPayload
        this.app.addParticipant(joinPayload)
        break;
    }
  }
}