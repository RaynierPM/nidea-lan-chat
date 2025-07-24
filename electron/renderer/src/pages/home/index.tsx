import { useNavigate } from "react-router-dom"
import { useAppStore } from "../../store/app"

export function HomePage() {
  const navigate = useNavigate()
  const { room } = useAppStore()
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center" style={{background: 'none'}}>
      <div className="card flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-6" style={{color: '#6C63FF'}}>Welcome to LAN Chat!</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Connect, chat, and share with friends on your local network.</p>
        <div className="flex gap-6 w-full justify-center">
          <button
            onClick={() => navigate('/search-room')}
            className="accent-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg cursor-pointer"
          >
            Search a room
          </button>
          <button
            onClick={() => navigate('/host-room')}
            className="accent-secondary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg cursor-pointer"
          >
            Host a room
          </button>
        </div>
        {room && (
          <button
            onClick={() => navigate('/room')}
            className="mt-6 w-full px-8 py-3 rounded-xl font-semibold shadow-lg bg-indigo-200 text-indigo-700 hover:bg-indigo-300 hover:scale-105 transition-all duration-200 text-lg cursor-pointer"
          >
            Return to Room
          </button>
        )}
      </div>
    </div>
  );
}

export { HostRoomPage } from "./host-room";