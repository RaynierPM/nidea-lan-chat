import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";
import { GetHistoryEvent } from "../../../../common/lib/Event/variants/GetHistory.event";
import { RoomInfo } from "../../../../common/interfaces/Chat.interface";
import { MessageEvent, MessageEventPayload } from "../../../../common/lib/Event/variants/MessageEvent";
import { MessageI } from "../../../../common/interfaces/message.interface";
import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { JoinEvent, JoinEventPayload } from "../../../../common/lib/Event/variants/JoinEvent";
import { AbandonEvent, AbandonEventPayload } from "../../../../common/lib/Event/variants/Abandon.event";

export function RootLayout() {
  const navigate = useNavigate()
  const {
    setUser,
    setRoom,
    addMessage,
    addParticipant,
    removeParticipant
  } = useAppStore()

  useEffect(() => {
    let cleanUpHistory = window.core.on(EventActionTypes.GET_HISTORY, (event: GetHistoryEvent) => {
      setRoom(event.payload as RoomInfo)
    })

    let messageCleanUp = window.core.on(EventActionTypes.MESSAGE, (event: MessageEvent) => {
      const payload = event.payload as MessageEventPayload
      const message: MessageI = {
        content: payload.content,
        timestamp: event.timestamp,
        userId: event.authorId ?? null,
      }
      addMessage(message, payload.roomId)
    })

    let joinCleanUp = window.core.on(EventActionTypes.JOIN, (event: JoinEvent) => {
      const payload = event.payload as JoinEventPayload
      addParticipant({
        id: payload.userId,
        username: payload.username,
        status: payload.status,
        timestamp: payload.timestamp,
      })
    })

    let abandonCleanUp = window.core.on(EventActionTypes.ABANDON, (event: AbandonEvent) => {
      const payload = event.payload as AbandonEventPayload
      removeParticipant(payload.userId)
    })

    return () => {
      cleanUpHistory()
      messageCleanUp()
      joinCleanUp()
      abandonCleanUp()
    }
  }, [])

  useEffect(() => {
    window.core.getUser()
    .then(user => {
      if (!user) {
        navigate("/auth")
      } else {
        setUser(user)
      }
    })
  }, [])

  return <>
    <Outlet />
  </>
}