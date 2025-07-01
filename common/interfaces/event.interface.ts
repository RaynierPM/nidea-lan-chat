import { UserI } from "./User.interface";

export type EventEssential = {type: EventActionTypes, authorId: string}

export enum EventActionTypes {
  JOIN = "JOIN_EVENT",
  MESSAGE = "MESSAGE_EVENT",
  DISCONNECT = "DISCONNECT_EVENT",
  CONNECT = "CONNECT_EVENT",
  GET_HISTORY = "GET_HISTORY_EVENT",
  // On future
  EXIT = "EXIT_EVENT",
  EXPULSE = "EXPULSION_EVENT",
}

export interface Event {
  type: EventActionTypes
  authorId: UserI['id']
  payload: unknown
}