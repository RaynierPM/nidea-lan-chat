import { useNavigate } from "react-router-dom"

export function HomePage() {
  const navigate = useNavigate()
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center" style={{background: 'none'}}>
      <div className="card flex flex-col items-center w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center mb-6" style={{color: '#6C63FF'}}>Welcome to LAN Chat!</h1>
        <p className="text-lg text-gray-600 mb-8 text-center">Connect, chat, and share with friends on your local network.</p>
        <div className="flex gap-6 w-full justify-center">
          <button
            onClick={() => navigate('/search-room')}
            className="accent-primary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg"
          >
            Search a room
          </button>
          <button
            onClick={() => navigate('/host-room')}
            className="accent-secondary px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg"
          >
            Host a room
          </button>
        </div>
      </div>
    </div>
  );
}

export { HostRoomPage } from "./host-room";