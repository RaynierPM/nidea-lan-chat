import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppStore } from "../store/app";

export function RootLayout() {
  const navigate = useNavigate()
  const {
    setRoom,
    setUser
  } = useAppStore()
  
  useEffect(() => {
    window.core.getUser()
    .then(user => {
      if (!user) {
        navigate("/auth")
      } else {
        window.core.getRoom()
        .then(room => {
          if (room) {
            setRoom(room)
          }
        })
        window.core.getUser()
        .then(user => {
          if (user) {
            setUser(user)
          }
        })
      }
    })
  }, [])

  return <>
    <Outlet />
  </>
}