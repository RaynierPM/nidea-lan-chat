import { useEffect, useRef, useState } from "react"
import { useAppStore } from "../../store/app"
import { Message } from "./Message"
import { UsersInRoom } from "./UsersInRoom"

export function RoomPage() {
  const {room, user: me} = useAppStore()
  const [content, setContent] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
          className="flex gap-2 w-full mt-2"
          onSubmit={e => {
            e.preventDefault()
            sendMessage()
          }}
        >
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
      </div>
      <UsersInRoom />
    </div>
  )
}