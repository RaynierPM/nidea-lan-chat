import React from 'react';

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelect }) => {
  const emojis = [
    '😀', '😂', '😍', '😎', '😭', '😡', '👍', '🙏', '🎉', '❤️',
    '🔥', '🥳', '😅', '😇', '😜', '🤔', '😏', '😬', '😱', '🤯',
    
  ];
  return (
    <div className="absolute bottom-8 left-0 bg-white border rounded shadow-lg p-2 flex flex-wrap gap-2 z-50 max-w-[380px]">
      {emojis.map((emoji) => (
        <button
          key={emoji}
          className="text-2xl p-1 hover:bg-indigo-100 rounded"
          onClick={() => onSelect(emoji)}
          tabIndex={0}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}; 