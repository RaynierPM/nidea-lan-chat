import { UserI } from "../../../server/lib/interfaces/User.interface";

export class User implements UserI {
  private _id: UserI['id']

  get id() {
    return this._id
  }

  private _username: string

  get username() {
    return this._username
  }
  
  constructor(id: UserI['id'], username: string) {
    this._id = id
    this._username = username
  }
}