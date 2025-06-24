import { UserI, UserStatuses } from "../../../server/lib/interfaces/User.interface";

export class User implements UserI {
  private _id: string
  get id() {
    return this._id
  }
  
  private _username: string
  get username() {
    return this._username
  }
  
  private _status: UserStatuses
  get status() {
    return this._status
  }
  
  private _address: string
  get address() {
    return this._address
  }
  
  private _createdAt: Date
  get createdAt() {
    return this._createdAt
  }
  
  constructor(id: string, username: string, address: string) {
    this._id = id
    this._username = username
    this._status = UserStatuses.ACTIVE
    this._address = address
    this._createdAt = new Date()
  }

  getConnData(): { address: UserI["address"]; id: UserI["id"]; } {
    return {
      address: this.address,
      id: this.id
    }
  }
}