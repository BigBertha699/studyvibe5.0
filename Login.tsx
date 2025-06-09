import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("demo@studyvibe.com");
  const [password, setPassword] = useState("demo");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterOption, setShowRegisterOption] = useState(false);

  const { login, signup } = useAuth();

  const handleSubmit = async (isRegister: boolean = false) => {
    setIsLoading(true);
    setError("");

    try {
      // Use email as username for demo
      const success = isRegister
        ? await signup(email, password)
        : await login(email, password);

      if (!success) {
        setError(isRegister ? "Email already exists" : "Invalid credentials");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020817] flex items-center justify-center p-4">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 via-purple-800 to-slate-800"></div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-[448px]"
      >
        {/* Login Card with glassmorphism effect */}
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
          {/* Brand Header */}
          <div className="text-center mb-8">
            <motion.div
              className="flex items-center justify-center mb-6"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              {/* Gradient Brand Icon */}
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                <BookOpen size={24} className="text-white" />
              </div>
            </motion.div>

            {/* Gradient Brand Title */}
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              StudyVibe
            </h1>
            <p className="text-white/60 text-sm">Social learning platform</p>
          </div>

          {/* Login Form */}
          <div className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-white/80 text-sm font-medium mb-2"
              >
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 bg-white/5 border border-white/10 focus:border-white/20 focus:ring-0 text-white placeholder-white/40 rounded-md px-3 text-sm"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-white/80 text-sm font-medium mb-2"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 bg-white/5 border border-white/10 focus:border-white/20 focus:ring-0 text-white placeholder-white/40 rounded-md px-3 pr-10 text-sm"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm text-center bg-red-500/10 py-3 px-4 rounded-md border border-red-500/20"
              >
                {error}
              </motion.div>
            )}

            {/* Submit Button */}
            <Button
              onClick={() => handleSubmit(false)}
              disabled={isLoading || !email.trim() || !password.trim()}
              className="w-full h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-md font-medium text-sm border-0 transition-all duration-200 shadow-lg shadow-blue-500/25"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Register Option */}
            {showRegisterOption && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="space-y-4"
              >
                <Button
                  onClick={() => handleSubmit(true)}
                  disabled={isLoading || !email.trim() || !password.trim()}
                  className="w-full h-12 bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-white/30 rounded-md font-medium text-sm transition-all duration-200"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            {!showRegisterOption ? (
              <p className="text-white/60 text-sm">
                Don't have an account?{" "}
                <button
                  onClick={() => setShowRegisterOption(true)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <button
                  onClick={() => setShowRegisterOption(false)}
                  className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
                >
                  Sign in
                </button>
              </p>
            )}
          </div>

          {/* Demo Info */}
          <motion.div
            className="mt-6 p-4 bg-blue-500/10 rounded-md border border-blue-500/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs text-blue-300 text-center">
              Demo: demo@studyvibe.com / demo
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
