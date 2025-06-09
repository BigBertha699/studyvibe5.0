import { ReactNode, useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, MoreHorizontal } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ProfileMenu from "./ProfileMenu";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  const isHomePage = location.pathname === "/";

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showProfileMenu]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Menu */}
            <div className="relative" ref={menuRef}>
              <motion.button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 rounded-lg glass-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MoreHorizontal size={20} className="text-white" />
              </motion.button>

              <AnimatePresence>
                {showProfileMenu && (
                  <ProfileMenu onClose={() => setShowProfileMenu(false)} />
                )}
              </AnimatePresence>
            </div>

            {/* Center - Logo */}
            <Link to="/" className="flex items-center">
              <motion.h1
                className="text-2xl font-bold neon-blue"
                whileHover={{ scale: 1.05 }}
              >
                StudyVibe.io
              </motion.h1>
            </Link>

            {/* Right - DM Icon */}
            <Link to="/messages">
              <motion.div
                className="p-2 rounded-lg glass-button relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <MessageCircle size={20} className="text-white" />
                {/* Notification badge - you can add logic here later */}
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              </motion.div>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">{children}</main>

      {/* Bottom Navigation for Mobile */}
      {isHomePage && (
        <motion.nav
          className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 md:hidden z-20"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-around py-2">
            <Link to="/" className="p-3">
              <div className="text-white text-xs text-center">
                <div className="text-2xl mb-1">🏠</div>
                Home
              </div>
            </Link>
            <Link to="/stories" className="p-3">
              <div className="text-white text-xs text-center">
                <div className="text-2xl mb-1">📸</div>
                Stories
              </div>
            </Link>
            <Link to="/groups" className="p-3">
              <div className="text-white text-xs text-center">
                <div className="text-2xl mb-1">📚</div>
                Groups
              </div>
            </Link>
            <Link to="/messages" className="p-3">
              <div className="text-white text-xs text-center relative">
                <div className="text-2xl mb-1">💬</div>
                Chat
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
              </div>
            </Link>
          </div>
        </motion.nav>
      )}
    </div>
  );
}
