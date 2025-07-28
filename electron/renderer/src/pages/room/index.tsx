import { useEffect, useRef, useState } from "react"
import { useAppStore } from "../../store/app"
import { Message } from "./Message"
import { UsersInRoom } from "./UsersInRoom"
import { EventActionTypes } from "../../../../../common/interfaces/event.interface"
import { UserStatuses } from "../../../../../common/interfaces/User.interface"
import { EmojiPicker } from "../../components/EmojiPicker"
import { useNavigate } from "react-router-dom"
import { BackToHomeButton } from "../../components/BackToHomeButton"
import { Icon } from "@iconify/react/dist/iconify.js"
import { DisconnectModal } from "../../components/features/room/DisconnectModal"
import { PopOver } from "../../components/common/pop-over"

export function RoomPage() {
  const {room } = useAppStore()
  const setRoom = useAppStore(state => state.setRoom)
  const [content, setContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [disconnected, setDisconnected] = useState(false)
  const [autoScrollOnMsg, setAutoScrollOnMsg] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const textaeraDebounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  const navigate = useNavigate()

  // Helper to update a participant's status in the room
  function updateParticipantStatus(userId: string, status: number) {
    if (!room) return
    setRoom({
      ...room,
      participants: room.participants.map(p =>
        p.id === userId ? { ...p, status } : p
      )
    })
  }

  useEffect(() => {
    // Listen for CONNECT and DISCONNECT events
    const cleanConnect = window.core.on(EventActionTypes.CONNECT, (event) => {
      updateParticipantStatus(event.authorId, UserStatuses.ACTIVE) // 0 = ACTIVE
    })
    const cleanDisconnect = window.core.on(EventActionTypes.DISCONNECT, (event) => {
      updateParticipantStatus(event.authorId, UserStatuses.DISCONNECTED) // 2 = DISCONNECTED
    })
    return () => {
      cleanConnect && cleanConnect()
      cleanDisconnect && cleanDisconnect()
    }
  }, [room])

  useEffect(() => {
    const cleanup = window.core.onDisconnect(() => {
      setDisconnected(true)
      setRoom(null)
    })
    return cleanup
  }, [])

  function sendMessage() {
    if (!content.trim().length) return
    window.core.sendMessage({content})
    setContent("")
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  function scrollToBottom() {
    scrollRef.current?.scrollIntoView({behavior: "smooth"})
  }

  useEffect(() => {
    if (autoScrollOnMsg) scrollToBottom()
  }, [room?.messages])

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(e.target.value)
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }

  // Insert emoji at cursor position
  function handleEmojiSelect(emoji: string) {
    if (!textareaRef.current) return
    const textarea = textareaRef.current
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newValue = content.slice(0, start) + emoji + content.slice(end)
    setContent(newValue)
    clearTimeout(textaeraDebounceRef.current)
    textaeraDebounceRef.current = setTimeout(() => {
        textareaRef.current?.focus()
      },
      500
    )
  }

  function handleMessageScroll(e: React.UIEvent<HTMLDivElement>) {
    const {scrollTop, scrollHeight, clientHeight} = e.currentTarget
    const scrollPosY = (scrollHeight-scrollTop)-clientHeight
    if (scrollPosY <= 150 ) {
      setAutoScrollOnMsg(true)
    }else {
      setAutoScrollOnMsg(false)
    }
  }

  return (
    <div>
      <DisconnectModal
        open={disconnected}
        onClose={() => {
          setDisconnected(false)
          navigate("/", { replace: true })
        }}
        message={"The server has been closed or you have been disconnected from the network."}
      />
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-6" style={{background: 'none'}}>
        <div className="card w-full max-w-2xl flex flex-col h-[80vh]">
          <BackToHomeButton className="mb-2" />
          <div className="mb-2">
            <h2 className="text-xl font-bold text-indigo-700">Room: {room?.roomName || "Loading..."}</h2>
            <h3 className="text-md text-gray-600">Chat: {room?.name || "Loading..."}</h3>
          </div>
          <div 
            className="flex-1 overflow-y-auto px-2 py-2 mb-2 bg-indigo-50 rounded-xl relative"
            style={{minHeight: '0'}}
            onScroll={handleMessageScroll}
          >
            {room?.messages?.map( (message, messageIdx)=> (
              <Message key={`${message.timestamp}${message?.userId}${messageIdx}`} message={message} />
            ))}
            <div ref={scrollRef}/>
            {!autoScrollOnMsg && <div 
              className="rounded-full size-10 ml-auto sticky bottom-1 !right-1 text-indigo-600 font-bold animate-bounce bg-white flex items-center justify-center cursor-pointer"
              onClick={scrollToBottom}
            >
              <Icon icon="material-symbols:arrow-downward-rounded" className="text-2xl" />
            </div>}
          </div>
          <form
            className="flex gap-2 w-full mt-2 items-end"
            onSubmit={e => {
              e.preventDefault()
              sendMessage()
            }}
          >
            <PopOver
              triggerElement={
                <button
                  type="button"
                  className="text-2xl px-2 py-1 rounded hover:bg-indigo-100 focus:outline-none"
                  onClick={() => setShowEmojiPicker(v => !v)}
                  tabIndex={-1}
                  title="Show emoji picker"
                >
                  😊
                </button>
              }
              position="top"
              isOpen={showEmojiPicker}
              onOpenChange={setShowEmojiPicker}
              className="min-w-[400px]"
            >
              <EmojiPicker onSelect={handleEmojiSelect} className="max-h-[250px] overflow-y-auto" />
            </PopOver>
            <textarea
              ref={textareaRef}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none min-h-[40px] max-h-40"
              placeholder="Type your message..."
              value={content}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              type="submit"
              className="accent-primary px-6 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-200"
              title="Send (Enter)"
            >Send &gt;</button>
          </form>
        </div>
        <UsersInRoom />
      </div>
    </div>
  )
}