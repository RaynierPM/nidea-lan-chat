import { UserI, UserStatuses } from "./User.interface"

export type ConnectionInfo = {
  room: PublicRoomInfo
  addr: string
  port: number
}

export type PublicRoomInfo = {
  id: number
  name: string
  withPassword: boolean
  user: Pick<UserI, 'id'> & Pick<UserI, 'username'>
}

export type ParticipantInfo = UserI & {
  status: UserStatuses
  timestamp: number
}

export type ChatInfo = {
  id: number;
  name: string;
  messages: {
      content: string;
      userId: string | null;
      timestamp: number;
  }[];
  participants: ParticipantInfo[]
}

export interface RoomInfo extends ChatInfo {
  owner: UserI
  roomName: string
  chats: ChatInfo[]
}