import { EventTypes } from "../../../interfaces/event.interface";
import { JoinEventOpts } from "../../../../server/lib/interfaces/Event.interface";
import { EventBase } from "../Event";

export class JoinEvent extends EventBase {
  private _id: string;

  get id() {
    return this._id
  }
  private _username: string;

  get username() {
    return this._username
  }
  private _address: string;

  get address() {
    return this._address
  }
  
  constructor(type: EventTypes, {address, id, username}: JoinEventOpts) {
    super(type, id)
    this._id = id
    this._username = username
    this._address = address  
  }
}