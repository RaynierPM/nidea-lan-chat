import { UserI } from "../interfaces/User.interface";

export abstract class EventBase {
  private _author?: UserI['id']

  get author() {
    return this._author
  }
  private _type: string;

  get type(): string {
    return this._type
  }

  constructor(type: string, author: UserI['id']) {
    this._type = type
    !!author && (this._author = author)
  }
}