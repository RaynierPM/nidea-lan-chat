import { Socket } from "net";
import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { ActionI, ActionMetadataI } from "./Action.interface";
import { EventBase } from "../../../../common/lib/Event/Event";
import { Room } from "../Room";

export abstract class ActionBase implements ActionI {
  private _type: EventActionTypes

  protected abstract _payload: unknown

  get payload() {
    return this._payload
  }

  get type() {
    return this._type
  }

  abstract readonly metadata: ActionMetadataI

  constructor(type: EventActionTypes) {
    this._type = type
  }

  abstract handle(socket:Socket, room: Room): void 
}