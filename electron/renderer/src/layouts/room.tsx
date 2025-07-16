import { useEffect } from "react"
import { useAppStore } from "../store/app"
import { MessageEvent, MessageEventPayload } from "../../../../common/lib/Event/variants/MessageEvent"
import { MessageI } from "../../../../common/interfaces/message.interface"
import { RoomInfo } from "../../../../common/interfaces/Chat.interface"
import { EventActionTypes } from "../../../../common/interfaces/event.interface"
import { GetHistoryEvent } from "../../../../common/lib/Event/variants/GetHistory.event"
import { Outlet } from "react-router-dom"

export function RoomLayout() {
  const {
    addMessage,
    setRoom
  } = useAppStore()

  useEffect(() => {
    window.core.on(EventActionTypes.GET_HISTORY, (event: GetHistoryEvent) => {
      setRoom(event.payload as RoomInfo)
    })

    window.core.on(EventActionTypes.MESSAGE, (event: MessageEvent) => {
      const payload: MessageEventPayload = event.payload as MessageEventPayload
      const message: MessageI = {
        content: payload.content,
        timestamp: event.timestamp,
        userId: event.authorId ?? null
      }
      addMessage(message, payload.roomId)
    })
  }, [])

  return <Outlet />
}