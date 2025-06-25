import { EventTypes } from "../../../common/interfaces/event.interface";
import { UserI } from "../interfaces/User.interface";

export abstract class EventBase {
  private _author?: UserI['id']

  get author() {
    return this._author
  }
  private _type: EventTypes;

  get type(): EventTypes {
    return this._type
  }

  constructor(type: EventTypes, author: UserI['id']) {
    this._type = type
    !!author && (this._author = author)
  }
}