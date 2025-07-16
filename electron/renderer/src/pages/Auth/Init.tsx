import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

export function InitPage() {
  const [username, setUsername] = useState("")
  const navigate = useNavigate()

  async function handleInit() {
    if (username.trim()) {
      try {
        await window.core.init(username)
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

  return <div style={{
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  }}>
    <div>
      <h2>Login???</h2>
      <div>
        <label>Username: </label>
        <input 
          type="text" 
          placeholder="Papotico's"
          onChange={(e) => {setUsername(e.target.value)}}
          value={username}
        />
      </div>
      <div style={{display: "flex", justifyContent:"center", alignItems: "center", width: "100%", padding: "10px 0px"}}>
        <button
          onClick={handleInit}
        >
          Login
        </button>
      </div>
    </div>
  </div>
}