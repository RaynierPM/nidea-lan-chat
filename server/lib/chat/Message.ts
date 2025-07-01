import { UserI } from "../../../common/interfaces/User.interface"
import { TimestampUtils } from "../../../common/utils/timestamp"

export class Message {
  private _userId: UserI['id'] | null

  get userId() {
    return this._userId
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
    this._userId = userId
    this._timestamp = TimestampUtils.getTimestampFrom()
  }

  getData() {
    return {
      content: this.content,
      userId: this.userId,
      timestamp: this.timestamp
    }
  }
}