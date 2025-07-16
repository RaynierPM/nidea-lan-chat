import { useState } from "react"
import { useAppStore } from "../../store/app"
import { Message } from "./Message"

export function RoomPage() {
  const {room} = useAppStore()
  const [content, setContent] = useState("")

  function sendMessage() {
    if (!content.trim().length) return
    window.core.sendMessage({content})
    setContent("")
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        alignItems: "center",
        height: "100vh",
        padding: "10px 25px"
      }}
    >
      <div style={{width: "100%"}}>
        <h2>Room: {room?.roomName || "Loading..."}</h2>
        <h3>Chat: {room?.name || "Loading..."}</h3>
      </div>
      <div 
        style={{
          flex: "1",
          borderRadius: "25px",
          padding: "10px",
          border: "1px white solid",
          width: "100%",
          overflowY: "auto",
        }}
      >
        {room?.messages?.map( message => (
          <Message message={message} />
        ))}
      </div>
      <form
        style={{
          display: "flex",
          gap: "2",
          width: "100%",
        }}
        onSubmit={e => {
          e.preventDefault()
          sendMessage()
        }}
      >
        <input 
          type="text" 
          style={{flex: "1", borderRadius: "5px"}} 
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <button>Send &gt;</button>
      </form>
    </div>
  )
}