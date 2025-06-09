import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Paperclip,
  Camera,
  Video,
  Smile,
  MoreVertical,
  Search,
  Phone,
  VideoIcon,
  Users,
  Settings,
  Star,
  Download,
  Reply,
  Forward,
  Trash2,
  Pin,
  Mic,
  X,
  Plus,
  FileText,
  Image,
  Music,
  Film,
  Zap,
} from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import ChatBubble from "@/components/ChatBubble";
import EmojiPicker from "@/components/EmojiPicker";
import FileUpload from "@/components/FileUpload";
import SearchBar from "@/components/SearchBar";
import CallInterface from "@/components/CallInterface";
import ChatSettings from "@/components/ChatSettings";
import GroupChatModal from "@/components/GroupChatModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function Chat() {
  const { friendId } = useParams<{ friendId: string }>();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showFileUpload, setShowFileUpload] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(
    new Set(),
  );
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [currentCall, setCurrentCall] = useState<"voice" | "video" | null>(
    null,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"default" | "dark" | "blue" | "purple">(
    "default",
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const voiceRecordingRef = useRef<MediaRecorder | null>(null);

  const { friends, getChatWithFriend, sendMessage, markMessagesAsRead } =
    useChat();
  const { user } = useAuth();

  const friend = friends.find((f) => f.id === friendId);
  const chat = friendId ? getChatWithFriend(friendId) : undefined;

  // Filter messages based on search query
  const filteredMessages =
    chat?.messages.filter((msg) =>
      msg.content.toLowerCase().includes(searchQuery.toLowerCase()),
    ) || [];

  const displayMessages = searchQuery ? filteredMessages : chat?.messages || [];

  // Mark messages as read
  const markAsRead = useCallback(() => {
    if (friendId) {
      markMessagesAsRead(friendId);
    }
  }, [friendId, markMessagesAsRead]);

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Typing indicator
  useEffect(() => {
    if (message.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [message]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showEmojiPicker) setShowEmojiPicker(false);
      if (showFileUpload) setShowFileUpload(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showEmojiPicker, showFileUpload]);

  const handleSendMessage = () => {
    if (message.trim() && friendId) {
      sendMessage(friendId, message.trim());
      setMessage("");
      setReplyingTo(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileUpload = (files: FileList) => {
    if (!friendId) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const type = file.type.startsWith("image/")
          ? "image"
          : file.type.startsWith("video/")
            ? "video"
            : "file";
        sendMessage(friendId, content, type as any);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      voiceRecordingRef.current = mediaRecorder;

      mediaRecorder.start();
      setIsRecording(true);

      mediaRecorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
      };
    } catch (error) {
      console.error("Error starting voice recording:", error);
    }
  };

  const stopVoiceRecording = () => {
    if (voiceRecordingRef.current && isRecording) {
      voiceRecordingRef.current.stop();
      // In a real app, you'd process the audio and send it
      if (friendId) {
        sendMessage(friendId, "🎤 Voice message", "audio" as any);
      }
    }
  };

  const handleCallStart = (type: "voice" | "video") => {
    setCurrentCall(type);
    // In a real app, this would initiate WebRTC connection
  };

  const handleCallEnd = () => {
    setCurrentCall(null);
  };

  const getThemeClasses = () => {
    switch (theme) {
      case "dark":
        return "from-gray-900 via-gray-800 to-gray-900";
      case "blue":
        return "from-blue-900 via-blue-800 to-blue-900";
      case "purple":
        return "from-purple-900 via-purple-800 to-purple-900";
      default:
        return "from-gray-900 via-blue-900 to-purple-900";
    }
  };

  if (!friend) {
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${getThemeClasses()} flex items-center justify-center`}
      >
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Friend not found
          </h1>
          <Link to="/messages" className="text-blue-400 hover:text-blue-300">
            ← Back to messages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${getThemeClasses()} flex flex-col relative`}
    >
      {/* Call Interface Overlay */}
      <AnimatePresence>
        {currentCall && (
          <CallInterface
            type={currentCall}
            friend={friend}
            onEnd={handleCallEnd}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.header
        className="glass border-b border-white/10 p-4 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link
              to="/messages"
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={friend.avatar} alt={friend.username} />
                  <AvatarFallback>
                    {friend.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {friend.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-semibold text-white">
                    {friend.username}
                  </h1>
                  {friend.isOnline && (
                    <Badge variant="secondary" className="text-xs">
                      Online
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-400">
                  {friend.isOnline
                    ? "Active now"
                    : `Last seen ${friend.lastSeen || "recently"}`}
                </p>
              </div>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => setShowSearch(!showSearch)}
            >
              <Search size={20} />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => handleCallStart("voice")}
            >
              <Phone size={20} />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => handleCallStart("video")}
            >
              <VideoIcon size={20} />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => setShowGroupModal(true)}
            >
              <Users size={20} />
            </Button>

            <Button
              size="sm"
              variant="ghost"
              className="text-gray-400 hover:text-white"
              onClick={() => setShowSettings(!showSettings)}
            >
              <Settings size={20} />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search in conversation..."
                onClose={() => setShowSearch(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Chat Settings Sidebar */}
      <AnimatePresence>
        {showSettings && (
          <ChatSettings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            theme={theme}
            onThemeChange={setTheme}
            friend={friend}
          />
        )}
      </AnimatePresence>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar relative">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {/* Reply Banner */}
          <AnimatePresence>
            {replyingTo && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4 p-3 bg-blue-500/20 rounded-lg border-l-4 border-blue-500 flex justify-between items-center"
              >
                <div>
                  <p className="text-blue-300 text-sm">Replying to message</p>
                  <p className="text-white text-sm truncate">{replyingTo}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setReplyingTo(null)}
                  className="text-blue-300 hover:text-white"
                >
                  <X size={16} />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {displayMessages.length ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-2"
            >
              {displayMessages.map((msg, index) => {
                const showDateSeparator =
                  index === 0 ||
                  new Date(msg.timestamp).toDateString() !==
                    new Date(
                      displayMessages[index - 1].timestamp,
                    ).toDateString();

                return (
                  <div key={msg.id}>
                    {showDateSeparator && (
                      <div className="flex items-center justify-center my-4">
                        <div className="bg-gray-700/50 px-3 py-1 rounded-full">
                          <span className="text-gray-300 text-sm">
                            {new Date(msg.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}
                    <ChatBubble
                      message={msg}
                      isOwn={msg.senderId === user?.id}
                      isSelected={selectedMessages.has(msg.id)}
                      onSelect={(selected) => {
                        const newSelected = new Set(selectedMessages);
                        if (selected) {
                          newSelected.add(msg.id);
                        } else {
                          newSelected.delete(msg.id);
                        }
                        setSelectedMessages(newSelected);
                      }}
                      onReply={() => setReplyingTo(msg.content)}
                    />
                  </div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl mb-4">👋</div>
              <h2 className="text-xl font-bold text-white mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-400">
                Send your first message to {friend.username}
              </p>
            </motion.div>
          )}

          {/* Typing Indicator */}
          <AnimatePresence>
            {isTyping && (
              <motion.div
                className="flex justify-start mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
              >
                <div className="glass-card px-4 py-2 rounded-2xl rounded-bl-md">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div ref={messagesEndRef} />
        </div>

        {/* Selected Messages Actions */}
        <AnimatePresence>
          {selectedMessages.size > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20"
            >
              <div className="glass-card p-3 rounded-full flex items-center gap-2">
                <span className="text-white text-sm font-medium">
                  {selectedMessages.size} selected
                </span>
                <Separator orientation="vertical" className="h-6" />
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-blue-400 hover:text-blue-300"
                >
                  <Reply size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-green-400 hover:text-green-300"
                >
                  <Forward size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-yellow-400 hover:text-yellow-300"
                >
                  <Star size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-gray-400 hover:text-white"
                  onClick={() => setSelectedMessages(new Set())}
                >
                  <X size={16} />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Message Input Area */}
      <motion.footer
        className="glass border-t border-white/10 p-4 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto">
          {/* Quick Actions */}
          <AnimatePresence>
            {showFileUpload && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mb-4"
              >
                <FileUpload
                  onFileUpload={handleFileUpload}
                  onClose={() => setShowFileUpload(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Input Row */}
          <div className="flex items-end gap-3">
            {/* Attachment Button */}
            <div className="relative">
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white p-2"
                onClick={() => setShowFileUpload(!showFileUpload)}
              >
                <Plus size={20} />
              </Button>
            </div>

            {/* Message Input Container */}
            <div className="flex-1 relative">
              <div className="flex items-end">
                <div className="flex-1 relative">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder={`Message ${friend.username}...`}
                    className="bg-gray-800/50 border-gray-600 focus:border-blue-500 pr-20 min-h-[44px] resize-none"
                    maxLength={1000}
                  />

                  {/* Input Actions */}
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white p-1"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Smile size={18} />
                    </Button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && handleFileUpload(e.target.files)
                      }
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white p-1"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Paperclip size={18} />
                    </Button>
                  </div>
                </div>

                {/* Voice/Send Button */}
                {message.trim() ? (
                  <Button
                    onClick={handleSendMessage}
                    className="ml-2 glass-button text-white p-3 min-w-[44px]"
                  >
                    <Send size={20} />
                  </Button>
                ) : (
                  <Button
                    onMouseDown={startVoiceRecording}
                    onMouseUp={stopVoiceRecording}
                    onMouseLeave={stopVoiceRecording}
                    className={cn(
                      "ml-2 p-3 min-w-[44px] transition-all duration-200",
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "glass-button text-white",
                    )}
                  >
                    <Mic size={20} />
                  </Button>
                )}
              </div>

              {/* Emoji Picker */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <div className="absolute bottom-full right-0 mb-2">
                    <EmojiPicker onEmojiSelect={handleEmojiSelect} />
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Character Count */}
          {message.length > 800 && (
            <div className="text-right mt-1">
              <span
                className={cn(
                  "text-xs",
                  message.length > 950 ? "text-red-400" : "text-gray-400",
                )}
              >
                {message.length}/1000
              </span>
            </div>
          )}
        </div>
      </motion.footer>

      {/* Group Chat Modal */}
      <GroupChatModal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        friends={friends}
        currentFriend={friend}
      />
    </div>
  );
}
