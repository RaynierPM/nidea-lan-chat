import { UserI } from "../../../common/interfaces/User.interface";
import { GlobalAutoIcrement } from "../../../common/utils/autoIncrementManager";
import { Message } from "./Message";

export class Chat {
  private _id: number;

  get id() {
    return this._id
  }

  private _name: string;

  get name() {
    return this._name
  }

  private _messages: Message[] = []

  get messages() {
    return this._messages
  }

  addMessage(message: Message) {
    this._messages.push(message)
  }
  // Could in future delete OR edit messages

  // Files logic (on future)
  /*
    private _files;
    addFile();
  */

  protected _participants: UserI[] = []

  get participants() {
    return this._participants
  }

  addParticipant(newUser: UserI) {
    if (this.participants.some(u => u.id === newUser.id)) {
      // Notify status change
    } else {
      this._participants.push(newUser)
    }
  }

  expulseParticipant(userId: string) {
    if (this.participants.some(u => u.id === userId)) {
      this._participants = this._participants.filter(u => u.id !== userId)
    }
  }

  recordMessage(message: Message) {
    this._messages.push(message)
  }

  getParticipant(userId: string) {
    return this.participants.find(u => u.id === userId)
  }

  constructor(name: string) {
    this._name = name
    this._id = GlobalAutoIcrement.getInstance().getNext()
  }
}