import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "../../store/app"

export function InitPage() {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  const setUser = useAppStore((state) => state.setUser)
  async function handleInit() {
    if (username.trim()) {
      try {
        setUser(await window.core.init(username))
        navigate("/")
      } catch (err) {
        alert((err as Error)?.message || "Unexpected error")
      }
    } 
  }

  useEffect(() => {
    window.core.getUser()
    .then(user => {
      if (user) {
        navigate("/")
      }
    })
  }, [])

  return (
    <div className="flex justify-center items-center min-h-screen" style={{background: 'none'}}>
      <div className="card w-full max-w-sm flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-center mb-6" style={{color: '#6C63FF'}}>Login</h2>
        <div className="mb-4 w-full">
          <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
          <input
            type="text"
            placeholder="Papotico's"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleInit}
          className="accent-primary w-full py-2 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg mt-4"
        >
          Login
        </button>
      </div>
    </div>
  );
}