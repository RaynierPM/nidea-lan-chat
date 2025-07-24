const EMOJIS = [
  "😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "🥰", "😗", "😙", "😚", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "🥱", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🥳", "🥺", "🤠", "🤡", "🤥", "🤫", "🤭", "🧐", "🤓"
];

export function EmojiPicker({ onSelect }: { onSelect: (emoji: string) => void }) {
  return (
    <div className="flex flex-wrap gap-1 p-2 bg-white rounded-xl shadow mt-2 max-h-32 overflow-y-auto">
      {EMOJIS.map((emoji) => (
        <button
          key={emoji}
          type="button"
          className="text-2xl hover:scale-125 transition-transform duration-100"
          onClick={() => onSelect(emoji)}
          tabIndex={-1}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
} 