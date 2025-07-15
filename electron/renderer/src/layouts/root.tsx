import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

export function RootLayout() {
  const navigate = useNavigate()
  
  useEffect(() => {
    window.core.getUser()
    .then(user => {
      if (!user) {
        navigate("/auth")
      }
    })
  }, [])

  return <>
    <Outlet />
  </>
}