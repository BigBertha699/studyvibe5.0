import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  MoreVertical,
  MessageSquare,
  UserPlus,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface CallInterfaceProps {
  type: "voice" | "video";
  friend: {
    id: string;
    username: string;
    avatar?: string;
  };
  onEnd: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
}

type CallStatus = "connecting" | "ringing" | "connected" | "ended";

export default function CallInterface({
  type,
  friend,
  onEnd,
  isMinimized = false,
  onToggleMinimize,
}: CallInterfaceProps) {
  const [callStatus, setCallStatus] = useState<CallStatus>("connecting");
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(type === "video");
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<
    "excellent" | "good" | "poor"
  >("excellent");

  // Simulate call connection
  useEffect(() => {
    const timer = setTimeout(() => {
      setCallStatus("ringing");
      setTimeout(() => {
        setCallStatus("connected");
      }, 2000);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Duration counter
  useEffect(() => {
    if (callStatus === "connected") {
      const interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [callStatus]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusText = () => {
    switch (callStatus) {
      case "connecting":
        return "Connecting...";
      case "ringing":
        return "Ringing...";
      case "connected":
        return formatDuration(duration);
      case "ended":
        return "Call ended";
      default:
        return "";
    }
  };

  const getConnectionColor = () => {
    switch (connectionQuality) {
      case "excellent":
        return "text-green-400";
      case "good":
        return "text-yellow-400";
      case "poor":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const handleEndCall = () => {
    setCallStatus("ended");
    setTimeout(() => {
      onEnd();
    }, 1000);
  };

  if (isMinimized) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="fixed bottom-4 right-4 z-50 bg-gray-900 rounded-xl border border-gray-600 p-3 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10">
              <AvatarImage src={friend.avatar} alt={friend.username} />
              <AvatarFallback>
                {friend.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {friend.username}
            </p>
            <p className="text-gray-400 text-xs">{getStatusText()}</p>
          </div>

          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleMinimize}
              className="text-gray-400 hover:text-white p-1"
            >
              <Maximize2 size={14} />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleEndCall}
              className="text-red-400 hover:text-red-300 p-1"
            >
              <PhoneOff size={14} />
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gray-900 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gray-900/80 backdrop-blur-xl border-b border-gray-600">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="w-12 h-12">
              <AvatarImage src={friend.avatar} alt={friend.username} />
              <AvatarFallback>
                {friend.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {callStatus === "connected" && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-gray-900"></div>
            )}
          </div>

          <div>
            <h2 className="text-white text-lg font-semibold">
              {friend.username}
            </h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-400 text-sm">{getStatusText()}</p>
              {callStatus === "connected" && (
                <Badge
                  variant="secondary"
                  className={cn("text-xs", getConnectionColor())}
                >
                  {connectionQuality}
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onToggleMinimize && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleMinimize}
              className="text-gray-400 hover:text-white"
            >
              <Minimize2 size={18} />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <MoreVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-gray-800 border-gray-700">
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                <MessageSquare size={14} className="mr-2" />
                Open Chat
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                <UserPlus size={14} className="mr-2" />
                Add Someone
              </DropdownMenuItem>
              <DropdownMenuItem className="text-gray-300 focus:bg-gray-700 focus:text-white">
                <Settings size={14} className="mr-2" />
                Call Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-gray-800">
        {type === "video" && isVideoEnabled ? (
          <div className="relative w-full h-full">
            {/* Remote Video */}
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <Avatar className="w-32 h-32 mx-auto mb-4">
                  <AvatarImage src={friend.avatar} alt={friend.username} />
                  <AvatarFallback className="text-4xl">
                    {friend.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <p className="text-white text-lg font-medium">
                  {friend.username}
                </p>
                <p className="text-gray-400">{getStatusText()}</p>
              </div>
            </div>

            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-32 h-24 bg-gray-900 rounded-lg border border-gray-600 overflow-hidden">
              <div className="w-full h-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-white text-xs">You</span>
              </div>
            </div>
          </div>
        ) : (
          /* Audio Call / Video Disabled */
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Avatar className="w-40 h-40 mx-auto mb-6">
                  <AvatarImage src={friend.avatar} alt={friend.username} />
                  <AvatarFallback className="text-5xl">
                    {friend.username[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <h2 className="text-white text-2xl font-semibold mb-2">
                {friend.username}
              </h2>
              <p className="text-gray-400 text-lg">{getStatusText()}</p>

              {callStatus === "connecting" && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="p-6 bg-gray-900/80 backdrop-blur-xl border-t border-gray-600">
        <div className="flex items-center justify-center gap-4">
          {/* Mute Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsMuted(!isMuted)}
            className={cn(
              "w-14 h-14 rounded-full border-2 transition-all",
              isMuted
                ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
            )}
          >
            {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
          </Button>

          {/* Video Toggle (only for video calls) */}
          {type === "video" && (
            <Button
              size="lg"
              variant="outline"
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={cn(
                "w-14 h-14 rounded-full border-2 transition-all",
                !isVideoEnabled
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
              )}
            >
              {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
            </Button>
          )}

          {/* Speaker Button */}
          <Button
            size="lg"
            variant="outline"
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={cn(
              "w-14 h-14 rounded-full border-2 transition-all",
              isSpeakerOn
                ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
            )}
          >
            {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
          </Button>

          {/* End Call Button */}
          <Button
            size="lg"
            onClick={handleEndCall}
            className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white border-2 border-red-500"
          >
            <PhoneOff size={28} />
          </Button>
        </div>

        {/* Call Info */}
        <div className="flex items-center justify-center mt-4 gap-4 text-sm text-gray-400">
          <span>
            {type === "video" ? "📹" : "📞"}{" "}
            {type.charAt(0).toUpperCase() + type.slice(1)} Call
          </span>
          {callStatus === "connected" && (
            <>
              <span>•</span>
              <span className={getConnectionColor()}>
                {connectionQuality.charAt(0).toUpperCase() +
                  connectionQuality.slice(1)}{" "}
                quality
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}
