import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Smile, Heart, Coffee, Gamepad2, Music, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose?: () => void;
}

const emojiCategories = {
  recent: {
    label: "Recent",
    icon: Smile,
    emojis: ["😊", "❤️", "👍", "😂", "🔥", "💯", "🎉", "✨"],
  },
  people: {
    label: "People",
    icon: Smile,
    emojis: [
      "😀",
      "😃",
      "😄",
      "😁",
      "😆",
      "😅",
      "😂",
      "🤣",
      "😊",
      "😇",
      "🙂",
      "🙃",
      "😉",
      "😌",
      "😍",
      "🥰",
      "😘",
      "😗",
      "😙",
      "😚",
      "😋",
      "😛",
      "😝",
      "😜",
      "🤪",
      "🤨",
      "🧐",
      "🤓",
      "😎",
      "🥸",
      "🤩",
      "🥳",
      "😏",
      "😒",
      "😞",
      "😔",
      "😟",
      "😕",
      "🙁",
      "☹️",
      "😣",
      "😖",
      "😫",
      "😩",
      "🥺",
      "😢",
      "😭",
      "😤",
      "😠",
      "😡",
      "🤬",
      "🤯",
      "😳",
      "🥵",
      "🥶",
      "😱",
      "😨",
      "😰",
      "😥",
      "😓",
      "🤗",
      "🤔",
      "🤭",
      "🤫",
      "🤥",
      "😶",
      "😐",
      "😑",
      "😬",
      "🙄",
      "😯",
      "😦",
      "😧",
      "😮",
      "😲",
      "🥱",
      "😴",
      "🤤",
      "😪",
      "😵",
    ],
  },
  nature: {
    label: "Nature",
    icon: Heart,
    emojis: [
      "🐶",
      "🐱",
      "🐭",
      "🐹",
      "🐰",
      "🦊",
      "🐻",
      "🐼",
      "🐨",
      "🐯",
      "🦁",
      "🐮",
      "🐷",
      "🐸",
      "🐵",
      "🐔",
      "🐧",
      "🐦",
      "🐤",
      "🐣",
      "🐥",
      "🦆",
      "🦅",
      "🦉",
      "🦇",
      "🐺",
      "🐗",
      "🐴",
      "🦄",
      "🐝",
      "🐛",
      "🦋",
      "🐌",
      "🐞",
      "🐜",
      "🦟",
      "🦗",
      "🕷️",
      "🦂",
      "🐢",
      "🐍",
      "🦎",
      "🦖",
      "🦕",
      "🐙",
      "🦑",
      "🦐",
      "🦞",
      "🦀",
      "🐡",
      "🐠",
      "🐟",
      "🐬",
      "🐳",
      "🐋",
      "🦈",
      "🌱",
      "🌿",
      "🍀",
      "🌸",
      "🌺",
      "🌻",
      "🌷",
      "🌹",
      "🥀",
      "🌾",
      "🌲",
      "🌳",
      "🌴",
      "🌵",
      "🌶️",
      "🍄",
    ],
  },
  food: {
    label: "Food",
    icon: Coffee,
    emojis: [
      "🍎",
      "🍐",
      "🍊",
      "🍋",
      "🍌",
      "🍉",
      "🍇",
      "🍓",
      "🫐",
      "🍈",
      "🍒",
      "🍑",
      "🥭",
      "🍍",
      "🥥",
      "🥝",
      "🍅",
      "🍆",
      "🥑",
      "🥦",
      "🥬",
      "🥒",
      "🌶️",
      "🫑",
      "🌽",
      "🥕",
      "🫒",
      "🧄",
      "🧅",
      "🥔",
      "🍠",
      "🥐",
      "🥯",
      "🍞",
      "🥖",
      "🥨",
      "🧀",
      "🥚",
      "🍳",
      "🧈",
      "🥞",
      "🧇",
      "🥓",
      "🥩",
      "🍗",
      "🍖",
      "🦴",
      "🌭",
      "🍔",
      "🍟",
      "🍕",
      "🫓",
      "🥙",
      "🌮",
      "🌯",
      "🫔",
      "🥗",
      "🥘",
      "🫕",
      "🍝",
      "🍜",
      "🍲",
      "🍛",
      "🍣",
      "🍱",
      "🥟",
      "🦪",
      "🍤",
      "🍙",
      "🍚",
      "🍘",
      "🍥",
      "☕",
      "🍵",
      "🫖",
      "🧃",
      "🥤",
      "🧋",
      "🍶",
      "🍺",
    ],
  },
  objects: {
    label: "Objects",
    icon: Gamepad2,
    emojis: [
      "⚽",
      "🏀",
      "🏈",
      "⚾",
      "🥎",
      "🎾",
      "🏐",
      "🏉",
      "🥏",
      "🎱",
      "🪀",
      "🏓",
      "🏸",
      "🏒",
      "🏑",
      "🥍",
      "🏏",
      "🪃",
      "🥅",
      "⛳",
      "🪁",
      "🏹",
      "🎣",
      "🤿",
      "🥊",
      "🥋",
      "🎽",
      "🛹",
      "🛼",
      "🛷",
      "⛸️",
      "🥌",
      "🎿",
      "⛷️",
      "🏂",
      "🪂",
      "🏋️",
      "🤸",
      "🤺",
      "⛹️",
      "🤾",
      "🏌️",
      "🏇",
      "🧘",
      "🏄",
      "🏊",
      "🤽",
      "🚣",
      "🧗",
      "🚵",
      "🚴",
      "🏆",
      "🥇",
      "🥈",
      "🥉",
      "🏅",
      "🎖️",
      "🏵️",
      "🎗️",
      "🎫",
      "🎟️",
      "🎪",
      "🤹",
      "🎭",
      "🩰",
      "🎨",
      "🎬",
      "🎤",
      "🎧",
      "🎼",
      "🎹",
      "🥁",
      "🪘",
      "🎷",
      "🎺",
      "🪗",
      "🎸",
      "🪕",
      "🎻",
      "🎲",
    ],
  },
  symbols: {
    label: "Symbols",
    icon: Music,
    emojis: [
      "❤️",
      "🧡",
      "💛",
      "💚",
      "💙",
      "💜",
      "🖤",
      "🤍",
      "🤎",
      "💔",
      "❣️",
      "💕",
      "💞",
      "💓",
      "💗",
      "💖",
      "💘",
      "💝",
      "💟",
      "☮️",
      "✝️",
      "☪️",
      "🕉️",
      "☸️",
      "✡️",
      "🔯",
      "🕎",
      "☯️",
      "☦️",
      "🛐",
      "⛎",
      "♈",
      "♉",
      "♊",
      "♋",
      "♌",
      "♍",
      "♎",
      "♏",
      "♐",
      "♑",
      "♒",
      "♓",
      "🆔",
      "⚛️",
      "🉑",
      "☢️",
      "☣️",
      "📴",
      "📳",
      "🈶",
      "🈚",
      "🈸",
      "🈺",
      "🈷️",
      "✴️",
      "🆚",
      "💮",
      "🉐",
      "㊙️",
      "㊗️",
      "🈴",
      "🈵",
      "🈹",
      "🈲",
      "🅰️",
      "🅱️",
      "🆎",
      "🆑",
      "🅾️",
      "🆘",
      "❌",
      "⭕",
      "🛑",
      "⛔",
      "📛",
      "🚫",
      "💯",
      "💢",
      "♨️",
    ],
  },
};

