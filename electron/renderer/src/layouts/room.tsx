import { Outlet } from "react-router-dom"
import { useAppStore } from "../store/app"
import { useEffect } from "react"

export function RoomLayout() {
  const {room} = useAppStore()

  useEffect(() => {
    if (!room) {
      window.core.getRoom()
    }
  }, [])

  return <Outlet />
}