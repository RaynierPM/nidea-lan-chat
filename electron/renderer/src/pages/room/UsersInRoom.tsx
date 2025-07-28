import { useAppStore } from "../../store/app"
import { useState } from "react"

const statusColors = {
  ACTIVE: 'text-green-600',
  INACTIVE: 'text-yellow-600',
  DISCONNECTED: 'text-gray-400',
}

function getStatusLabel(status: number | string) {
  if (typeof status === 'number') {
    return ['ACTIVE', 'INACTIVE', 'DISCONNECTED'][status] || 'UNKNOWN'
  }
  return status
}

export function UsersInRoom() {
  const room = useAppStore(state => state.room)
  const me = useAppStore(state => state.user)
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="fixed bottom-4 right-4 z-30 md:hidden bg-indigo-600 text-white rounded-full p-3 shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
        onClick={() => setOpen(v => !v)}
        aria-label="Show users in room"
      >
        <span role="img" aria-label="users">👥</span>
      </button>
      {open && (
        <div
          className="fixed inset-0 z-20 md:hidden"
          style={{ background: 'rgba(0,0,0,0.15)' }}
          onClick={() => setOpen(false)}
        />
      )}
      <div
        className={`card w-full max-w-xs flex flex-col
          md:static md:block
          fixed top-0 left-0 md:left-auto md:right-0 z-30
          md:h-[80vh] h-full max-h-[100vh]
          md:rounded-2xl
          bg-white md:bg-transparent
          transition-transform duration-300
          md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:shadow-none shadow-2xl
        `}
        style={{
          boxShadow: open ? '0 8px 32px 0 rgba(108, 99, 255, 0.18)' : undefined,
        }}
      >
        <div className="flex items-center mb-4">
          <h2 className="text-lg font-bold text-indigo-700 flex-1">Room friends</h2>
          <button
            className="md:hidden text-gray-500 hover:text-indigo-700 text-2xl px-2"
            onClick={() => setOpen(false)}
            aria-label="Close users list"
          >
            ×
          </button>
        </div>
        <ul className="flex flex-col gap-3 overflow-y-auto">
          {room?.participants?.map((participant) => (
            <li key={participant.id} className="flex items-center gap-2 p-2 rounded-lg bg-indigo-50">
              <span className="font-semibold text-indigo-900">{participant.username} {me?.id === participant.id && (
                <span className="text-indigo-600">(Me)</span>
              )}</span>
              <span className={`ml-auto text-xs font-bold ${statusColors[getStatusLabel(participant.status) as keyof typeof statusColors] || 'text-gray-500'}`}>{getStatusLabel(participant.status)}</span>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
} 