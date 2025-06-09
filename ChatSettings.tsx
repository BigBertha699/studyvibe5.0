import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Palette,
  Shield,
  Download,
  Trash2,
  Key,
  Moon,
  Sun,
  Droplets,
  Zap,
  Type,
  Bell,
  Eye,
  EyeOff,
  Clock,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ChatSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "default" | "dark" | "blue" | "purple";
  onThemeChange: (theme: "default" | "dark" | "blue" | "purple") => void;
  friend: {
    id: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
  };
}

type SettingsTab = "appearance" | "privacy" | "security";

const themeOptions = [
  {
    id: "default",
    name: "Default",
    description: "Purple gradient theme",
    gradient: "from-gray-900 via-blue-900 to-purple-900",
    preview: "bg-gradient-to-r from-blue-500 to-purple-500",
  },
  {
    id: "dark",
    name: "Dark",
    description: "Pure dark theme",
    gradient: "from-gray-900 via-gray-800 to-gray-900",
    preview: "bg-gradient-to-r from-gray-700 to-gray-900",
  },
  {
    id: "blue",
    name: "Ocean",
    description: "Blue ocean theme",
    gradient: "from-blue-900 via-blue-800 to-blue-900",
    preview: "bg-gradient-to-r from-blue-600 to-blue-800",
  },
  {
    id: "purple",
    name: "Galaxy",
    description: "Purple galaxy theme",
    gradient: "from-purple-900 via-purple-800 to-purple-900",
    preview: "bg-gradient-to-r from-purple-600 to-purple-800",
  },
];

const backgroundOptions = [
  { id: "default", name: "Default", preview: "bg-gray-800" },
  { id: "bubbles", name: "Bubbles", preview: "bg-blue-500" },
  { id: "geometric", name: "Geometric", preview: "bg-purple-500" },
  {
    id: "gradient",
    name: "Gradient",
    preview: "bg-gradient-to-r from-pink-500 to-orange-500",
  },
];

export default function ChatSettings({
  isOpen,
  onClose,
  theme,
  onThemeChange,
  friend,
}: ChatSettingsProps) {
  const [activeTab, setActiveTab] = useState<SettingsTab>("appearance");
  const [fontSize, setFontSize] = useState([16]);
  const [readReceipts, setReadReceipts] = useState(true);
  const [lastSeen, setLastSeen] = useState(true);
  const [autoDownload, setAutoDownload] = useState(true);
  const [chatBackground, setChatBackground] = useState("default");

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="absolute right-0 top-0 h-full w-full max-w-md bg-gray-900 border-l border-gray-600 shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-600 p-4 z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-lg font-semibold">
                Chat Settings
              </h2>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>

            {/* Friend Info */}
            <div className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg">
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
              <div className="flex-1">
                <h3 className="text-white font-medium">{friend.username}</h3>
                <p className="text-gray-400 text-sm">
                  {friend.isOnline ? "Online" : "Last seen recently"}
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-white"
              >
                <Camera size={16} />
              </Button>
            </div>

            {/* Tabs */}
            <div className="flex mt-4 bg-gray-800 rounded-lg p-1">
              {[
                { id: "appearance", label: "Style", icon: Palette },
                { id: "privacy", label: "Privacy", icon: Shield },
                { id: "security", label: "Security", icon: Key },
              ].map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors",
                      activeTab === tab.id
                        ? "bg-blue-500 text-white"
                        : "text-gray-400 hover:text-white",
                    )}
                  >
                    <IconComponent size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="p-4 space-y-6">
            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Theme Selection */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Palette size={18} />
                    Theme
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => onThemeChange(option.id as any)}
                        className={cn(
                          "p-3 rounded-lg border transition-all text-left",
                          theme === option.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500",
                        )}
                      >
                        <div
                          className={cn(
                            "w-full h-8 rounded mb-2",
                            option.preview,
                          )}
                        ></div>
                        <p className="text-white text-sm font-medium">
                          {option.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {option.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Chat Background */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Droplets size={18} />
                    Chat Background
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {backgroundOptions.map((bg) => (
                      <button
                        key={bg.id}
                        onClick={() => setChatBackground(bg.id)}
                        className={cn(
                          "p-3 rounded-lg border transition-all text-left",
                          chatBackground === bg.id
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-gray-600 hover:border-gray-500",
                        )}
                      >
                        <div
                          className={cn("w-full h-8 rounded mb-2", bg.preview)}
                        ></div>
                        <p className="text-white text-sm">{bg.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <Separator className="bg-gray-700" />

                {/* Font Size */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Type size={18} />
                    Font Size
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">
                        Size: {fontSize[0]}px
                      </span>
                      <Badge variant="secondary">
                        {fontSize[0] <= 14
                          ? "Small"
                          : fontSize[0] <= 18
                            ? "Medium"
                            : "Large"}
                      </Badge>
                    </div>
                    <Slider
                      value={fontSize}
                      onValueChange={setFontSize}
                      max={24}
                      min={12}
                      step={1}
                      className="w-full"
                    />
                    <div className="p-3 bg-gray-800 rounded-lg">
                      <p
                        className="text-white"
                        style={{ fontSize: `${fontSize[0]}px` }}
                      >
                        This is how your messages will look
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === "privacy" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Read Receipts */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye size={18} className="text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Read Receipts</p>
                      <p className="text-gray-400 text-sm">
                        Show when you've read messages
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={readReceipts}
                    onCheckedChange={setReadReceipts}
                  />
                </div>

                <Separator className="bg-gray-700" />

                {/* Last Seen */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock size={18} className="text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Last Seen</p>
                      <p className="text-gray-400 text-sm">
                        Show when you were last online
                      </p>
                    </div>
                  </div>
                  <Switch checked={lastSeen} onCheckedChange={setLastSeen} />
                </div>

                <Separator className="bg-gray-700" />

                {/* Auto Download */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Download size={18} className="text-gray-400" />
                    <div>
                      <p className="text-white font-medium">Auto Download</p>
                      <p className="text-gray-400 text-sm">
                        Automatically download media files
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={autoDownload}
                    onCheckedChange={setAutoDownload}
                  />
                </div>

                <Separator className="bg-gray-700" />

                {/* Notifications */}
                <div>
                  <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                    <Bell size={18} />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">
                        Message notifications
                      </span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Sound</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Vibration</span>
                      <Switch />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Encryption Status */}
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Shield size={18} className="text-green-400" />
                    <span className="text-green-400 font-medium">
                      End-to-End Encrypted
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Your messages are secured with end-to-end encryption.
                  </p>
                </div>

                {/* Security Actions */}
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    <Download size={16} className="mr-3" />
                    Export Chat History
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    <Key size={16} className="mr-3" />
                    View Encryption Keys
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-red-400 border-red-500/20 hover:bg-red-500/10"
                  >
                    <Trash2 size={16} className="mr-3" />
                    Clear Chat History
                  </Button>
                </div>

                <Separator className="bg-gray-700" />

                {/* Block User */}
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <h3 className="text-red-400 font-medium mb-2">Danger Zone</h3>
                  <p className="text-gray-300 text-sm mb-3">
                    Block this user to prevent them from messaging you.
                  </p>
                  <Button
                    variant="outline"
                    className="w-full text-red-400 border-red-500/20 hover:bg-red-500/10"
                  >
                    Block {friend.username}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
