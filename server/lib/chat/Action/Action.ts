import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { ActionI, ActionMetadataI } from "./Action.interface";
import { Room } from "../Room";
import { SocketWithId } from "../../interfaces/socket.interface";

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

  abstract handle(socket:SocketWithId, room: Room): void 

  toJson() {
    return JSON.stringify({
      type: this.type,
      payload: this.payload,
      metadata: this.metadata,
    })
  }
}