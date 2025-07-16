import { create } from "zustand";
import { RoomInfo } from "../../../../common/interfaces/Chat.interface";
import { UserI } from "../../../../common/interfaces/User.interface";
import { MessageI } from "../../../../common/interfaces/message.interface";
import { ValidationError } from "../../../../client/errors/core.error";

type AppStore = {
  user: UserI | null,
  room: RoomInfo | null,
  setRoom: (room: RoomInfo) => void,
  setUser: (username: UserI) => void,
  addMessage: (message: MessageI, roomId?: number) => void
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  room: null,
  setRoom: (room: RoomInfo) => {
    set(() => ({
      room,
    }))
  },
  setUser: (user: UserI) => {
    set(() => ({
      user: user,
    }))
  },
  addMessage: (message: MessageI, roomId?: number) => {
    const room = get().room
    console.log(room)
    console.log({message})
    if (!room) throw new ValidationError("Not allowed action")
    if (roomId && roomId !== room.id) {
      // Not added feature
    }else {
      set((state) => ({
        room: {
          ...state.room!,
          messages: [...state.room!.messages, message],
        },
      }))
    }
  }
}))