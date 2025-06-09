import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Users,
  Search,
  Plus,
  Check,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  Briefcase,
  Coffee,
  Camera,
  Settings,
  Crown,
  Shield,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface GroupChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  friends: Array<{
    id: string;
    username: string;
    avatar?: string;
    isOnline?: boolean;
  }>;
  currentFriend?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

type GroupType = "study" | "project" | "social" | "custom";
type ModalStep = "type" | "members" | "settings" | "permissions";

const groupTypes = [
  {
    id: "study",
    name: "Study Group",
    description: "For studying together and sharing resources",
    icon: BookOpen,
    color: "from-blue-500 to-blue-600",
    features: ["File sharing", "Study sessions", "Progress tracking"],
  },
  {
    id: "project",
    name: "Project Group",
    description: "Collaborate on projects and assignments",
    icon: Briefcase,
    color: "from-green-500 to-green-600",
    features: ["Task management", "Deadlines", "Version control"],
  },
  {
    id: "social",
    name: "Social Group",
    description: "Casual conversations and socializing",
    icon: Coffee,
    color: "from-purple-500 to-purple-600",
    features: ["Voice chats", "Events", "Fun activities"],
  },
  {
    id: "custom",
    name: "Custom Group",
    description: "Create your own group type",
    icon: Settings,
    color: "from-gray-500 to-gray-600",
    features: ["Custom features", "Flexible settings", "Your rules"],
  },
];

