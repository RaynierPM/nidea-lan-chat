import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { UserI } from "../../../../common/interfaces/User.interface";
import { Chat } from "../Chat";

export interface ActionMetadataI {
  room?: Chat['_id']
  user?: UserI['id']
  timestamp: number
}

export interface ActionI {
  type: EventActionTypes  
  payload: unknown
  metadata: ActionMetadataI
}

export interface RawAction {
  type: EventActionTypes
  payload: unknown
}