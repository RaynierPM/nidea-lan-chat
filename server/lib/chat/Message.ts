import { UserI } from "../interfaces/User.interface"

export class Message {
  private _user: UserI

  get user() {
    return this._user
  }
  
  private _content: string
  
  get content() {
    return this._content
  }

  private _timestamp: number

  get date() {
    return new Date(this._timestamp)
  }

  get timestampt() {
    return this._timestamp
  }

  constructor(user:UserI, content: string) {
    this._content = content
    this._user = user
    this._timestamp = Number(new Date())
  }
}