export default function GroupChatModal({
  isOpen,
  onClose,
  friends,
  currentFriend,
}: GroupChatModalProps) {
  const [currentStep, setCurrentStep] = useState<ModalStep>("type");
  const [selectedType, setSelectedType] = useState<GroupType>("study");
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
    currentFriend ? new Set([currentFriend.id]) : new Set(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [allowInvites, setAllowInvites] = useState(true);
  const [adminApproval, setAdminApproval] = useState(false);

  const filteredFriends = friends.filter((friend) =>
    friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const toggleMember = (friendId: string) => {
    const newSelected = new Set(selectedMembers);
    if (newSelected.has(friendId)) {
      newSelected.delete(friendId);
    } else {
      newSelected.add(friendId);
    }
    setSelectedMembers(newSelected);
  };

  const nextStep = () => {
    switch (currentStep) {
      case "type":
        setCurrentStep("members");
        break;
      case "members":
        setCurrentStep("settings");
        break;
      case "settings":
        setCurrentStep("permissions");
        break;
      case "permissions":
        handleCreateGroup();
        break;
    }
  };

  const prevStep = () => {
    switch (currentStep) {
      case "members":
        setCurrentStep("type");
        break;
      case "settings":
        setCurrentStep("members");
        break;
      case "permissions":
        setCurrentStep("settings");
        break;
    }
  };

  const handleCreateGroup = () => {
    const groupData = {
      type: selectedType,
      name: groupName,
      description: groupDescription,
      members: Array.from(selectedMembers),
      settings: {
        isPrivate,
        allowInvites,
        adminApproval,
      },
    };

    console.log("Creating group:", groupData);
    onClose();

    // Reset form
    setCurrentStep("type");
    setSelectedType("study");
    setSelectedMembers(currentFriend ? new Set([currentFriend.id]) : new Set());
    setGroupName("");
    setGroupDescription("");
    setIsPrivate(false);
    setAllowInvites(true);
    setAdminApproval(false);
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case "type":
        return "Choose Group Type";
      case "members":
        return "Add Members";
      case "settings":
        return "Group Settings";
      case "permissions":
        return "Permissions";
      default:
        return "";
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "type":
        return selectedType !== null;
      case "members":
        return selectedMembers.size > 0;
      case "settings":
        return groupName.trim().length > 0;
      case "permissions":
        return true;
      default:
        return false;
    }
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
            <div>
              <h2 className="text-white text-xl font-semibold">
                {getStepTitle()}
              </h2>
              <div className="flex items-center gap-2 mt-2">
                {["type", "members", "settings", "permissions"].map(
                  (step, index) => (
                    <div
                      key={step}
                      className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        ["type", "members", "settings", "permissions"].indexOf(
                          currentStep,
                        ) >= index
                          ? "bg-blue-500"
                          : "bg-gray-600",
                      )}
                    />
                  ),
                )}
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X size={20} />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            <AnimatePresence mode="wait">
              {/* Step 1: Group Type */}
              {currentStep === "type" && (
                <motion.div
                  key="type"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-gray-400 mb-6">
                    Choose the type of group you want to create. This will
                    determine the available features and settings.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {groupTypes.map((type) => {
                      const IconComponent = type.icon;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setSelectedType(type.id as GroupType)}
                          className={cn(
                            "p-4 rounded-lg border transition-all text-left space-y-3",
                            selectedType === type.id
                              ? "border-blue-500 bg-blue-500/10"
                              : "border-gray-600 hover:border-gray-500",
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={cn(
                                "p-2 rounded-lg bg-gradient-to-r",
                                type.color,
                              )}
                            >
                              <IconComponent size={20} className="text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-medium">
                                {type.name}
                              </h3>
                              <p className="text-gray-400 text-sm">
                                {type.description}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {type.features.map((feature, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2"
                              >
                                <Check size={12} className="text-green-400" />
                                <span className="text-gray-300 text-xs">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Step 2: Members */}
              {currentStep === "members" && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  <p className="text-gray-400 mb-4">
                    Select friends to add to your group. You can add more
                    members later.
                  </p>

                  {/* Search */}
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search friends..."
                      className="pl-10 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>

                  {/* Selected Members */}
                  {selectedMembers.size > 0 && (
                    <div className="space-y-2">
                      <span className="text-sm text-gray-400">
                        Selected ({selectedMembers.size})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {Array.from(selectedMembers).map((memberId) => {
                          const friend = friends.find((f) => f.id === memberId);
                          if (!friend) return null;
                          return (
                            <Badge
                              key={memberId}
                              variant="secondary"
                              className="bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            >
                              {friend.username}
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => toggleMember(memberId)}
                                className="ml-1 p-0 h-auto text-blue-300 hover:text-white"
                              >
                                <X size={12} />
                              </Button>
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Friends List */}
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                          selectedMembers.has(friend.id)
                            ? "bg-blue-500/20 border border-blue-500/30"
                            : "bg-gray-800/50 hover:bg-gray-700/50",
                        )}
                        onClick={() => toggleMember(friend.id)}
                      >
                        <div className="relative">
                          <Avatar className="w-10 h-10">
                            <AvatarImage
                              src={friend.avatar}
                              alt={friend.username}
                            />
                            <AvatarFallback>
                              {friend.username[0].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {friend.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">
                            {friend.username}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {friend.isOnline ? "Online" : "Offline"}
                          </p>
                        </div>
                        {selectedMembers.has(friend.id) && (
                          <Check size={18} className="text-blue-400" />
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Step 3: Settings */}
              {currentStep === "settings" && (
                <motion.div
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-gray-400 mb-4">
                    Configure your group settings and appearance.
                  </p>

                  {/* Group Avatar */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center">
                      <Users size={24} className="text-gray-400" />
                    </div>
                    <Button
                      variant="outline"
                      className="text-gray-300 border-gray-600 hover:bg-gray-700"
                    >
                      <Camera size={16} className="mr-2" />
                      Add Photo
                    </Button>
                  </div>

                  {/* Group Name */}
                  <div className="space-y-2">
                    <label className="text-white font-medium">
                      Group Name *
                    </label>
                    <Input
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      placeholder="Enter group name..."
                      className="bg-gray-800 border-gray-600 text-white"
                      maxLength={50}
                    />
                    <span className="text-xs text-gray-400">
                      {groupName.length}/50
                    </span>
                  </div>

                  {/* Group Description */}
                  <div className="space-y-2">
                    <label className="text-white font-medium">
                      Description
                    </label>
                    <Textarea
                      value={groupDescription}
                      onChange={(e) => setGroupDescription(e.target.value)}
                      placeholder="Describe your group (optional)..."
                      className="bg-gray-800 border-gray-600 text-white resize-none"
                      rows={3}
                      maxLength={200}
                    />
                    <span className="text-xs text-gray-400">
                      {groupDescription.length}/200
                    </span>
                  </div>

                  {/* Privacy Settings */}
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Privacy Settings</h3>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-white">Private Group</p>
                        <p className="text-gray-400 text-sm">
                          Only invited members can join
                        </p>
                      </div>
                      <Switch
                        checked={isPrivate}
                        onCheckedChange={setIsPrivate}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Permissions */}
              {currentStep === "permissions" && (
                <motion.div
                  key="permissions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <p className="text-gray-400 mb-4">
                    Set up permissions and admin controls for your group.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <UserPlus size={18} className="text-gray-400" />
                        <div>
                          <p className="text-white">Allow Member Invites</p>
                          <p className="text-gray-400 text-sm">
                            Members can invite others to the group
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={allowInvites}
                        onCheckedChange={setAllowInvites}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Shield size={18} className="text-gray-400" />
                        <div>
                          <p className="text-white">Admin Approval</p>
                          <p className="text-gray-400 text-sm">
                            New members need admin approval
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={adminApproval}
                        onCheckedChange={setAdminApproval}
                      />
                    </div>
                  </div>

                  {/* Admin Role */}
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <Crown size={18} className="text-yellow-400" />
                      <span className="text-yellow-400 font-medium">
                        Group Admin
                      </span>
                    </div>
                    <p className="text-gray-300 text-sm">
                      You will be the group admin with full permissions to
                      manage members, settings, and content.
                    </p>
                  </div>

                  {/* Group Summary */}
                  <div className="p-4 bg-gray-800/50 rounded-lg">
                    <h3 className="text-white font-medium mb-3">
                      Group Summary
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <span className="text-white">
                          {groupTypes.find((t) => t.id === selectedType)?.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Members:</span>
                        <span className="text-white">
                          {selectedMembers.size + 1} (including you)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Privacy:</span>
                        <span className="text-white">
                          {isPrivate ? "Private" : "Public"}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-600">
            <Button
              variant="ghost"
              onClick={currentStep === "type" ? onClose : prevStep}
              className="text-gray-400 hover:text-white"
            >
              <ArrowLeft size={16} className="mr-2" />
              {currentStep === "type" ? "Cancel" : "Back"}
            </Button>

            <Button
              onClick={nextStep}
              disabled={!canProceed()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {currentStep === "permissions" ? "Create Group" : "Next"}
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
