import { UserStatuses } from "../../../common/interfaces/User.interface";
import { GlobalAutoIcrement } from "../../../common/utils/autoIncrementManager";
import { Participant } from "../User/Participant";
import { Message } from "./Message";
import { JoinEvent } from "../../../common/lib/Event/variants/JoinEvent";
import { MessageEvent } from "../../../common/lib/Event/variants/MessageEvent";
import { SocketWithId } from "../interfaces/socket.interface";
import { ConnectEvent } from "../../../common/lib/Event/variants/Connect.event";
import { ChatInfo } from "../interfaces/Chat.interface";
import { DisconnectEvent } from "../../../common/lib/Event/variants/Disconnect.event";

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
    this._participants.forEach(usr => {
      usr.notify(new MessageEvent(usr.id, {
        content: message.content,
        roomId: this._id
      }))
    })
  }
  // Could in future delete OR edit messages

  // Files logic (on future)
  /*
    private _files;
    addFile();
  */

  protected _participants: Participant[] = []

  get participants() {
    return this._participants
  }

  constructor(name: string) {
    this._name = name
    this._id = GlobalAutoIcrement.getInstance().getNext()
  }

  addParticipant(newUser: Participant) {
    const participant = this.getParticipant(newUser.id)
    if (participant) {
      participant.status = UserStatuses.ACTIVE
      console.log("User is connected again")
    } else {
      this._participants.push(newUser)
      this.participants.forEach(user => {
        user.notify(new JoinEvent(
          user.id, 
          {
            username: user.username, 
            userId: user.id,
            status: user.status,
            timestamp: user.timestamp
          }
        ))
      })
    }
  }

  disconnect(userId: string) {
    const user = this.getParticipant(userId)
    if (user) {
      user.disconnect()
      this.participants.forEach(participant => {
        participant.notify(new DisconnectEvent(user.id))
      })
    }
  }

  connect(userId: string, socket: SocketWithId) {
    const user = this.getParticipant(userId)
    if (user) {
      user.connect(socket)
      user.notify(new ConnectEvent(user.id))
    }
  }

  expulseParticipant(userId: string) {
    if (this.participants.some(u => u.id === userId)) {
      this._participants = this._participants.filter(u => u.id !== userId)
    }
  }

  getParticipant(userId: string) {
    return this.participants.find(u => u.id === userId)
  }

  getChatInfo():ChatInfo {
    return {
      id: this.id,
      name: this.name,
      messages: this.messages.map(msg => msg.getData()),
      participants: this.participants.map(participant => participant.getData())
    }
  }
}