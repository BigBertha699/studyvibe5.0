import { motion } from "framer-motion";
import {
  Check,
  CheckCheck,
  Clock,
  Reply,
  MoreHorizontal,
  Star,
  Copy,
  Forward,
  Trash2,
} from "lucide-react";
import { Message } from "@/hooks/useChat";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ChatBubbleProps {
  message: Message;
  isOwn: boolean;
  showTime?: boolean;
  isSelected?: boolean;
  onSelect?: (selected: boolean) => void;
  onReply?: () => void;
}

export default function ChatBubble({
  message,
  isOwn,
  showTime = false,
  isSelected = false,
  onSelect,
  onReply,
}: ChatBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const bubbleVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      className={cn("flex mb-4 group", isOwn ? "justify-end" : "justify-start")}
      variants={bubbleVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Selection Checkbox */}
      {onSelect && (
        <div
          className={cn(
            "flex items-center mr-2 transition-opacity",
            isSelected || showActions ? "opacity-100" : "opacity-0",
          )}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(e.target.checked)}
            className="w-4 h-4 text-blue-500 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex flex-col max-w-xs lg:max-w-md">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: showActions ? 1 : 0, y: showActions ? 0 : -10 }}
          className={cn(
            "flex gap-1 mb-1 transition-opacity",
            isOwn ? "justify-end" : "justify-start",
          )}
        >
          {showActions && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={onReply}
                className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
              >
                <Reply size={12} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                  >
                    <MoreHorizontal size={12} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isOwn ? "end" : "start"}
                  className="bg-gray-800 border-gray-700"
                >
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                    <Copy size={14} className="mr-2" />
                    Copy
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                    <Forward size={14} className="mr-2" />
                    Forward
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                    <Star size={14} className="mr-2" />
                    Star
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-600" />
                  <DropdownMenuItem className="text-red-400 focus:bg-red-500/20 focus:text-red-300">
                    <Trash2 size={14} className="mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </motion.div>

        {/* Message Bubble */}
        <div
          className={cn(
            "px-4 py-2 rounded-2xl relative transition-all duration-200",
            isOwn
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
              : "glass-card text-white rounded-bl-md",
            isSelected && "ring-2 ring-blue-500 ring-opacity-50",
          )}
        >
          {/* Message Content */}
          {message.type === "text" && (
            <p className="break-words whitespace-pre-wrap">{message.content}</p>
          )}

          {message.type === "image" && (
            <div className="space-y-2">
              <img
                src={message.content}
                alt="Shared image"
                className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                onClick={() => window.open(message.content, "_blank")}
              />
            </div>
          )}

          {message.type === "video" && (
            <div className="space-y-2">
              <video
                src={message.content}
                controls
                className="rounded-lg max-w-full h-auto"
              />
            </div>
          )}

          {message.type === "audio" && (
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="w-full h-1 bg-white/20 rounded-full">
                  <div className="w-1/3 h-full bg-white rounded-full"></div>
                </div>
                <span className="text-xs opacity-70 mt-1 block">0:23</span>
              </div>
            </div>
          )}

          {message.type === "file" && (
            <div className="flex items-center gap-3 p-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Copy size={16} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Document.pdf</p>
                <p className="text-xs opacity-70">2.4 MB</p>
              </div>
            </div>
          )}

          {/* Message Info */}
          <div
            className={cn(
              "flex items-center gap-1 mt-1",
              isOwn ? "justify-end" : "justify-start",
            )}
          >
            <span
              className={cn(
                "text-xs",
                isOwn ? "text-blue-100" : "text-gray-400",
              )}
            >
              {formatTime(message.timestamp)}
            </span>

            {isOwn && (
              <div className="flex items-center">
                {message.isRead ? (
                  <CheckCheck size={14} className="text-blue-200" />
                ) : (
                  <Check size={14} className="text-blue-300" />
                )}
              </div>
            )}
          </div>

          {/* Tail for chat bubble */}
          <div
            className={cn(
              "absolute top-0 w-0 h-0",
              isOwn
                ? "right-0 border-l-[8px] border-l-blue-500 border-t-[8px] border-t-transparent transform translate-x-full"
                : "left-0 border-r-[8px] border-r-gray-800/80 border-t-[8px] border-t-transparent transform -translate-x-full",
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}
