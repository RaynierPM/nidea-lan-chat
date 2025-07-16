import { MessageI } from "../../../../../common/interfaces/message.interface";
import { useAppStore } from "../../store/app";

type MessageProps = {
  message: MessageI
  chatId?: number
}

export function Message({message, chatId}:MessageProps) {
  const author = useAppStore(state => state.room)
    ?.participants
    .find(part => part.id === message.userId)
  const isMee = useAppStore(state => state.user)?.id === author?.id 
  return (
    <p style={{textAlign: isMee? "end" : "start"}}>
      {isMee? "Me" : author?.username || "System"}: {message.content}
    </p>
  )
}