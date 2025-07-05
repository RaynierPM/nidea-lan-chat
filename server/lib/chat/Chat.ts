import { GlobalAutoIcrement } from "../../../common/utils/autoIncrementManager";
import { Participant } from "../User/Participant";
import { Message } from "./Message";
import { JoinEvent } from "../../../common/lib/Event/variants/JoinEvent";
import { MessageEvent } from "../../../common/lib/Event/variants/MessageEvent";
import { SocketWithId } from "../interfaces/socket.interface";
import { ConnectEvent } from "../../../common/lib/Event/variants/Connect.event";
import { DisconnectEvent } from "../../../common/lib/Event/variants/Disconnect.event";
import { ChatInfo } from "../../../client/interfaces/chat.interface";
import { EventBase } from "../../../common/lib/Event/Event";
import { AbanadonAction } from "./Action/variants/AbandonAction";
import { AbandonEvent } from "../../../common/lib/Event/variants/Abandon.event";

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
    this.notifyAll(
      new MessageEvent({
        content: message.content,
        roomId: this._id
      }, message.userId || undefined)
    )
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
    this._participants.push(newUser)
    newUser.notify(new ConnectEvent(newUser.id))
    this.notifyAll(user => {
      user.notify(new JoinEvent(
        user.id, 
        {
          username: newUser.username, 
          userId: newUser.id,
          status: newUser.status,
          timestamp: newUser.timestamp
        }
      ))
    })
  }

  disconnect(userId: string) {
    const user = this.getParticipant(userId)
    if (user) {
      user.disconnect()
      this.notifyAll(new DisconnectEvent(user.id))
    }
  }

  connect(userId: string, socket: SocketWithId) {
    const user = this.getParticipant(userId)
    if (user) {
      user.connect(socket)
      this.notifyAll(new ConnectEvent(userId))
    }
  }

  removeParticipant(userId: string) {
    const participant = this.participants.find(part => part.id === userId)
    if (participant) {
      this._participants = this._participants.filter(u => u.id !== userId)
      participant.notify(new MessageEvent({
        content: "You abandoned chat.",
        roomId: this._id
      }))
      this.addMessage(new Message(null, `${participant.username} has abandoned this chat.`))
      this.notifyAll(new AbandonEvent({userId}))
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

  notifyAll(event: EventBase | ((part: Participant) => void)) {
    if (typeof event === 'function') {
      this.participants.forEach(event)
    } else {
      this.participants.forEach(part => {
        part.notify(event)
      })
    }
  }
}