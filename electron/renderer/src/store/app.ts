import { create } from "zustand";
import { ParticipantInfo, RoomInfo } from "../../../../common/interfaces/Chat.interface";
import { UserI } from "../../../../common/interfaces/User.interface";
import { MessageI } from "../../../../common/interfaces/message.interface";
import { ValidationError } from "../../../../client/errors/core.error";

type AppStore = {
  user: UserI | null,
  room: RoomInfo | null,
  setRoom: (room: RoomInfo | null) => void,
  setUser: (username: UserI) => void,
  addMessage: (message: MessageI, roomId?: number) => void,
  addParticipant: (participant: ParticipantInfo) => void,
  removeParticipant: (userId: UserI['id']) => void,
  updateParticipant: (userId: UserI['id'], participant: Partial<UserI & ParticipantInfo>) => void,
  getParticipant: (userId: UserI["id"])=> (UserI & ParticipantInfo) | undefined
}

export const useAppStore = create<AppStore>((set, get) => ({
  user: null,
  room: null,
  setRoom: (room: RoomInfo | null) => {
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
  },
  removeParticipant: (userId: UserI['id']) => {
    const room = get().room
    if (!room) throw new ValidationError("Not allowed action")
    set((state) => ({
      room: {
        ...state.room!,
        participants: state.room!.participants.filter(part => part.id !== userId),
      },
    }))
  },
   addParticipant: (participant: ParticipantInfo) => {
    const room = get().room
    if (!room) throw new ValidationError("Not allowed action")
    set((state) => ({
      room: {
        ...state.room!,
        participants: [...state.room!.participants, participant],
      },
    }))
  },
  updateParticipant(userId, participant) {
    if (!get().room) return
    set((state) => ({
      room: {
        ...state.room!,
        participants: state.room!.participants.map(p =>
          p.id === userId ? { ...p, ...participant } : p
        )
      }
    }))
  },
  getParticipant(userId) {
    return get()?.room?.participants.find(user => user.id === userId)
  }
}))