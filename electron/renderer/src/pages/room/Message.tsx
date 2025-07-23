import { MessageI } from "../../../../../common/interfaces/message.interface";
import { useAppStore } from "../../store/app";

type MessageProps = {
  message: MessageI
  chatId?: number
}

export function Message({message}:MessageProps) {
  const author = useAppStore(state => state.room)
    ?.participants
    .find(part => part.id === message.userId)
  const isMee = useAppStore(state => state.user)?.id === author?.id 
  return (
    <div className={isMee ? "bubble-me" : "bubble-other"}>
      <span className="font-semibold mr-2">{isMee? "Me" : author?.username || "System"}:</span>
      <span style={{whiteSpace: 'pre-line'}}>{message.content}</span>
    </div>
  )
}