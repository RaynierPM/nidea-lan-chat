import { useEffect, useRef, useState } from "react"
import { useAppStore } from "../../store/app"
import { Message } from "./Message"
import { UsersInRoom } from "./UsersInRoom"
import { EventActionTypes } from "../../../../../common/interfaces/event.interface"
import { UserStatuses } from "../../../../../common/interfaces/User.interface"
import { EmojiPicker } from "./EmojiPicker"

export function RoomPage() {
  const {room, user: me} = useAppStore()
  const setRoom = useAppStore(state => state.setRoom)
  const [content, setContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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

  function sendMessage() {
    if (!content.trim().length) return
    window.core.sendMessage({content})
    setContent("")
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }

  useEffect(() => {
    const lastMessage = room?.messages[room.messages.length-1]
    if (lastMessage?.userId === me?.id) scrollRef.current?.scrollIntoView({behavior: "smooth"})
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
    // Do NOT close the emoji picker here
    setTimeout(() => {
      textarea.focus()
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length
    }, 0)
  }

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen gap-6" style={{background: 'none'}}>
      <div className="card w-full max-w-2xl flex flex-col h-[80vh]">
        <div className="mb-2">
          <h2 className="text-xl font-bold text-indigo-700">Room: {room?.roomName || "Loading..."}</h2>
          <h3 className="text-md text-gray-600">Chat: {room?.name || "Loading..."}</h3>
        </div>
        <div 
          className="flex-1 overflow-y-auto px-2 py-2 mb-2 bg-indigo-50 rounded-xl"
          style={{minHeight: '0'}}
        >
          {room?.messages?.map( (message, messageIdx)=> (
            <Message key={`${message.timestamp}${message?.userId}${messageIdx}`} message={message} />
          ))}
          <div ref={scrollRef}/>
        </div>
        <form
          className="flex gap-2 w-full mt-2 items-end"
          onSubmit={e => {
            e.preventDefault()
            sendMessage()
          }}
        >
          <button
            type="button"
            className="text-2xl px-2 py-1 rounded hover:bg-indigo-100 focus:outline-none"
            onClick={() => setShowEmojiPicker(v => !v)}
            tabIndex={-1}
            title="Show emoji picker"
          >
            😊
          </button>
          <textarea
            ref={textareaRef}
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none min-h-[40px] max-h-40"
            placeholder="Type your message... (Enter to send, Shift+Enter for new line)"
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
        {showEmojiPicker && <EmojiPicker onSelect={handleEmojiSelect} />}
      </div>
      <UsersInRoom />
    </div>
  )
}