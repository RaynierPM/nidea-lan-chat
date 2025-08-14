import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";
import { GetHistoryEvent } from "../../../../common/lib/Event/variants/GetHistory.event";
import { RoomInfo } from "../../../../common/interfaces/Chat.interface";
import { MessageEvent, MessageEventPayload } from "../../../../common/lib/Event/variants/MessageEvent";
import { MessageI } from "../../../../common/interfaces/message.interface";
import { EventActionTypes } from "../../../../common/interfaces/event.interface";
import { JoinEvent, JoinEventPayload } from "../../../../common/lib/Event/variants/JoinEvent";
import { AbandonEvent, AbandonEventPayload } from "../../../../common/lib/Event/variants/Abandon.event";
import { DisconnectModal } from "../components/features/room/DisconnectModal";
import { UserStatuses } from "../../../../common/interfaces/User.interface";

export function RootLayout() {
  const navigate = useNavigate()
  const [disconnected, setDisconnected] = useState(false)
  const {
    setUser,
    setRoom,
    addMessage,
    addParticipant,
    removeParticipant,
    updateParticipant,
    room
  } = useAppStore()

  useEffect(() => {
    if (!room) {
      window.core.getRoom()
    }
  
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

    const cleanConnect = window.core.on(EventActionTypes.CONNECT, (event) => {
      updateParticipant(event.authorId, {status: UserStatuses.ACTIVE}) // 0 = ACTIVE
    })
    const cleanDisconnect = window.core.on(EventActionTypes.DISCONNECT, (event) => {
      updateParticipant(event.authorId, {status: UserStatuses.DISCONNECTED}) // 2 = DISCONNECTED
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
      cleanConnect && cleanConnect()
      cleanDisconnect && cleanDisconnect()
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
  

  useEffect(() => {
    const cleanup = window.core.onDisconnect(() => {
      console.log({disconnected})
      setDisconnected(true)
      setRoom(null)
    })
    return cleanup
  }, [])

  return <>
    <Outlet />
    <DisconnectModal
      open={disconnected}
      onClose={() => {
        setDisconnected(false)
        navigate("/", { replace: true })
      }}
      message={"The server has been closed or you have been disconnected from the network."}
    />
  </>
}