import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useChat } from "@/hooks/useChat";
import Layout from "@/components/Layout";
import StoryCircle from "@/components/StoryCircle";
import ButtonGrid from "@/components/ButtonGrid";

export default function Index() {
  const { user } = useAuth();
  const { stories, addStory } = useChat();

  const handleAddStory = () => {
    // Simulate adding a story
    if (user) {
      const mediaUrl = `https://images.unsplash.com/photo-${(Date.now() % 1000000000) + 1500000000000}?w=400`;
      addStory(mediaUrl, user.id, user.username, user.avatar || "");
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pb-20 md:pb-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Stories Section */}
          <motion.section
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
              {/* Add Story Button */}
              <div className="flex-shrink-0">
                <StoryCircle isAddStory onAddStory={handleAddStory} />
              </div>

              {/* Stories */}
              {stories.map((story) => (
                <div key={story.id} className="flex-shrink-0">
                  <StoryCircle story={story} />
                </div>
              ))}
            </div>
          </motion.section>

          {/* Welcome Section */}
          <motion.section
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.h1
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            >
              Hello, {user?.username}! 👋
            </motion.h1>
            <motion.p
              className="text-xl text-gray-300 neon-purple"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Welcome to Anonymous Chats ✨
            </motion.p>
          </motion.section>

          {/* Button Grid */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <ButtonGrid />
          </motion.section>

          {/* Quick Stats */}
          <motion.section
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-blue-400 mb-2">12</div>
              <div className="text-gray-300 text-sm">Active Chats</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">5</div>
              <div className="text-gray-300 text-sm">Study Groups</div>
            </div>

            <div className="glass-card p-6 text-center">
              <div className="text-2xl font-bold text-purple-400 mb-2">28</div>
              <div className="text-gray-300 text-sm">Friends Online</div>
            </div>
          </motion.section>

          {/* Recent Activity */}
          <motion.section
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <h2 className="text-xl font-bold text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">💬</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">New message from Alice</p>
                  <p className="text-gray-400 text-xs">2 minutes ago</p>
                </div>
              </div>

              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👥</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">
                    Bob joined study group "Math 101"
                  </p>
                  <p className="text-gray-400 text-xs">1 hour ago</p>
                </div>
              </div>

              <div className="glass-card p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">📸</span>
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">Carol added a new story</p>
                  <p className="text-gray-400 text-xs">3 hours ago</p>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </Layout>
  );
}
