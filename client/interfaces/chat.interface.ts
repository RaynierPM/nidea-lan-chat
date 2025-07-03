import { UserStatuses } from "../../common/interfaces/User.interface";

export type ChatInfo = {
  id: number;
  name: string;
  messages: {
      content: string;
      userId: string | null;
      timestamp: number;
  }[];
  participants: {
      id: string;
      username: string;
      status: UserStatuses;
      timestamp: number;
  }[]
}

export interface RoomInfo extends ChatInfo {
  chats: ChatInfo[]
}