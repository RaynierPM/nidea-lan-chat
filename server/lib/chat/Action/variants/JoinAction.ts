import { EventActionTypes } from "../../../../../common/interfaces/event.interface";
import { UserI } from "../../../../../common/interfaces/User.interface";
import { ActionBase } from "../Action";
import { ActionMetadataI } from "../Action.interface";

type JoinActionPayload = {
  id: UserI['id']
  username: string
}

export class JoinAction extends ActionBase {

  readonly metadata: ActionMetadataI;
  
  constructor(type: EventActionTypes, payload: JoinActionPayload) {
    super(type, payload)
    this.metadata = {
      timestamp: Number(new Date()),
      user: payload.id,
    }
  }
}