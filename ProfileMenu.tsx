import { motion } from "framer-motion";
import { User, Users, LogOut, Edit, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ProfileMenuProps {
  onClose: () => void;
}

export default function ProfileMenu({ onClose }: ProfileMenuProps) {
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const { user, logout, updateProfile } = useAuth();
  const { friends } = useChat();

  const handleEditProfile = () => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setShowEditProfile(true);
  };

  const handleSaveProfile = () => {
    updateProfile({ username, bio });
    setShowEditProfile(false);
  };

  const menuVariants = {
    hidden: { opacity: 0, scale: 0.95, y: -10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: -10 },
  };

  if (showEditProfile) {
    return (
      <motion.div
        className="absolute top-full left-0 mt-2 w-80 glass-card p-6 z-50"
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Edit Profile</h3>
          <button
            onClick={() => setShowEditProfile(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="edit-username" className="text-gray-300">
              Username
            </Label>
            <Input
              id="edit-username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 bg-gray-800/50 border-gray-600 focus:border-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="edit-bio" className="text-gray-300">
              Bio
            </Label>
            <Textarea
              id="edit-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="mt-1 bg-gray-800/50 border-gray-600 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Tell us about yourself..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleSaveProfile}
              className="flex-1 glass-button text-white"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setShowEditProfile(false)}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:text-white"
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    );
  }

  if (showFriendsList) {
    return (
      <motion.div
        className="absolute top-full left-0 mt-2 w-80 glass-card p-6 z-50 max-h-96 overflow-y-auto custom-scrollbar"
        variants={menuVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            Friends ({friends.length})
          </h3>
          <button
            onClick={() => setShowFriendsList(false)}
            className="text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3">
          {friends.map((friend) => (
            <motion.div
              key={friend.id}
              className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={friend.avatar}
                alt={friend.username}
                className="w-10 h-10 rounded-full"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium">{friend.username}</p>
                  {friend.isOnline && (
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{friend.bio}</p>
                {!friend.isOnline && friend.lastSeen && (
                  <p className="text-gray-500 text-xs">
                    Last seen {friend.lastSeen}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute top-full left-0 mt-2 w-64 glass-card p-4 z-[9999]"
      variants={menuVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ duration: 0.2 }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* User Info */}
      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
        <img
          src={
            user?.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=default"
          }
          alt={user?.username}
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-white font-medium">{user?.username}</p>
          <p className="text-gray-400 text-sm">{user?.bio}</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleEditProfile();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-white hover:bg-white/10 transition-colors"
        >
          <Edit size={18} />
          <span>Edit Profile</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowFriendsList(true);
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-white hover:bg-white/10 transition-colors"
        >
          <Users size={18} />
          <span>Friends ({friends.length})</span>
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            logout();
            onClose();
          }}
          className="w-full flex items-center gap-3 p-3 rounded-lg text-left text-red-400 hover:bg-red-500/20 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </motion.div>
  );
}