const quickStickers = ["👍", "👎", "❤️", "😂", "😮", "😢", "😠", "👏"];

export default function EmojiPicker({
  onEmojiSelect,
  onClose,
}: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = useState("recent");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmojis = searchQuery
    ? Object.values(emojiCategories)
        .flatMap((category) => category.emojis)
        .filter((emoji) =>
          // Simple search - in a real app you'd have emoji descriptions
          emoji.includes(searchQuery),
        )
    : emojiCategories[activeCategory as keyof typeof emojiCategories]?.emojis ||
      [];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      className="bg-gray-800 border border-gray-600 rounded-xl shadow-2xl w-80 max-h-96 overflow-hidden"
    >
      {/* Header */}
      <div className="p-3 border-b border-gray-600">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-medium">Choose Emoji</span>
          {onClose && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white p-1"
            >
              <X size={16} />
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search emojis..."
            className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
          />
        </div>
      </div>

      {/* Quick Stickers */}
      {!searchQuery && (
        <div className="p-3 border-b border-gray-600">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Quick Reactions</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {quickStickers.map((sticker, index) => (
              <button
                key={index}
                onClick={() => onEmojiSelect(sticker)}
                className="w-10 h-10 rounded-lg hover:bg-gray-700 flex items-center justify-center text-xl transition-colors"
              >
                {sticker}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      {!searchQuery && (
        <div className="flex border-b border-gray-600">
          {Object.entries(emojiCategories).map(([key, category]) => {
            const IconComponent = category.icon;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={cn(
                  "flex-1 p-3 flex items-center justify-center transition-colors",
                  activeCategory === key
                    ? "bg-blue-500 text-white"
                    : "text-gray-400 hover:bg-gray-700 hover:text-white",
                )}
              >
                <IconComponent size={18} />
              </button>
            );
          })}
        </div>
      )}

      {/* Emoji Grid */}
      <div className="p-3 max-h-48 overflow-y-auto custom-scrollbar">
        {searchQuery && (
          <div className="mb-2">
            <span className="text-sm text-gray-300">
              Search results for "{searchQuery}"
            </span>
          </div>
        )}

        <div className="grid grid-cols-8 gap-1">
          {filteredEmojis.map((emoji, index) => (
            <motion.button
              key={`${emoji}-${index}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onEmojiSelect(emoji)}
              className="w-8 h-8 rounded hover:bg-gray-700 flex items-center justify-center text-lg transition-colors"
            >
              {emoji}
            </motion.button>
          ))}
        </div>

        {filteredEmojis.length === 0 && searchQuery && (
          <div className="text-center py-8">
            <span className="text-gray-400">No emojis found</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
