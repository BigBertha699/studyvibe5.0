import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  id: string;
  username: string;
  bio?: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  signup: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers = [
  { id: "1", username: "demo", password: "demo", bio: "Demo user" },
  { id: "2", username: "alice", password: "password", bio: "Student at MIT" },
  { id: "3", username: "bob", password: "password", bio: "CS Major" },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("studyvibe_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const foundUser = mockUsers.find(
      (u) => u.username === username && u.password === password,
    );
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        username: foundUser.username,
        bio: foundUser.bio,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${foundUser.username}`,
      };
      setUser(userSession);
      localStorage.setItem("studyvibe_user", JSON.stringify(userSession));
      return true;
    }
    return false;
  };

  const signup = async (
    username: string,
    password: string,
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Check if username already exists
    if (mockUsers.find((u) => u.username === username)) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      bio: "New to StudyVibe.io",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    };

    mockUsers.push({ ...newUser, password });
    setUser(newUser);
    localStorage.setItem("studyvibe_user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    console.log("Logout function executing...");
    console.log("Current user before logout:", user);
    setUser(null);
    localStorage.removeItem("studyvibe_user");
    console.log("User set to null and localStorage cleared");
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("studyvibe_user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
