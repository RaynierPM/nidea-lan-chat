import { Socket } from "net"
import { EventBase } from "../../../common/lib/Event/Event"
import { EventTypes } from "../../../common/interfaces/event.interface"

export type JoinEventOpts = {
  id: string
  username: string
  address: string
}

export interface EventHandler {
  handle(socket: Socket, event: EventBase): void
}

export type Events =
  | JoinEvent | ExitEvent
  | ExpulseEvent | JoinedNoticeEvent
  | MessageEvent

export interface BaseEvent {
  type: EventTypes;
  timestamp: number;
  author?: string
}
export interface JoinEvent extends BaseEvent {
  type: EventTypes.JOIN;
  chatId: string;
}

export interface ExitEvent extends BaseEvent {
  type: EventTypes.EXIT;
  chatId: string;
}

export interface ExpulseEvent extends BaseEvent {
  type: EventTypes.EXPULSE;
  chatId: string;
  targetUserId: string;
  reason?: string;
}

export interface JoinedNoticeEvent extends BaseEvent {
  type: EventTypes.JOINED;
  chatId: string;
  targetUserId: string;
}

export interface MessageEvent extends BaseEvent {
  type: EventTypes.MESSAGE;
  chatId: string;
  content: string;
}