import { motion } from "framer-motion";
import {
  ArrowLeft,
  Plus,
  Users,
  Crown,
  Settings,
  UserMinus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function StudyGroups() {
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [selectedFriends, setSelectedFriends] = useState<string[]>([]);
  const { studyGroups, friends, createStudyGroup } = useChat();
  const { user } = useAuth();

  const handleCreateGroup = () => {
    if (groupName.trim() && selectedFriends.length > 0 && user) {
      createStudyGroup(groupName, selectedFriends, user.id);
      setGroupName("");
      setSelectedFriends([]);
      setShowCreateGroup(false);
    }
  };

  const toggleFriendSelection = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId)
        ? prev.filter((id) => id !== friendId)
        : [...prev, friendId],
    );
  };

  return (
    <Layout>
      <div className="min-h-screen pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            className="flex items-center justify-between mb-8"
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
              <h1 className="text-2xl font-bold text-white">📚 Study Groups</h1>
            </div>

            <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
              <DialogTrigger asChild>
                <Button className="glass-button text-white">
                  <Plus size={20} className="mr-2" />
                  Create Group
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-900 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>Create Study Group</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="group-name">Group Name</Label>
                    <Input
                      id="group-name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="bg-gray-800 border-gray-600 focus:border-blue-500"
                      placeholder="Enter group name"
                    />
                  </div>

                  <div>
                    <Label>Select Friends</Label>
                    <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                      {friends.map((friend) => (
                        <div
                          key={friend.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={friend.id}
                            checked={selectedFriends.includes(friend.id)}
                            onCheckedChange={() =>
                              toggleFriendSelection(friend.id)
                            }
                          />
                          <label
                            htmlFor={friend.id}
                            className="flex items-center gap-2 cursor-pointer flex-1"
                          >
                            <img
                              src={friend.avatar}
                              alt={friend.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <span>{friend.username}</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={handleCreateGroup}
                      disabled={
                        !groupName.trim() || selectedFriends.length === 0
                      }
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      Create Group
                    </Button>
                    <Button
                      onClick={() => setShowCreateGroup(false)}
                      variant="outline"
                      className="flex-1 border-gray-600"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>

          {/* Study Groups */}
          {studyGroups.length > 0 ? (
            <motion.div
              className="grid gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {studyGroups.map((group, index) => (
                <motion.div
                  key={group.id}
                  className="glass-card p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Users size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {group.name}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {group.members.length} members
                        </p>
                      </div>
                    </div>

                    {group.adminId === user?.id && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-white"
                      >
                        <Settings size={16} />
                      </Button>
                    )}
                  </div>

                  {/* Members */}
                  <div className="space-y-2">
                    {group.members.map((memberId) => {
                      const member =
                        friends.find((f) => f.id === memberId) ||
                        (memberId === user?.id ? user : null);
                      if (!member) return null;

                      return (
                        <div
                          key={memberId}
                          className="flex items-center justify-between p-2 rounded-lg bg-gray-800/30"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={
                                member.avatar ||
                                `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.username}`
                              }
                              alt={member.username}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <span className="text-white font-medium">
                                {member.username}
                              </span>
                              {group.adminId === memberId && (
                                <Crown
                                  size={14}
                                  className="inline ml-2 text-yellow-500"
                                />
                              )}
                            </div>
                          </div>

                          {group.adminId === user?.id &&
                            memberId !== user?.id && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-red-400 hover:text-red-300"
                              >
                                <UserMinus size={14} />
                              </Button>
                            )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button className="flex-1 glass-button text-white">
                      💬 Group Chat
                    </Button>
                    <Button
                      variant="outline"
                      className="border-gray-600 text-gray-300"
                    >
                      📝 Study Materials
                    </Button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            /* Empty State */
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No Study Groups Yet
              </h2>
              <p className="text-gray-400 mb-2">
                Add friends to start a study group
              </p>
              {friends.length === 0 ? (
                <p className="text-red-400 mb-8">
                  You need to add friends first!
                </p>
              ) : (
                <p className="text-green-400 mb-8">
                  You have {friends.length} friends available
                </p>
              )}

              <Button
                onClick={() => setShowCreateGroup(true)}
                disabled={friends.length === 0}
                className="glass-button text-white"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Group
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
