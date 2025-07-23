import { MessageI } from "../../../../../common/interfaces/message.interface";
import { useAppStore } from "../../store/app";
import { marked } from "marked";

type MessageProps = {
  message: MessageI
  chatId?: number
}

// Add a style tag for compact markdown rendering
if (typeof window !== 'undefined' && !document.getElementById('markdown-compact-style')) {
  const style = document.createElement('style');
  style.id = 'markdown-compact-style';
  style.innerHTML = `
    .markdown-compact p,
    .markdown-compact h1,
    .markdown-compact h2,
    .markdown-compact h3,
    .markdown-compact h4,
    .markdown-compact h5,
    .markdown-compact h6,
    .markdown-compact ul,
    .markdown-compact ol,
    .markdown-compact li,
    .markdown-compact blockquote {
      display: inline;
      margin: 0;
      padding: 0;
    }
    .markdown-compact pre {
      display: inline;
      margin: 0;
      padding: 0;
      background: none;
    }
    .markdown-compact code {
      display: inline;
      margin: 0;
      padding: 2px 4px;
      background: #f3f3f3;
      border-radius: 4px;
      font-size: 0.95em;
    }
  `;
  document.head.appendChild(style);
}

export function Message({message}:MessageProps) {
  const author = useAppStore(state => state.room)
    ?.participants
    .find(part => part.id === message.userId)
  const isMee = useAppStore(state => state.user)?.id === author?.id 
  return (
    <div className={isMee ? "bubble-me" : "bubble-other"}>
      <span className="font-semibold mr-2">{isMee? "Me" : author?.username || "System"}:</span>
      <span
        className="markdown-compact"
        style={{whiteSpace: 'pre-line'}}
        dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }}
      />
    </div>
  )
}