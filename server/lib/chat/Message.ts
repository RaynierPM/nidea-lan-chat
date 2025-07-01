import { UserI } from "../../../common/interfaces/User.interface"
import { TimestampUtils } from "../../../common/utils/timestamp"

export class Message {
  private _user: UserI['id']

  get user() {
    return this._user
  }
  
  private _content: string
  
  get content() {
    return this._content
  }

  private _timestamp: number

  get date() {
    return TimestampUtils.getDateFrom(this._timestamp)
  }

  get timestamp() {
    return this._timestamp
  }

  constructor(userId:UserI['id'], content: string) {
    this._content = content
    this._user = userId
    this._timestamp = TimestampUtils.getTimestampFrom()
  }
}