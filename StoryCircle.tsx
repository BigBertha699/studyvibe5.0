import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Story } from "@/hooks/useChat";

interface StoryCircleProps {
  story?: Story;
  isAddStory?: boolean;
  onAddStory?: () => void;
  onClick?: () => void;
}

export default function StoryCircle({
  story,
  isAddStory,
  onAddStory,
  onClick,
}: StoryCircleProps) {
  if (isAddStory) {
    return (
      <motion.button
        onClick={onAddStory}
        className="flex flex-col items-center gap-2 group"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 border-2 border-dashed border-gray-500 flex items-center justify-center group-hover:border-blue-400 transition-colors">
            <Plus
              size={24}
              className="text-gray-400 group-hover:text-blue-400 transition-colors"
            />
          </div>
        </div>
        <span className="text-xs text-gray-400 text-center max-w-[64px] truncate">
          Add Story
        </span>
      </motion.button>
    );
  }

  if (!story) return null;

  const timeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "now";
    if (hours === 1) return "1h";
    return `${hours}h`;
  };

  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 group"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="relative">
        {/* Story ring */}
        <div className={`story-ring ${story.isViewed ? "opacity-50" : ""}`}>
          <div className="story-inner">
            <img
              src={story.avatar}
              alt={story.username}
              className="w-14 h-14 rounded-full object-cover"
            />
          </div>
        </div>

        {/* Unviewed indicator */}
        {!story.isViewed && (
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-gray-900 animate-pulse"></div>
        )}
      </div>

      <div className="text-center">
        <span className="text-xs text-white text-center max-w-[64px] truncate block">
          {story.username}
        </span>
        <span className="text-xs text-gray-400">
          {timeAgo(story.timestamp)}
        </span>
      </div>
    </motion.button>
  );
}
