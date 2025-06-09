import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Camera,
  Upload,
  Trash2,
  User,
  Shield,
  Bell,
  Edit,
  Save,
  Eye,
  EyeOff,
  UserPlus,
  MessageSquare,
  Clock,
  CheckCircle,
  Smile,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    bio?: string;
    emoji?: string;
    status?: string;
  };
}

type ProfileTab = "profile" | "privacy" | "notifications";

const statusOptions = [
  { emoji: "💚", text: "Available", description: "Ready to study and chat" },
  { emoji: "🟡", text: "Away", description: "I'll be back soon" },
  { emoji: "🔴", text: "Busy", description: "Can't talk right now, studying!" },
  { emoji: "📚", text: "Studying", description: "In focus mode" },
  { emoji: "😴", text: "Sleep", description: "Do not disturb" },
  { emoji: "🎯", text: "Goals", description: "Working on my goals" },
];

const quickEmojis = [
  "😊",
  "😎",
  "🤓",
  "📚",
  "🎯",
  "💪",
  "🌟",
  "🔥",
  "💡",
  "🚀",
  "⭐",
  "🎊",
  "🎉",
  "💯",
  "✨",
  "🌈",
];

export default function ProfileModal({
  isOpen,
  onClose,
  user,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<ProfileTab>("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.username);
  const [bio, setBio] = useState(user.bio || "");
  const [selectedEmoji, setSelectedEmoji] = useState(user.emoji || "😊");
  const [selectedStatus, setSelectedStatus] = useState(
    user.status || "Available",
  );
  const [avatar, setAvatar] = useState(user.avatar);

  // Privacy settings
  const [showLastSeen, setShowLastSeen] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [readReceipts, setReadReceipts] = useState(true);
  const [allowFriendRequests, setAllowFriendRequests] = useState(true);
  const [profilePhotoPrivacy, setProfilePhotoPrivacy] = useState("everyone");

  // Notification settings
  const [messageNotifications, setMessageNotifications] = useState(true);
  const [friendRequestNotifications, setFriendRequestNotifications] =
    useState(true);
  const [studyReminders, setStudyReminders] = useState(true);
  const [achievementNotifications, setAchievementNotifications] =
    useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const updatedProfile = {
      ...user,
      username: displayName,
      bio,
      emoji: selectedEmoji,
      status: selectedStatus,
      avatar,
    };

    console.log("Saving profile:", updatedProfile);
    setIsEditing(false);
    // In a real app, you'd save to backend here
  };

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatar(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAvatar = () => {
    // Generate a random avatar URL - in real app you'd call an avatar generation service
    const avatarStyle = [
      "adventurer",
      "avataaars",
      "big-smile",
      "bottts",
      "croodles-neutral",
    ][Math.floor(Math.random() * 5)];
    const seed = Math.random().toString(36).substring(7);
    setAvatar(`https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${seed}`);
  };

  const removeAvatar = () => {
    setAvatar(undefined);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-gray-600 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-600">
            <h2 className="text-white text-xl font-semibold">
              Profile Settings
            </h2>
            <div className="flex items-center gap-2">
              {isEditing && (
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  <Save size={16} className="mr-2" />
                  Save
                </Button>
              )}
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-600">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "privacy", label: "Privacy", icon: Shield },
              { id: "notifications", label: "Notifications", icon: Bell },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ProfileTab)}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-medium transition-colors border-b-2",
                    activeTab === tab.id
                      ? "text-blue-400 border-blue-500 bg-blue-500/5"
                      : "text-gray-400 border-transparent hover:text-white hover:bg-gray-800/50",
                  )}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            <AnimatePresence mode="wait">
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Avatar Section */}
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <Avatar className="w-24 h-24">
                        <AvatarImage src={avatar} alt={displayName} />
                        <AvatarFallback className="text-2xl">
                          {displayName[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Profile Emoji Badge */}
                      <div className="absolute -bottom-2 -right-2 bg-gray-800 rounded-full p-1 border-2 border-gray-600">
                        <span className="text-xl">{selectedEmoji}</span>
                      </div>
                    </div>

                    {/* Avatar Actions */}
                    <div className="flex items-center justify-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        <Upload size={14} className="mr-2" />
                        Upload
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        <Camera size={14} className="mr-2" />
                        Camera
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={generateAvatar}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        Generate
                      </Button>
                      {avatar && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={removeAvatar}
                          className="text-red-400 border-red-500/20 hover:bg-red-500/10"
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                    </div>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="hidden"
                    />
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Profile Emoji Selection */}
                  <div className="space-y-3">
                    <label className="text-white font-medium flex items-center gap-2">
                      <Smile size={18} />
                      Profile Emoji
                    </label>
                    <div className="grid grid-cols-8 gap-2">
                      {quickEmojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => setSelectedEmoji(emoji)}
                          className={cn(
                            "w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all hover:scale-110",
                            selectedEmoji === emoji
                              ? "bg-blue-500 ring-2 ring-blue-400"
                              : "bg-gray-700 hover:bg-gray-600",
                          )}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Status Selection */}
                  <div className="space-y-3">
                    <label className="text-white font-medium">Status</label>
                    <div className="space-y-2">
                      {statusOptions.map((status) => (
                        <button
                          key={status.text}
                          onClick={() => setSelectedStatus(status.text)}
                          className={cn(
                            "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
                            selectedStatus === status.text
                              ? "bg-blue-500/20 border border-blue-500/30"
                              : "bg-gray-800/50 hover:bg-gray-700/50",
                          )}
                        >
                          <span className="text-2xl">{status.emoji}</span>
                          <div className="flex-1">
                            <p className="text-white font-medium">
                              {status.text}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {status.description}
                            </p>
                          </div>
                          {selectedStatus === status.text && (
                            <CheckCircle size={18} className="text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Display Name */}
                  <div className="space-y-2">
                    <label className="text-white font-medium">
                      Display Name
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        disabled={!isEditing}
                        className="bg-gray-800 border-gray-600 text-white"
                        maxLength={30}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-gray-300 border-gray-600 hover:bg-gray-700"
                      >
                        <Edit size={14} />
                      </Button>
                    </div>
                    <span className="text-xs text-gray-400">
                      {displayName.length}/30
                    </span>
                  </div>

                  {/* Bio */}
                  <div className="space-y-2">
                    <label className="text-white font-medium">Bio</label>
                    <Textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      disabled={!isEditing}
                      placeholder="Tell people about yourself..."
                      className="bg-gray-800 border-gray-600 text-white resize-none"
                      rows={3}
                      maxLength={150}
                    />
                    <span className="text-xs text-gray-400">
                      {bio.length}/150
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Privacy Tab */}
              {activeTab === "privacy" && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Visibility Settings */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Eye size={18} />
                      Visibility
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Show Last Seen</p>
                          <p className="text-gray-400 text-sm">
                            Others can see when you were last online
                          </p>
                        </div>
                        <Switch
                          checked={showLastSeen}
                          onCheckedChange={setShowLastSeen}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Show Online Status</p>
                          <p className="text-gray-400 text-sm">
                            Show when you're currently online
                          </p>
                        </div>
                        <Switch
                          checked={showOnlineStatus}
                          onCheckedChange={setShowOnlineStatus}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Read Receipts</p>
                          <p className="text-gray-400 text-sm">
                            Show when you've read messages
                          </p>
                        </div>
                        <Switch
                          checked={readReceipts}
                          onCheckedChange={setReadReceipts}
                        />
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Friend Request Settings */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <UserPlus size={18} />
                      Friend Requests
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Allow Friend Requests</p>
                        <p className="text-gray-400 text-sm">
                          Others can send you friend requests
                        </p>
                      </div>
                      <Switch
                        checked={allowFriendRequests}
                        onCheckedChange={setAllowFriendRequests}
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Profile Photo Privacy */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">
                      Profile Photo Visibility
                    </h3>
                    <div className="space-y-2">
                      {[
                        { value: "everyone", label: "Everyone" },
                        { value: "contacts", label: "My Contacts" },
                        { value: "nobody", label: "Nobody" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setProfilePhotoPrivacy(option.value)}
                          className={cn(
                            "w-full flex items-center justify-between p-3 rounded-lg transition-colors",
                            profilePhotoPrivacy === option.value
                              ? "bg-blue-500/20 border border-blue-500/30"
                              : "bg-gray-800/50 hover:bg-gray-700/50",
                          )}
                        >
                          <span className="text-white">{option.label}</span>
                          {profilePhotoPrivacy === option.value && (
                            <CheckCircle size={18} className="text-blue-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  {/* Message Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <MessageSquare size={18} />
                      Messages
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Message Notifications</p>
                        <p className="text-gray-400 text-sm">
                          Get notified when you receive messages
                        </p>
                      </div>
                      <Switch
                        checked={messageNotifications}
                        onCheckedChange={setMessageNotifications}
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Social Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <UserPlus size={18} />
                      Social
                    </h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Friend Requests</p>
                        <p className="text-gray-400 text-sm">
                          Get notified about new friend requests
                        </p>
                      </div>
                      <Switch
                        checked={friendRequestNotifications}
                        onCheckedChange={setFriendRequestNotifications}
                      />
                    </div>
                  </div>

                  <Separator className="bg-gray-700" />

                  {/* Study Notifications */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium flex items-center gap-2">
                      <Clock size={18} />
                      Study
                    </h3>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">Study Reminders</p>
                          <p className="text-gray-400 text-sm">
                            Get reminded about study sessions
                          </p>
                        </div>
                        <Switch
                          checked={studyReminders}
                          onCheckedChange={setStudyReminders}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white">
                            Achievement Notifications
                          </p>
                          <p className="text-gray-400 text-sm">
                            Get notified about achievements and milestones
                          </p>
                        </div>
                        <Switch
                          checked={achievementNotifications}
                          onCheckedChange={setAchievementNotifications}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
