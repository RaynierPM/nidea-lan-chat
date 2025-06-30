import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { ActionI, ActionMetadataI } from "./Action.interface";

export abstract class ActionBase implements ActionI {
  private _type: EventActionTypes

  private _payload: unknown

  get payload() {
    return this._payload
  }

  get type() {
    return this._type
  }

  abstract readonly metadata: ActionMetadataI

  constructor(type: EventActionTypes, payload: unknown) {
    this._type = type
    this._payload = payload
  }
}