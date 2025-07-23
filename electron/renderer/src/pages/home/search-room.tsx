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
    return <h2 className="text-2xl font-bold text-center mt-10 text-indigo-600">Connecting...</h2>
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{background: 'none'}}>
      <div className="card w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-6">
          <h2 className="text-2xl font-bold text-indigo-700">Search room</h2>
          <button
            disabled={searchingRooms}
            onClick={handleSearch}
            className="accent-primary px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-200 text-base disabled:opacity-50"
          >
            Search
          </button>
        </div>

        {connectionError && (
          <h3 className="p-2 border border-dashed border-red-400 bg-red-100 text-red-800 rounded-md text-sm mb-4">
            An error occurred trying to connect to a room
          </h3>
        )}

        <div className="flex flex-col gap-4">
          {rooms?.map((room, roomIdx) => (
            <div
              key={room.addr + room.port + roomIdx}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-xl shadow border border-gray-200"
            >
              <div>
                <h3 className="font-bold text-lg text-indigo-700">{room.room.name}</h3>
                <p className="text-sm text-gray-600">
                  Owner: <span className="font-medium">{room.room.user.username || "No name added"}</span>
                  <br />
                  {room.room.withPassword && (
                    <span className="text-teal-500 italic">With password</span>
                  )}
                </p>
              </div>
              <button
                onClick={
                  room.room.withPassword
                    ? showPasswordInput(room)
                    : handleConnect(room)
                }
                className="accent-secondary px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-200 text-base"
              >
                Connect
              </button>
            </div>
          ))}

          {!searchingRooms && !rooms?.length && (
            <p className="text-gray-400 text-base text-center">No rooms found.</p>
          )}

          {roomsError && (
            <h3 className="text-red-500 font-medium">Error: {roomsError.message}</h3>
          )}

          {showPassword && (
            <div className="flex justify-between items-center gap-3 bg-indigo-50 p-4 rounded-xl border border-indigo-200">
              <div className="flex items-center gap-2 text-indigo-900">
                <label className="font-semibold">Password:</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="px-3 py-2 rounded border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <button
                onClick={handleConnect(selectedRoom!)}
                className="accent-primary px-5 py-2 rounded-xl font-semibold shadow hover:scale-105 transition-transform duration-200 text-base"
              >
                Connect
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}