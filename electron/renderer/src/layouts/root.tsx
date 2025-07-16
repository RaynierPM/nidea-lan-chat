import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { RoomInfo } from "../../../../common/interfaces/Chat.interface";
import { useAppStore } from "../store/app";
import { GetHistoryEvent } from "../../../../common/lib/Event/variants/GetHistory.event";
import { MessageI } from "../../../../common/interfaces/message.interface";
import { MessageEvent, MessageEventPayload } from "../../../../common/lib/Event/variants/MessageEvent";

export function RootLayout() {
  const navigate = useNavigate()
  const {
    setRoom,
    addMessage,
    setUser
  } = useAppStore()
  
  useEffect(() => {
    window.core.getUser()
    .then(user => {
      if (!user) {
        navigate("/auth")
      } else {
        window.core.getRoom()
        .then(room => {
          if (room) {
            setRoom(room)
          }
        })
        window.core.getUser()
        .then(user => {
          if (user) {
            setUser(user)
          }
        })
      }
    })
  }, [])

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

  return <>
    <Outlet />
  </>
}