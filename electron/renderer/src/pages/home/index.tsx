import { useNavigate } from "react-router-dom"

export function HomePage() {
  const navigate = useNavigate()
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        height: "100vh",
        flexDirection: "column"
      }}
    >
      <h1>Welcome </h1>  
      <div
        style={{
          width: "100%",
          display: "flex",
          flex: "1",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <button
          onClick={() => {
            navigate('/search-room')
          }}
        >
          Search a room
        </button>
        <button
          onClick={() => {
            navigate('/host-room')
          }}
        >
          Host a room
        </button>
      </div>   
    </div>
  )
}