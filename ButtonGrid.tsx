import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, MessageCircle, BookOpen, User } from "lucide-react";

const buttons = [
  {
    id: "stories",
    icon: Camera,
    label: "Stories",
    emoji: "📸",
    route: "/stories",
    gradient: "from-pink-500 to-red-500",
  },
  {
    id: "chat",
    icon: MessageCircle,
    label: "Chat",
    emoji: "💬",
    route: "/messages",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "groups",
    icon: BookOpen,
    label: "Study Groups",
    emoji: "📚",
    route: "/groups",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "profile",
    icon: User,
    label: "Profile",
    emoji: "👤",
    route: "/profile",
    gradient: "from-purple-500 to-violet-500",
  },
];

export default function ButtonGrid() {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
      {buttons.map((button, index) => {
        const Icon = button.icon;

        return (
          <motion.button
            key={button.id}
            onClick={() => navigate(button.route)}
            className="group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.5 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Main button */}
            <div className="glass-card p-6 h-32 flex flex-col items-center justify-center space-y-3 group-hover:shadow-xl transition-all duration-300">
              {/* Background gradient on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${button.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-xl`}
              ></div>

              {/* Icon */}
              <div className="relative z-10">
                <div className="text-3xl mb-1">{button.emoji}</div>
                <Icon className="w-6 h-6 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Label */}
              <span className="text-white font-medium text-sm group-hover:text-white transition-colors relative z-10">
                {button.label}
              </span>

              {/* Hover glow effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${button.gradient} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`}
              ></div>
            </div>

            {/* Notification badge for certain buttons */}
            {(button.id === "chat" || button.id === "stories") && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                <span className="text-white text-xs font-bold">
                  {button.id === "chat" ? "3" : "2"}
                </span>
              </div>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
