import { EventCommand } from "../interfaces/Event.interface";
import { UserI } from "../interfaces/User.interface";

export abstract class EventBase implements EventCommand {
  private _author?: UserI

  get author() {
    return this._author
  }
  private _type: string;

  get type(): string {
    return this._type
  }

  constructor(type: string) {
    this._type = type
  }

  abstract execute<T>(): T
}