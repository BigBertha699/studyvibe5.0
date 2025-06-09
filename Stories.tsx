import { motion } from "framer-motion";
import { ArrowLeft, Plus, Heart, MessageCircle, Share } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useChat } from "@/hooks/useChat";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";

export default function Stories() {
  const [selectedStory, setSelectedStory] = useState<number | null>(null);
  const { stories, addStory } = useChat();
  const { user } = useAuth();

  const handleAddStory = () => {
    if (user) {
      const mediaUrl = `https://images.unsplash.com/photo-${(Date.now() % 1000000000) + 1500000000000}?w=800&h=1200&fit=crop`;
      addStory(mediaUrl, user.id, user.username, user.avatar || "");
    }
  };

  const timeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "now";
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  if (selectedStory !== null && stories[selectedStory]) {
    const story = stories[selectedStory];

    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* Story Viewer */}
        <div className="relative h-full">
          {/* Background Image */}
          <img
            src={story.mediaUrl}
            alt="Story"
            className="w-full h-full object-cover"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/20">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setSelectedStory(null)}
                  className="text-white p-2"
                >
                  <ArrowLeft size={24} />
                </button>

                <div className="flex items-center gap-3">
                  <img
                    src={story.avatar}
                    alt={story.username}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="text-white font-medium text-sm">
                      {story.username}
                    </p>
                    <p className="text-gray-300 text-xs">
                      {timeAgo(story.timestamp)}
                    </p>
                  </div>
                </div>

                <div></div>
              </div>

              {/* Progress bars */}
              <div className="flex gap-1 mt-4">
                {stories.map((_, index) => (
                  <div
                    key={index}
                    className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden"
                  >
                    <div
                      className={`h-full bg-white transition-all duration-300 ${
                        index === selectedStory
                          ? "w-full"
                          : index < selectedStory
                            ? "w-full"
                            : "w-0"
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
              <div className="flex items-center justify-center gap-8">
                <button className="text-white p-3 glass-button rounded-full">
                  <Heart size={24} />
                </button>
                <button className="text-white p-3 glass-button rounded-full">
                  <MessageCircle size={24} />
                </button>
                <button className="text-white p-3 glass-button rounded-full">
                  <Share size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={() => setSelectedStory(Math.max(0, selectedStory - 1))}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-2"
            disabled={selectedStory === 0}
          >
            {selectedStory > 0 && <ArrowLeft size={32} />}
          </button>

          <button
            onClick={() =>
              setSelectedStory(Math.min(stories.length - 1, selectedStory + 1))
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-2"
            disabled={selectedStory === stories.length - 1}
          >
            {selectedStory < stories.length - 1 && (
              <ArrowLeft size={32} className="rotate-180" />
            )}
          </button>
        </div>
      </div>
    );
  }

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
              <h1 className="text-2xl font-bold text-white">📸 Stories</h1>
            </div>

            <Button
              onClick={handleAddStory}
              className="glass-button text-white"
            >
              <Plus size={20} className="mr-2" />
              Add Story
            </Button>
          </motion.div>

          {/* Stories Grid */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {stories.map((story, index) => (
              <motion.button
                key={story.id}
                onClick={() => setSelectedStory(index)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Story Image */}
                <img
                  src={story.mediaUrl}
                  alt={`${story.username}'s story`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30">
                  {/* User info */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <img
                      src={story.avatar}
                      alt={story.username}
                      className="w-6 h-6 rounded-full border border-white"
                    />
                    <span className="text-white text-sm font-medium">
                      {story.username}
                    </span>
                  </div>

                  {/* Timestamp */}
                  <div className="absolute bottom-3 left-3 text-white text-xs">
                    {timeAgo(story.timestamp)}
                  </div>

                  {/* Unviewed indicator */}
                  {!story.isViewed && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Empty State */}
          {stories.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-6xl mb-4">📸</div>
              <h2 className="text-2xl font-bold text-white mb-4">
                No Stories Yet
              </h2>
              <p className="text-gray-400 mb-8">
                Share your first story with friends!
              </p>
              <Button
                onClick={handleAddStory}
                className="glass-button text-white"
              >
                <Plus size={20} className="mr-2" />
                Create Your First Story
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </Layout>
  );
}
