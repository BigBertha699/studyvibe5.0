import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Edit, ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileStatusBarProps {
  onProfileClick: () => void;
  onStatusClick: () => void;
}

interface StatusStory {
  id: string;
  emoji: string;
  text: string;
  timestamp: Date;
  viewCount: number;
  backgroundColor: string;
}

// Mock current user data
const currentUser = {
  id: "me",
  username: "Alex Johnson",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
  emoji: "📚",
  status: "Studying",
};

// Mock status stories from other users
const statusStories: StatusStory[] = [
  {
    id: "1",
    emoji: "🎉",
    text: "Just finished my finals!",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    viewCount: 12,
    backgroundColor: "from-pink-500 to-red-500",
  },
  {
    id: "2",
    emoji: "📖",
    text: "Deep in study mode",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    viewCount: 8,
    backgroundColor: "from-blue-500 to-purple-500",
  },
  {
    id: "3",
    emoji: "☕",
    text: "Coffee break time!",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    viewCount: 15,
    backgroundColor: "from-yellow-500 to-orange-500",
  },
  {
    id: "4",
    emoji: "🎯",
    text: "Goal achieved!",
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    viewCount: 22,
    backgroundColor: "from-green-500 to-blue-500",
  },
  {
    id: "5",
    emoji: "🌙",
    text: "Late night coding",
    timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    viewCount: 6,
    backgroundColor: "from-purple-500 to-pink-500",
  },
];

export default function ProfileStatusBar({
  onProfileClick,
  onStatusClick,
}: ProfileStatusBarProps) {
  const [selectedStory, setSelectedStory] = useState<string | null>(null);

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white text-lg font-semibold">Status</h2>
          <Button
            size="sm"
            variant="ghost"
            onClick={onProfileClick}
            className="text-gray-400 hover:text-white"
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>

        {/* Status Stories Container */}
        <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {/* Current User Status */}
          <div className="flex-shrink-0">
            <button
              onClick={onStatusClick}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-0.5">
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                    <Avatar className="w-14 h-14">
                      <AvatarImage
                        src={currentUser.avatar}
                        alt={currentUser.username}
                      />
                      <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>

                {/* Add Status Button */}
                <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1 border-2 border-slate-900">
                  <Plus size={12} className="text-white" />
                </div>

                {/* Current Status Emoji */}
                <div className="absolute -top-1 -right-1 bg-slate-800 rounded-full p-1 border-2 border-slate-900">
                  <span className="text-xs">{currentUser.emoji}</span>
                </div>
              </div>

              <div className="text-center">
                <p className="text-white text-xs font-medium">My Status</p>
                <p className="text-gray-400 text-xs">{currentUser.status}</p>
              </div>
            </button>
          </div>

          {/* Other Users' Status Stories */}
          {statusStories.map((story, index) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex-shrink-0"
            >
              <button
                onClick={() => setSelectedStory(story.id)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="relative">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-full bg-gradient-to-r p-0.5 transition-transform group-hover:scale-105",
                      story.backgroundColor,
                    )}
                  >
                    <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
                      <div className="text-2xl">{story.emoji}</div>
                    </div>
                  </div>

                  {/* View count indicator */}
                  <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-4 h-4 flex items-center justify-center border-2 border-slate-900">
                    <span className="text-white text-xs font-bold">
                      {story.viewCount}
                    </span>
                  </div>
                </div>

                <div className="text-center max-w-16">
                  <p className="text-white text-xs font-medium truncate">
                    {story.text}
                  </p>
                  <p className="text-gray-400 text-xs">
                    {formatTimeAgo(story.timestamp)}
                  </p>
                </div>
              </button>
            </motion.div>
          ))}

          {/* View All Button */}
          <div className="flex-shrink-0 ml-2">
            <button className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-600 flex items-center justify-center group-hover:border-gray-500 transition-colors">
                <ChevronRight
                  size={20}
                  className="text-gray-500 group-hover:text-gray-400"
                />
              </div>
              <p className="text-gray-400 text-xs">View All</p>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm">Online</span>
          </div>

          <div className="flex items-center gap-2">
            <Eye size={14} className="text-gray-400" />
            <span className="text-gray-400 text-sm">
              {statusStories.reduce(
                (total, story) => total + story.viewCount,
                0,
              )}{" "}
              total views today
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">
              {statusStories.length} active stories
            </span>
          </div>
        </div>

        {/* Current User Status Display */}
        <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={currentUser.avatar}
                  alt={currentUser.username}
                />
                <AvatarFallback>{currentUser.username[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-slate-800 rounded-full p-0.5 border border-slate-600">
                <span className="text-xs">{currentUser.emoji}</span>
              </div>
            </div>

            <div className="flex-1">
              <p className="text-white font-medium">{currentUser.username}</p>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                >
                  {currentUser.status}
                </Badge>
                <span className="text-gray-400 text-sm">• Active now</span>
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onProfileClick}
              className="text-gray-400 hover:text-white"
            >
              <Edit size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Status Story Viewer Modal (placeholder) */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
          onClick={() => setSelectedStory(null)}
        >
          <div className="text-center">
            <div className="text-6xl mb-4">
              {statusStories.find((s) => s.id === selectedStory)?.emoji}
            </div>
            <p className="text-white text-xl">
              {statusStories.find((s) => s.id === selectedStory)?.text}
            </p>
            <p className="text-gray-400 mt-2">
              {statusStories.find((s) => s.id === selectedStory) &&
                formatTimeAgo(
                  statusStories.find((s) => s.id === selectedStory)!.timestamp,
                )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
