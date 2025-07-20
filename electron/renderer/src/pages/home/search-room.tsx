import { useState } from "react"
import { ValidationError } from "../../../../../client/errors/core.error"
import { ConnectionInfo } from "../../../../../common/interfaces/Chat.interface"
import { useLoading } from "../../hooks/useLoading"
import { useNavigate } from "react-router-dom"
import { AlreadyConnectedError } from "../../../../../client/errors/socket"

export function SearchRoomsPage() {
  
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<ConnectionInfo | null>(null)
  const navigate = useNavigate()

  const {
    clear: clearRooms,
    data: rooms,
    error: roomsError,
    execute: searchRooms,
    loading: searchingRooms
  } = useLoading<ConnectionInfo[], ValidationError>()

  const {
    loading: connecting,
    error: connectionError,
    execute: connect
  } = useLoading()

  function resetPasswordInput() {
    setSelectedRoom(null)
    setShowPassword(false)
    setPassword("")
  }

  function handleSearch() {
    clearRooms()
    resetPasswordInput()
    searchRooms(window.core.searchRooms)
  }

  function handleConnect(connInfo: ConnectionInfo) {
    return () => {
      if (!connInfo) return
      setShowPassword(false)
      connect(window.core.connectRoom, connInfo.addr, connInfo.port, password)
      .then(() => {navigate("/room")})
      .catch((err) => {
        if (err instanceof AlreadyConnectedError) navigate('/room')
      })
    }
  }

  function showPasswordInput(room: ConnectionInfo) {
    return () => {
      setShowPassword(true)
      setSelectedRoom(room)
    }
  }

  if (connecting) {
    return <h2>
      Connecting...
    </h2>
  }

  return <div
    style={{
      display: "flex",
      flexDirection: "column",
      padding: "5px",
      gap: "4px"
    }}
  >
    <div style={{display: "flex", gap: "5px"}}>
      <h2>Search room</h2>
      <button
        disabled={searchingRooms}
        onClick={handleSearch}
      >
        Search
      </button>
    </div>
    
    {connectionError && <h3 style={{padding: "10px 5px", border: "dashed 1px #f99", borderRadius: "10px"}}>Has been ocurred an error trying to connect to a room</h3>}

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "7px 4px",
      }}
    >
      {rooms?.map((room, roomIdx) => (
        <div 
          key={room.addr+room.port+roomIdx}
          style={{
            color: "#fff", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center"
          }}
        >
          <div>
            <h3>{room.room.name}</h3>
            <p>
              Owner: {room.room.user.username || "No name added"}
              <br />
              {room.room.withPassword && <span style={{color: "#85A498", fontStyle: "italic"}}>With password</span>}
            </p>
          </div>
          <button
            onClick={room.room.withPassword? showPasswordInput(room) : handleConnect(room)}
          >
            connect
          </button>
        </div>
      ))}
      {!searchingRooms && !rooms?.length }
      {roomsError && <h3>Error: {roomsError.message}</h3>}
      {showPassword && (
        <div
          style={{display: "flex", justifyContent: "space-between"}}
        >
          <div>
            <label style={{display: "inline-block", color: "white", marginRight: "10px"}}>Password: </label>
            <input 
              type="password" 
              placeholder="********"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
              }}
            />
          </div>
          <button
            onClick={handleConnect(selectedRoom!)}
          >
            Connect
          </button>
        </div>
      )}
    </div>
  </div>
}