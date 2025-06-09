import { motion } from "framer-motion";
import { ArrowLeft, Search, MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function DirectMessages() {
  const [searchQuery, setSearchQuery] = useState("");
  const { friends, chats } = useChat();
  const { user } = useAuth();
  const navigate = useNavigate();

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getLastMessage = (friendId: string) => {
    const chat = chats.find((c) => c.friendId === friendId);
    return chat?.lastMessage;
  };

  const getUnreadCount = (friendId: string) => {
    const chat = chats.find((c) => c.friendId === friendId);
    if (!chat) return 0;
    return chat.messages.filter((m) => !m.isRead && m.senderId !== user?.id)
      .length;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <Layout>
      <div className="min-h-screen pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-2xl font-bold text-white">💬 Messages</h1>
            </div>
          </motion.div>

          {/* Search */}
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="relative">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="pl-10 bg-gray-800/50 border-gray-600 focus:border-blue-500"
              />
            </div>
          </motion.div>

          {/* Chat List */}
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {filteredFriends.map((friend, index) => {
              const lastMessage = getLastMessage(friend.id);
              const unreadCount = getUnreadCount(friend.id);

              return (
                <motion.div
                  key={friend.id}
                  onClick={() => navigate(`/chat/${friend.id}`)}
                  className="w-full p-4 glass-card hover:bg-white/5 transition-all duration-200 text-left group cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={friend.avatar}
                        alt={friend.username}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {friend.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={cn(
                            "font-semibold",
                            unreadCount > 0 ? "text-white" : "text-gray-300",
                          )}
                        >
                          {friend.username}
                        </h3>
                        <div className="flex items-center gap-2">
                          {lastMessage && (
                            <span className="text-xs text-gray-400">
                              {formatTime(lastMessage.timestamp)}
                            </span>
                          )}
                          {unreadCount > 0 && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {unreadCount > 9 ? "9+" : unreadCount}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "text-sm truncate",
                            unreadCount > 0
                              ? "text-gray-300 font-medium"
                              : "text-gray-400",
                          )}
                        >
                          {lastMessage ? (
                            <>
                              {lastMessage.senderId === user?.id && "You: "}
                              {lastMessage.type === "image"
                                ? "📷 Photo"
                                : lastMessage.type === "video"
                                  ? "🎥 Video"
                                  : lastMessage.content}
                            </>
                          ) : (
                            friend.bio || "Start a conversation"
                          )}
                        </p>

                        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1">
                          <MoreVertical size={16} className="text-gray-400" />
                        </button>
                      </div>

                      {!friend.isOnline && friend.lastSeen && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last seen {friend.lastSeen}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Empty State */}
          {filteredFriends.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {searchQuery ? (
                <>
                  <div className="text-4xl mb-4">🔍</div>
                  <h2 className="text-xl font-bold text-white mb-2">
                    No results found
                  </h2>
                  <p className="text-gray-400">
                    Try searching for something else
                  </p>
                </>
              ) : (
                <>
                  <div className="text-6xl mb-4">💬</div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    No conversations yet
                  </h2>
                  <p className="text-gray-400">
                    Start chatting with your friends!
                  </p>
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
