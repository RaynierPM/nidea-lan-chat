import { Socket } from "net"
import { EventBase } from "../../../common/lib/Event/Event"
import { EventActionTypes } from "../../../common/interfaces/event.interface"

export type JoinEventOpts = {
  id: string
  username: string
}

export interface EventHandler {
  handle(socket: Socket, event: EventBase): void
}

export type Events =
  | JoinEvent | ExitEvent
  | ExpulseEvent
  | MessageEvent

export interface BaseEvent {
  type: EventActionTypes;
  timestamp: number;
}
export interface JoinEvent extends BaseEvent {
  type: EventActionTypes.JOIN;
  chatId: string;
}

export interface ExitEvent extends BaseEvent {
  type: EventActionTypes.EXIT;
  chatId: string;
}

export interface ExpulseEvent extends BaseEvent {
  type: EventActionTypes.EXPULSE;
  chatId: string;
  targetUserId: string;
  reason?: string;
}

export interface MessageEvent extends BaseEvent {
  type: EventActionTypes.MESSAGE;
  chatId: string;
  content: string;
}