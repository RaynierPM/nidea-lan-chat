import { UserI } from "./User.interface";

export enum EventActionTypes {
  JOIN = "JOIN_EVENT",
  MESSAGE = "MESSAGE_EVENT",
  EXIT = "EXIT_EVENT",
  EXPULSE = "EXPULSION_EVENT",
}

export interface Event {
  type: EventActionTypes
  authorId: UserI['id']
  payload: unknown
}