import React from 'react';
import emojis from '../utils/emojis.json'
import { cn } from '../utils/cn.util';
interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect, className }) => {
  return (
    <div className={
      cn(
        "bg-white border rounded-lg shadow-lg p-2 flex flex-wrap justify-items-center gap-2 z-50 overflow-hidden size-full",
        className
      )
    }>
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl p-1 hover:bg-indigo-100 rounded"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onSelect(emoji)
          }}
          tabIndex={0}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}; 