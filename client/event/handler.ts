import { App } from "..";
import { Event, EventActionTypes } from "../../common/interfaces/event.interface";
import { MessageEventPayload } from "../../common/lib/Event/variants/MessageEvent";
import { RoomInfo } from "../interfaces/chat.interface";

export class EventHandler {
  constructor(private readonly app: App) {}

  handle(event: Event) {
    switch (event.type) {
      case EventActionTypes.GET_HISTORY:
        this.app.chatInfo = event.payload as RoomInfo
        break;
      case EventActionTypes.MESSAGE:  
        const payload: MessageEventPayload = event.payload as MessageEventPayload
        this.app.addMessage(payload.roomId, {
          content: payload.content,
          timestamp: event.timestamp,
          userId: event.authorId ?? null
        })
        break;
      case EventActionTypes.JOIN:
        break;
    }
  }
}