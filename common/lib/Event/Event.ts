import { InvalidEventType } from "../../../server/errors/event/InvalidEventType";
import { Event, EventActionTypes } from "../../interfaces/event.interface";

export abstract class EventBase implements Event {
  public type: EventActionTypes;
  public authorId?: string;
  public payload: unknown;
  public readonly timestamp = Number(new Date())

  constructor(type: EventActionTypes, authorId?: string) {
    if (!Object.values(EventActionTypes).includes(type)) throw new InvalidEventType(type)
    this.type = type
    this.authorId = authorId
  }

  protected abstract validate(payload: unknown): void

  toJson() {
    const mappedEvent = {
      type: this.type,
      authorId: this.authorId,
      payload: this.payload,
      timestamp: this.timestamp
    }
    return JSON.stringify(mappedEvent)
  }
}