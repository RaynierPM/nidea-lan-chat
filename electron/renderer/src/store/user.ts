import { create } from "zustand";
import { RoomInfo } from "../../../../common/interfaces/Chat.interface";

type AppStore = {
  username: string,
  room: RoomInfo | null
}

export const useStore = create<AppStore>((set) => ({
  username: "",
  room: null,
  setRoom: (room: RoomInfo) => {
    set(() => ({
      room,
    }))
  },
  setUsername: (username: string) => {
    set(() => ({
      username,
    }))
  },
}))