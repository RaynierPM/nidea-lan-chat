import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function HostRoomPage() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await window.core.createServer({
        name,
        password: password || undefined,
        isHidden,
      });
      setSuccess(true);
      try {
        await window.core.connectRoom({host: "127.0.0.1", password});
        navigate("/room");
      } catch (connErr: any) {
        setError(connErr?.message || "Room created, but failed to connect to your own room.");
        setSuccess(false);
      }
    } catch (err: any) {
      setError(err?.message || "Failed to host room");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{background: 'none'}}>
      <div className="card w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-indigo-700 mb-6">Host a Room</h2>
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Room Name</label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password (optional)</label>
            <input
              type="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isHidden"
              checked={isHidden}
              onChange={e => setIsHidden(e.target.checked)}
            />
            <label htmlFor="isHidden" className="text-sm text-gray-700">Hidden Room</label>
          </div>
          <button
            type="submit"
            className="accent-primary w-full py-2 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform duration-200 text-lg mt-2"
            disabled={loading}
          >
            {loading ? "Hosting..." : "Host Room"}
          </button>
          {error && <div className="text-red-600 text-center">{error}</div>}
          {success && <div className="text-green-600 text-center">Room hosted! Connecting...</div>}
        </form>
      </div>
    </div>
  );
} 