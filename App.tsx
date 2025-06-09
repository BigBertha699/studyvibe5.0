import {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
  ReactNode,
  useCallback,
} from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Eye,
  EyeOff,
  Home,
  Users,
  MessageCircle,
  Settings,
  Search,
  Bell,
  User,
  Send,
  Plus,
  MoreHorizontal,
  LogOut,
  Heart,
  Share,
  X,
  Camera,
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Download,
  Trash2,
  Clock,
  ChevronLeft,
  ChevronRight,
  Smile,
  Paperclip,
  Image,
  Video,
  FileText,
  File,
  Mic,
  StopCircle,
  PlayCircle,
  ExternalLink,
  ZoomIn,
  RotateCcw,
  Calendar,
  VideoIcon,
  PenTool,
  Timer,
  Target,
  Trophy,
  Bookmark,
  Folder,
  Filter,
  Star,
  Brain,
  Lightbulb,
  Coffee,
  Headphones,
  Shuffle,
  Edit3,
  Save,
  RefreshCw,
  TrendingUp,
  Award,
  Zap,
  CheckCircle,
  PlaySquare,
  PhoneCall,
  PhoneOff,
  Minimize2,
  Maximize2,
  MicOff,
  Monitor,
  Layout,
  FolderOpen,
  Archive,
  Grid,
  List,
  SortAsc,
  Hash,
  GraduationCap,
  Calculator,
  FlaskConical,
  History,
  Palette,
  Globe,
  Languages,
  BarChart2,
  Loader2,
  CheckCheck,
  MapPin,
  Wifi,
  WifiOff,
  Moon,
  Sun,
  Music,
  Gamepad2,
  Library,
  NotebookPen,
  ClipboardList,
  Presentation,
  FileSpreadsheet,
  FileImage,
  Shield,
  Lock,
  Key,
  CloudUpload,
  Database,
  Cpu,
  HardDrive,
  Network,
  Activity,
  PieChart,
  Layers,
  Inbox,
  MessageSquareMore,
  Phone,
  Mail,
  MapPinned,
  QrCode,
  CreditCard,
  BadgeCheck,
  UserCheck,
  UserX,
  Fingerprint,
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  HelpCircle,
  ExternalLink as LinkIcon,
  Gamepad,
  Puzzle,
  Dice6,
  Flame,
  Sparkles,
  Rainbow,
  Cpu as ProcessorIcon,
  MemoryStick,
  Rocket,
  Satellite,
  Atom,
  Dna,
  Telescope,
  Microscope,
  Beaker,
  Menu,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

// Import existing pages
import Login from "@/pages/Login";
import Chat from "@/pages/Chat";
import Index from "@/pages/Index";
import DirectMessages from "@/pages/DirectMessages";
import Stories from "@/pages/Stories";
import StudyGroups from "@/pages/StudyGroups";
import { useAuth, AuthProvider } from "@/hooks/useAuth";
import { useChat, ChatProvider } from "@/hooks/useChat";
import ProfileModal from "@/components/ProfileModal";
import ProfileStatusBar from "@/components/ProfileStatusBar";
import StatusModal from "@/components/StatusModal";

// Types and Interfaces
// ExtendedUser for additional features
interface ExtendedUserData {
  level?: number;
  points?: number;
  badges?: string[];
  subjects?: string[];
  goals?: Goal[];
  achievements?: Achievement[];
  preferences?: UserPreferences;
  stats?: UserStats;
  isPremium?: boolean;
  subscription?: Subscription;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetHours: number;
  currentHours: number;
  deadline: Date;
  category: string;
  isCompleted: boolean;
  createdAt: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  category: "study" | "social" | "milestone" | "streak";
}

interface UserPreferences {
  theme: "light" | "dark" | "auto";
  language: string;
  notifications: {
    email: boolean;
    push: boolean;
    studyReminders: boolean;
    socialActivity: boolean;
    achievements: boolean;
  };
  privacy: {
    profileVisibility: "public" | "friends" | "private";
    showOnlineStatus: boolean;
    allowFriendRequests: boolean;
  };
  study: {
    focusMode: boolean;
    breakReminders: boolean;
    sessionLength: number;
    breakLength: number;
  };
}

interface UserStats {
  totalSessions: number;
  averageSessionLength: number;
  favoriteSubject: string;
  productiveHours: string[];
  weeklyGoal: number;
  weeklyProgress: number;
  monthlyProgress: number;
  streak: {
    current: number;
    longest: number;
  };
}

interface Subscription {
  plan: "free" | "premium" | "pro";
  validUntil?: Date;
  features: string[];
}

interface StudySession {
  id: string;
  userId: string;
  subject: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  notes?: string;
  rating?: number;
  tags?: string[];
}

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  adminId: string;
  members: string[];
  subject: string;
  schedule?: {
    dayOfWeek: number;
    time: string;
    timezone: string;
  };
  isPrivate: boolean;
  createdAt: Date;
  lastActivity: Date;
  memberCount: number;
  sessionsCount: number;
}

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  type: "study" | "exam" | "assignment" | "break" | "social";
  subject?: string;
  location?: string;
  attendees?: string[];
  reminders?: Date[];
  isRecurring?: boolean;
  recurrencePattern?: string;
}

interface Notification {
  id: string;
  userId: string;
  type:
    | "friend_request"
    | "study_reminder"
    | "achievement"
    | "group_invite"
    | "message"
    | "system";
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
  data?: any;
}

// Using AuthProvider from hooks/useAuth.tsx

// Enhanced Study Context
interface StudyContextType {
  currentSession: StudySession | null;
  sessions: StudySession[];
  groups: StudyGroup[];
  goals: Goal[];
  events: Event[];
  startSession: (subject: string, notes?: string) => void;
  endSession: (rating?: number, notes?: string) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  addGoal: (goal: Omit<Goal, "id" | "createdAt">) => void;
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
  joinGroup: (groupId: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  createGroup: (
    group: Omit<
      StudyGroup,
      "id" | "createdAt" | "memberCount" | "sessionsCount"
    >,
  ) => Promise<StudyGroup>;
  addEvent: (event: Omit<Event, "id">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
}

// Enhanced App State
interface AppState {
  theme: "light" | "dark" | "auto";
  sidebar: {
    isCollapsed: boolean;
    activeSection: string;
  };
  notifications: Notification[];
  isOnline: boolean;
  focusMode: boolean;
  currentView: string;
  searchQuery: string;
  filters: {
    subject?: string;
    dateRange?: { start: Date; end: Date };
    type?: string;
  };
}

// Extended mock data for the enhanced features

const mockGoals: Goal[] = [
  {
    id: "1",
    title: "Complete Data Structures Course",
    description: "Finish all modules and practice problems",
    targetHours: 40,
    currentHours: 28,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    category: "Computer Science",
    isCompleted: false,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    title: "Math Exam Preparation",
    description: "Prepare for calculus final exam",
    targetHours: 30,
    currentHours: 22,
    deadline: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    category: "Mathematics",
    isCompleted: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
  },
];

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "Early Bird",
    description: "Complete 10 study sessions before 8 AM",
    icon: "🌅",
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    category: "study",
  },
  {
    id: "2",
    title: "Streak Master",
    description: "Maintain a 10-day study streak",
    icon: "🔥",
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    category: "streak",
  },
  {
    id: "3",
    title: "Social Butterfly",
    description: "Join 5 study groups",
    icon: "🦋",
    unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    category: "social",
  },
];

const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "1",
    type: "friend_request",
    title: "New Friend Request",
    message: "Alice wants to be your study buddy",
    isRead: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
    actionUrl: "/friends",
  },
  {
    id: "2",
    userId: "1",
    type: "achievement",
    title: "Achievement Unlocked!",
    message: 'You earned the "Consistent Learner" badge',
    isRead: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "3",
    userId: "1",
    type: "study_reminder",
    title: "Study Time!",
    message: "Time for your scheduled Math session",
    isRead: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
];

// Using the existing AuthProvider from hooks/useAuth.tsx

// Enhanced Study Provider
function StudyProvider({ children }: { children: ReactNode }) {
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null,
  );
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [goals, setGoals] = useState<Goal[]>(mockGoals);
  const [events, setEvents] = useState<Event[]>([]);
  const [isSessionPaused, setIsSessionPaused] = useState(false);

  const startSession = (subject: string, notes?: string) => {
    const session: StudySession = {
      id: Date.now().toString(),
      userId: "1",
      subject,
      duration: 0,
      startTime: new Date(),
      endTime: new Date(),
      notes,
    };
    setCurrentSession(session);
    toast.success(`Started ${subject} session`);
  };

  const endSession = (rating?: number, notes?: string) => {
    if (currentSession) {
      const endTime = new Date();
      const duration = Math.floor(
        (endTime.getTime() - currentSession.startTime.getTime()) / 1000 / 60,
      );

      const completedSession: StudySession = {
        ...currentSession,
        duration,
        endTime,
        rating,
        notes: notes || currentSession.notes,
      };

      setSessions((prev) => [completedSession, ...prev]);
      setCurrentSession(null);
      setIsSessionPaused(false);

      toast.success(`Session completed! ${duration} minutes of focused study`);
    }
  };

  const pauseSession = () => {
    setIsSessionPaused(true);
    toast.info("Session paused");
  };

  const resumeSession = () => {
    setIsSessionPaused(false);
    toast.info("Session resumed");
  };

  const addGoal = (goal: Omit<Goal, "id" | "createdAt">) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setGoals((prev) => [newGoal, ...prev]);
    toast.success("Goal added successfully");
  };

  const updateGoal = (id: string, updates: Partial<Goal>) => {
    setGoals((prev) =>
      prev.map((goal) => (goal.id === id ? { ...goal, ...updates } : goal)),
    );
    toast.success("Goal updated");
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((goal) => goal.id !== id));
    toast.success("Goal deleted");
  };

  const joinGroup = async (groupId: string): Promise<boolean> => {
    // Mock API call
    toast.success("Joined study group successfully");
    return true;
  };

  const leaveGroup = async (groupId: string): Promise<boolean> => {
    // Mock API call
    toast.success("Left study group");
    return true;
  };

  const createGroup = async (
    group: Omit<
      StudyGroup,
      "id" | "createdAt" | "memberCount" | "sessionsCount"
    >,
  ): Promise<StudyGroup> => {
    const newGroup: StudyGroup = {
      ...group,
      id: Date.now().toString(),
      createdAt: new Date(),
      memberCount: 1,
      sessionsCount: 0,
      lastActivity: new Date(),
    };
    setGroups((prev) => [newGroup, ...prev]);
    toast.success("Study group created successfully");
    return newGroup;
  };

  const addEvent = (event: Omit<Event, "id">) => {
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
    };
    setEvents((prev) => [newEvent, ...prev]);
    toast.success("Event added to calendar");
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === id ? { ...event, ...updates } : event)),
    );
    toast.success("Event updated");
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
    toast.success("Event deleted");
  };

  return (
    <StudyContext.Provider
      value={{
        currentSession,
        sessions,
        groups,
        goals,
        events,
        startSession,
        endSession,
        pauseSession,
        resumeSession,
        addGoal,
        updateGoal,
        deleteGoal,
        joinGroup,
        leaveGroup,
        createGroup,
        addEvent,
        updateEvent,
        deleteEvent,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

// Custom Hooks - useAuth is imported from hooks/useAuth.tsx

export function useStudy() {
  const context = useContext(StudyContext);
  if (context === undefined) {
    throw new Error("useStudy must be used within a StudyProvider");
  }
  return context;
}

// Enhanced Components

// Global Search Component
function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/80 hover:text-white"
        >
          <Search size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-slate-900 border-slate-700">
        <DialogHeader>
          <DialogTitle className="text-white">Search StudyVibe</DialogTitle>
          <DialogDescription className="text-gray-400">
            Search for friends, groups, subjects, and more
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Type to search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 bg-slate-800 border-slate-600 text-white"
            />
          </div>

          {query && (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-white mb-2">
                  Study Groups
                </h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-md cursor-pointer"
                    >
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white text-sm">
                          Math Study Group {i}
                        </p>
                        <p className="text-gray-400 text-xs">24 members</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-white mb-2">People</h4>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 hover:bg-slate-800 rounded-md cursor-pointer"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                        />
                        <AvatarFallback>U{i}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-white text-sm">User {i}</p>
                        <p className="text-gray-400 text-xs">Level {i + 5}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Notification Bell Component
function NotificationBell() {
  const [notifications, setNotifications] =
    useState<Notification[]>(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-white/80 hover:text-white relative"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 hover:bg-red-500">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 bg-slate-900 border-slate-700"
      >
        <DropdownMenuLabel className="text-white flex items-center justify-between">
          Notifications
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        <ScrollArea className="h-80">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 hover:bg-slate-800 cursor-pointer border-b border-slate-700 ${
                  !notification.isRead ? "bg-blue-500/10" : ""
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${
                      notification.isRead ? "bg-gray-500" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">
                      {notification.title}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {notification.message}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                      {new Date(notification.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              <Bell size={24} className="mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// User Menu Component
function UserMenu() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Get current user status
  const currentStatus = user?.status || { emoji: "💚", text: "Available" };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="text-lg">
                  {user?.emoji || user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>

              {/* Status Badge */}
              <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                <span className="text-xs">{currentStatus.emoji}</span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64 bg-slate-900 border-slate-700"
          align="end"
          forceMount
        >
          {/* Enhanced Profile Header */}
          <DropdownMenuLabel className="font-normal p-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback className="text-xl">
                  {user?.emoji || user?.username?.[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium leading-none text-white truncate">
                  {user?.username}
                </p>
                <p className="text-xs leading-none text-gray-400 mt-1 truncate">
                  {user?.email}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm mr-1">{currentStatus.emoji}</span>
                  <p className="text-xs text-gray-300 truncate">
                    {currentStatus.text}
                  </p>
                </div>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem
            className="text-gray-300 focus:bg-slate-800 focus:text-white cursor-pointer"
            onClick={() => setShowProfileModal(true)}
          >
            <User className="mr-2 h-4 w-4" />
            <span>Edit Profile</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-gray-300 focus:bg-slate-800 focus:text-white cursor-pointer"
            onClick={() => setActiveTab("settings")}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-gray-300 focus:bg-slate-800 focus:text-white cursor-pointer"
            onClick={() => setActiveTab("achievements")}
          >
            <Trophy className="mr-2 h-4 w-4" />
            <span>Achievements</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-gray-300 focus:bg-slate-800 focus:text-white cursor-pointer"
            onClick={() => setActiveTab("analytics")}
          >
            <BarChart3 className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="bg-slate-700" />

          <DropdownMenuItem
            className="text-red-400 focus:bg-red-500/20 focus:text-red-300 cursor-pointer"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={{
          id: user?.id || "",
          username: user?.username || "",
          email: user?.email || "",
          avatar: user?.avatar,
          bio: user?.bio,
          emoji: user?.emoji || "😊",
          status: user?.status || "Available",
        }}
      />
    </>
  );
}

// Enhanced Dashboard Component
function Dashboard() {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const { user } = useAuth();
  const { currentSession, goals } = useStudy();
  const location = useLocation();

  // Mock stats for demo
  const userStats = {
    weeklyProgress: 14,
    weeklyGoal: 20,
    streak: { current: 15, longest: 23 },
    level: 8,
  };

  useEffect(() => {
    // Update active tab based on current route
    const path = location.pathname;
    if (path.includes("/messages")) setActiveTab("messages");
    else if (path.includes("/chat")) setActiveTab("chat");
    else if (path.includes("/stories")) setActiveTab("stories");
    else if (path.includes("/groups")) setActiveTab("groups");
    else if (path === "/") setActiveTab("home");
  }, [location]);

  const tabs = [
    { id: "home", label: "Home", icon: Home, path: "/" },
    {
      id: "dashboard",
      label: "Dashboard",
      icon: BarChart3,
      path: "/dashboard",
    },
    { id: "study", label: "Study", icon: BookOpen, path: "/study" },
    {
      id: "messages",
      label: "Messages",
      icon: MessageCircle,
      path: "/messages",
    },
    { id: "groups", label: "Groups", icon: Users, path: "/groups" },
    { id: "stories", label: "Stories", icon: Camera, path: "/stories" },
    { id: "calendar", label: "Calendar", icon: Calendar, path: "/calendar" },
    { id: "goals", label: "Goals", icon: Target, path: "/goals" },
    {
      id: "achievements",
      label: "Achievements",
      icon: Trophy,
      path: "/achievements",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      path: "/analytics",
    },
    { id: "library", label: "Library", icon: Library, path: "/library" },
    { id: "notes", label: "Notes", icon: NotebookPen, path: "/notes" },
    { id: "flashcards", label: "Flashcards", icon: Brain, path: "/flashcards" },
    { id: "timer", label: "Timer", icon: Timer, path: "/timer" },
    { id: "music", label: "Focus Music", icon: Music, path: "/music" },
    { id: "games", label: "Brain Games", icon: Gamepad2, path: "/games" },
    {
      id: "marketplace",
      label: "Marketplace",
      icon: Star,
      path: "/marketplace",
    },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomePage />;
      case "dashboard":
        return <DashboardPage />;
      case "study":
        return <StudyPage />;
      case "messages":
        return <DirectMessages />;
      case "groups":
        return <StudyGroups />;
      case "stories":
        return <Stories />;
      case "calendar":
        return <CalendarPage />;
      case "goals":
        return <GoalsPage />;
      case "achievements":
        return <AchievementsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "library":
        return <LibraryPage />;
      case "notes":
        return <NotesPage />;
      case "flashcards":
        return <FlashcardsPage />;
      case "timer":
        return <TimerPage />;
      case "music":
        return <MusicPage />;
      case "games":
        return <GamesPage />;
      case "marketplace":
        return <MarketplacePage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Enhanced Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 sticky top-0 z-40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="text-white/80 hover:text-white md:hidden"
              >
                <Menu size={20} />
              </Button>
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">StudyVibe</span>
            </div>

            <div className="hidden lg:flex items-center gap-1">
              {tabs.slice(0, 6).map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className="text-white/80 hover:text-white"
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Current Session Indicator */}
            {currentSession && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/20 rounded-full border border-green-500/30"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">
                  Studying {currentSession.subject}
                </span>
              </motion.div>
            )}

            <GlobalSearch />
            <NotificationBell />
            <UserMenu />
          </div>
        </div>
      </nav>

      {/* Profile Status Bar */}
      <ProfileStatusBar
        onProfileClick={() => setShowProfileModal(true)}
        onStatusClick={() => setShowStatusModal(true)}
      />

      <div className="flex">
        {/* Enhanced Sidebar */}
        <aside
          className={`${sidebarCollapsed ? "w-16" : "w-64"} bg-slate-900/50 backdrop-blur-xl border-r border-white/10 transition-all duration-300 sticky top-[145px] h-[calc(100vh-145px)] overflow-y-auto custom-scrollbar`}
        >
          <div className="p-4">
            {/* Quick Stats */}
            {!sidebarCollapsed && (
              <div className="mb-6 p-4 bg-slate-900/80 rounded-xl">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Today's Progress
                </h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/60">Study Time</span>
                      <span className="text-white">14h</span>
                    </div>
                    <Progress value={70} className="h-2" />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Streak</span>
                    <span className="text-white">🔥 15 days</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/60">Level</span>
                    <span className="text-white">8</span>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="space-y-1">
              {tabs.slice(6).map((tab) => (
                <TooltipProvider key={tab.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={activeTab === tab.id ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setActiveTab(tab.id)}
                        className={`${sidebarCollapsed ? "w-8 h-8 p-0" : "w-full justify-start"} text-white/80 hover:text-white`}
                      >
                        <tab.icon
                          className={`w-4 h-4 ${sidebarCollapsed ? "" : "mr-3"}`}
                        />
                        {!sidebarCollapsed && tab.label}
                      </Button>
                    </TooltipTrigger>
                    {sidebarCollapsed && (
                      <TooltipContent side="right">
                        <p>{tab.label}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>

            {/* Quick Actions */}
            {!sidebarCollapsed && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20">
                <h3 className="text-sm font-semibold text-white mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    size="sm"
                    className="w-full justify-start bg-blue-500 hover:bg-blue-600"
                  >
                    <Timer className="w-4 h-4 mr-2" />
                    Start Session
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Join Group
                  </Button>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Profile Modal */}
      <ProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={{
          id: user?.id || "",
          username: user?.username || "",
          email: user?.email || "",
          avatar: user?.avatar,
          bio: user?.bio,
          emoji: user?.emoji || "😊",
          status: user?.status || "Available",
        }}
      />

      {/* Status Modal */}
      <StatusModal
        isOpen={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        user={{
          username: user?.username || "",
          avatar: user?.avatar,
        }}
      />
    </div>
  );
}

// Enhanced Page Components

function HomePage() {
  const { user } = useAuth();
  const { currentSession, goals, sessions } = useStudy();

  // Mock extended user data for demo
  const extendedUser = {
    ...user,
    level: 8,
    points: 2840,
    stats: {
      weeklyProgress: 14,
      weeklyGoal: 20,
      streak: { current: 15, longest: 23 },
    },
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">
            Welcome back, {user?.username}! 👋
          </h1>
          <p className="text-gray-400 mt-1">
            Ready to continue your learning journey?
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="text-sm">
            Level {extendedUser?.level || 1}
          </Badge>
          <div className="text-right">
            <p className="text-sm text-gray-400">Points</p>
            <p className="text-lg font-bold text-white">
              {extendedUser?.points || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Current Session Alert */}
      {currentSession && (
        <Alert className="border-green-500/50 bg-green-500/10">
          <Timer className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-400">
            Study Session Active
          </AlertTitle>
          <AlertDescription className="text-gray-300">
            You're currently studying {currentSession.subject}. Keep up the
            great work!
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Today's Study Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">2.4h</div>
            <p className="text-xs text-green-400 mt-1">+30min from yesterday</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              🔥 {user?.stats?.streak?.current || 0}
            </div>
            <p className="text-xs text-gray-400 mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {goals.filter((g) => !g.isCompleted).length}
            </div>
            <p className="text-xs text-blue-400 mt-1">
              {goals.filter((g) => g.isCompleted).length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              🔥 {extendedUser?.stats?.streak?.current || 0}
            </div>
            <p className="text-xs text-gray-400 mt-1">days in a row</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {goals.filter((g) => !g.isCompleted).length}
            </div>
            <p className="text-xs text-blue-400 mt-1">
              {goals.filter((g) => g.isCompleted).length} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">
              This Week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">
              {extendedUser?.stats?.weeklyProgress || 0}h
            </div>
            <Progress
              value={
                ((extendedUser?.stats?.weeklyProgress || 0) /
                  (extendedUser?.stats?.weeklyGoal || 20)) *
                100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Goals */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target size={20} />
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-white">
                    {goal.title}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {Math.round((goal.currentHours / goal.targetHours) * 100)}%
                  </Badge>
                </div>
                <Progress
                  value={(goal.currentHours / goal.targetHours) * 100}
                  className="h-2"
                />
                <p className="text-xs text-gray-400">
                  {goal.currentHours}h / {goal.targetHours}h • Due{" "}
                  {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full">
              <Plus size={16} className="mr-2" />
              Add New Goal
            </Button>
          </CardContent>
        </Card>

        {/* Recent Sessions */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock size={20} />
              Recent Sessions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sessions.slice(0, 4).map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white">
                    {session.subject}
                  </p>
                  <p className="text-xs text-gray-400">
                    {session.duration} minutes
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">
                    {new Date(session.startTime).toLocaleDateString()}
                  </p>
                  {session.rating && (
                    <div className="flex text-yellow-400">
                      {"★".repeat(session.rating)}
                    </div>
                  )}
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full">
              <Timer size={16} className="mr-2" />
              Start Study Session
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Achievements */}
      {user?.achievements && user.achievements.length > 0 && (
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy size={20} />
              Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mockAchievements.slice(0, 3).map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg"
                >
                  <div className="text-2xl">{achievement.icon}</div>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {achievement.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {achievement.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function DashboardPage() {
  const { user } = useAuth();
  const { sessions, goals } = useStudy();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="mr-2" />
            Export Data
          </Button>
          <Button size="sm">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Study Time Chart */}
        <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Study Time Trends</CardTitle>
            <CardDescription className="text-gray-400">
              Your study patterns over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Mock Chart */}
            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <BarChart3 size={48} className="mx-auto mb-2" />
                <p>Study time visualization would go here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject Breakdown */}
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Subject Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user?.subjects?.map((subject, index) => (
              <div key={subject}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-white">{subject}</span>
                  <span className="text-gray-400">{25 + index * 5}%</span>
                </div>
                <Progress value={25 + index * 5} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Total Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {user?.stats?.totalSessions || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Avg Session</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {user?.stats?.averageSessionLength || 0}m
            </div>
            <p className="text-sm text-gray-400 mt-1">Per session</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Longest Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {user?.stats?.streak?.longest || 0}
            </div>
            <p className="text-sm text-gray-400 mt-1">Days</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">
              Goals Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">
              {goals.filter((g) => g.isCompleted).length}
            </div>
            <p className="text-sm text-gray-400 mt-1">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StudyPage() {
  const {
    currentSession,
    startSession,
    endSession,
    pauseSession,
    resumeSession,
  } = useStudy();
  const [selectedSubject, setSelectedSubject] = useState("");
  const [sessionNotes, setSessionNotes] = useState("");
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const subjects = [
    "Mathematics",
    "Computer Science",
    "Physics",
    "Chemistry",
    "English",
    "History",
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentSession && !isPaused) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentSession, isPaused]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartSession = () => {
    if (selectedSubject) {
      startSession(selectedSubject, sessionNotes);
      setSessionTimer(0);
    }
  };

  const handleEndSession = () => {
    endSession(undefined, sessionNotes);
    setSessionTimer(0);
    setSessionNotes("");
  };

  const handlePauseResume = () => {
    if (isPaused) {
      resumeSession();
      setIsPaused(false);
    } else {
      pauseSession();
      setIsPaused(true);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Study Session</h1>
        <p className="text-gray-400">Focus on your learning goals</p>
      </div>

      {currentSession ? (
        /* Active Session UI */
        <Card className="bg-slate-900/80 border-slate-700 max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-white text-2xl">
              {currentSession.subject}
            </CardTitle>
            <CardDescription className="text-gray-400">
              Session started at{" "}
              {new Date(currentSession.startTime).toLocaleTimeString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Timer Display */}
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-white mb-4">
                {formatTime(sessionTimer)}
              </div>
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePauseResume}
                  className="w-32"
                >
                  {isPaused ? (
                    <>
                      <Play size={20} className="mr-2" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause size={20} className="mr-2" />
                      Pause
                    </>
                  )}
                </Button>
                <Button
                  variant="destructive"
                  size="lg"
                  onClick={handleEndSession}
                  className="w-32"
                >
                  <StopCircle size={20} className="mr-2" />
                  End Session
                </Button>
              </div>
            </div>

            {/* Session Notes */}
            <div>
              <Label htmlFor="notes" className="text-white">
                Session Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Add notes about your study session..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="mt-2 bg-slate-800 border-slate-600 text-white"
                rows={3}
              />
            </div>

            {/* Focus Tools */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <Music size={16} className="mr-2" />
                Focus Music
              </Button>
              <Button
                variant="outline"
                className="flex items-center justify-center"
              >
                <Coffee size={16} className="mr-2" />
                Break Reminder
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Start Session UI */
        <Card className="bg-slate-900/80 border-slate-700 max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-white">Start a Study Session</CardTitle>
            <CardDescription className="text-gray-400">
              Choose your subject and begin focused learning
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="subject" className="text-white">
                Subject
              </Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger className="mt-2 bg-slate-800 border-slate-600 text-white">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {subjects.map((subject) => (
                    <SelectItem
                      key={subject}
                      value={subject}
                      className="text-white"
                    >
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="pre-notes" className="text-white">
                Session Goals (Optional)
              </Label>
              <Textarea
                id="pre-notes"
                placeholder="What do you want to accomplish in this session?"
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="mt-2 bg-slate-800 border-slate-600 text-white"
                rows={3}
              />
            </div>

            <Button
              onClick={handleStartSession}
              disabled={!selectedSubject}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
              size="lg"
            >
              <PlayCircle size={20} className="mr-2" />
              Start Study Session
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
        <Card className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Timer size={32} className="mx-auto mb-3 text-blue-400" />
            <h3 className="text-white font-medium">Pomodoro Timer</h3>
            <p className="text-gray-400 text-sm">25-minute focused sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <Brain size={32} className="mx-auto mb-3 text-purple-400" />
            <h3 className="text-white font-medium">Flashcards</h3>
            <p className="text-gray-400 text-sm">Quick review sessions</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer">
          <CardContent className="p-6 text-center">
            <NotebookPen size={32} className="mx-auto mb-3 text-green-400" />
            <h3 className="text-white font-medium">Digital Notes</h3>
            <p className="text-gray-400 text-sm">Organize your thoughts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { events, addEvent } = useStudy();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Calendar</h1>
        <Button>
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border border-slate-600"
            />
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Events for {selectedDate.toDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="p-3 bg-slate-800/50 rounded-lg">
                  <h4 className="text-white font-medium">{event.title}</h4>
                  <p className="text-gray-400 text-sm">{event.description}</p>
                  <p className="text-blue-400 text-xs mt-1">
                    {new Date(event.startTime).toLocaleTimeString()} -{" "}
                    {new Date(event.endTime).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-8">
                No events scheduled
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function GoalsPage() {
  const { goals, addGoal, updateGoal, deleteGoal } = useStudy();
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Goals</h1>
        <Button onClick={() => setIsAddingGoal(true)}>
          <Plus size={16} className="mr-2" />
          Add Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => (
          <Card key={goal.id} className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-lg">{goal.title}</CardTitle>
              <CardDescription className="text-gray-400">
                {goal.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-400">Progress</span>
                  <span className="text-white">
                    {goal.currentHours}h / {goal.targetHours}h
                  </span>
                </div>
                <Progress
                  value={(goal.currentHours / goal.targetHours) * 100}
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Due Date</span>
                <span className="text-white">
                  {new Date(goal.deadline).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Category</span>
                <Badge variant="outline">{goal.category}</Badge>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Edit3 size={14} className="mr-2" />
                  Edit
                </Button>
                <Button size="sm" variant="destructive">
                  <Trash2 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AchievementsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Achievements</h1>
        <p className="text-gray-400">Celebrate your learning milestones</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockAchievements.map((achievement) => (
          <Card
            key={achievement.id}
            className="bg-slate-900/80 border-slate-700"
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h3 className="text-white font-bold text-lg mb-2">
                {achievement.title}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                {achievement.description}
              </p>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
              </Badge>
            </CardContent>
          </Card>
        ))}

        {/* Locked Achievements */}
        {[1, 2, 3].map((i) => (
          <Card
            key={`locked-${i}`}
            className="bg-slate-900/50 border-slate-700 opacity-60"
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 grayscale">🔒</div>
              <h3 className="text-gray-500 font-bold text-lg mb-2">
                Mystery Achievement
              </h3>
              <p className="text-gray-500 text-sm mb-4">
                Keep studying to unlock this achievement
              </p>
              <Badge
                variant="outline"
                className="border-gray-600 text-gray-500"
              >
                Locked
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Analytics</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Study Time Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <TrendingUp size={48} className="mx-auto mb-2" />
                <p>Advanced analytics visualization</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <PieChart size={48} className="mx-auto mb-2" />
                <p>Performance metrics</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function LibraryPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Library</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button size="sm">
            <Upload size={16} className="mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <FileText size={20} className="text-blue-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        Study Notes Chapter {i}.pdf
                      </p>
                      <p className="text-gray-400 text-xs">2.4 MB</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-xs">2 days ago</span>
                    <Button size="sm" variant="ghost">
                      <MoreHorizontal size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="text-center py-12 text-gray-400">
            <NotebookPen size={48} className="mx-auto mb-4" />
            <p>Your digital notes will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="media">
          <div className="text-center py-12 text-gray-400">
            <Image size={48} className="mx-auto mb-4" />
            <p>Your media files will appear here</p>
          </div>
        </TabsContent>

        <TabsContent value="favorites">
          <div className="text-center py-12 text-gray-400">
            <Star size={48} className="mx-auto mb-4" />
            <p>Your favorite items will appear here</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Notes</h1>
        <Button>
          <Plus size={16} className="mr-2" />
          New Note
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="bg-slate-900/80 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-lg">Folders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Mathematics", "Computer Science", "Physics", "General"].map(
              (folder) => (
                <Button
                  key={folder}
                  variant="ghost"
                  className="w-full justify-start text-gray-300"
                >
                  <Folder size={16} className="mr-2" />
                  {folder}
                </Button>
              ),
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    Study Notes {i}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Last edited 2 hours ago
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm line-clamp-3">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua...
                  </p>
                  <div className="flex justify-between items-center mt-4">
                    <Badge variant="outline">Mathematics</Badge>
                    <Button size="sm" variant="ghost">
                      <Edit3 size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FlashcardsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Flashcards</h1>
        <Button>
          <Plus size={16} className="mr-2" />
          Create Deck
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card
            key={i}
            className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <CardHeader>
              <CardTitle className="text-white">Math Formulas {i}</CardTitle>
              <CardDescription className="text-gray-400">
                25 cards • Last studied 2 days ago
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white">60%</span>
              </div>
              <Progress value={60} />

              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <PlayCircle size={14} className="mr-2" />
                  Study
                </Button>
                <Button size="sm" variant="outline">
                  <Edit3 size={14} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function TimerPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Focus Timer</h1>
        <p className="text-gray-400">
          Use the Pomodoro technique to boost productivity
        </p>
      </div>

      <Card className="bg-slate-900/80 border-slate-700 max-w-md mx-auto">
        <CardContent className="p-8 text-center space-y-6">
          <div className="text-6xl font-mono font-bold text-white">25:00</div>

          <div className="space-y-4">
            <div className="flex justify-center gap-4">
              <Button size="lg" className="w-24">
                <Play size={20} className="mr-2" />
                Start
              </Button>
              <Button size="lg" variant="outline" className="w-24">
                <RefreshCw size={20} className="mr-2" />
                Reset
              </Button>
            </div>

            <div className="flex justify-center gap-2">
              <Button size="sm" variant="ghost">
                25 min
              </Button>
              <Button size="sm" variant="ghost">
                5 min
              </Button>
              <Button size="sm" variant="ghost">
                15 min
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MusicPage() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Focus Music</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Nature Sounds",
            description: "Rain, ocean waves, forest ambience",
          },
          {
            name: "Lo-Fi Hip Hop",
            description: "Chill beats for concentration",
          },
          {
            name: "Classical Focus",
            description: "Bach, Mozart, and Beethoven",
          },
          { name: "White Noise", description: "Pure focus sounds" },
          { name: "Binaural Beats", description: "Brainwave entrainment" },
          { name: "Cafe Ambience", description: "Coffee shop atmosphere" },
        ].map((playlist, i) => (
          <Card
            key={i}
            className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Music size={24} className="text-white" />
              </div>
              <h3 className="text-white font-medium mb-2">{playlist.name}</h3>
              <p className="text-gray-400 text-sm mb-4">
                {playlist.description}
              </p>
              <Button size="sm" className="w-full">
                <Play size={14} className="mr-2" />
                Play
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function GamesPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Brain Games</h1>
        <p className="text-gray-400">Train your mind with educational games</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            name: "Memory Challenge",
            icon: "🧠",
            description: "Test your memory skills",
          },
          {
            name: "Math Sprint",
            icon: "🔢",
            description: "Quick math calculations",
          },
          {
            name: "Word Builder",
            icon: "📝",
            description: "Vocabulary building game",
          },
          {
            name: "Pattern Recognition",
            icon: "🔍",
            description: "Improve pattern detection",
          },
          {
            name: "Logic Puzzles",
            icon: "🧩",
            description: "Solve complex problems",
          },
          {
            name: "Speed Reading",
            icon: "⚡",
            description: "Increase reading speed",
          },
        ].map((game, i) => (
          <Card
            key={i}
            className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer"
          >
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">{game.icon}</div>
              <h3 className="text-white font-medium mb-2">{game.name}</h3>
              <p className="text-gray-400 text-sm mb-4">{game.description}</p>
              <Button size="sm" className="w-full">
                <PlayCircle size={14} className="mr-2" />
                Play Game
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MarketplacePage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Marketplace</h1>
        <Button>
          <Star size={16} className="mr-2" />
          Sell Item
        </Button>
      </div>

      <Tabs defaultValue="courses" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="notes">Study Notes</TabsTrigger>
          <TabsTrigger value="tools">Study Tools</TabsTrigger>
          <TabsTrigger value="tutoring">Tutoring</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card
                key={i}
                className="bg-slate-900/80 border-slate-700 hover:bg-slate-800/80 transition-colors cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg mb-4"></div>
                  <h3 className="text-white font-medium mb-2">
                    Advanced Mathematics Course {i}
                  </h3>
                  <p className="text-gray-400 text-sm mb-4">
                    Complete calculus and linear algebra
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-white font-bold">$29.99</span>
                    <Button size="sm">
                      <Star size={14} className="mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <div className="text-center py-12 text-gray-400">
            <FileText size={48} className="mx-auto mb-4" />
            <p>Study notes marketplace coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="tools">
          <div className="text-center py-12 text-gray-400">
            <Settings size={48} className="mx-auto mb-4" />
            <p>Study tools marketplace coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="tutoring">
          <div className="text-center py-12 text-gray-400">
            <Users size={48} className="mx-auto mb-4" />
            <p>Find tutors and offer tutoring services</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsPage() {
  const { user } = useAuth();

  // Mock preferences for demo since the basic user doesn't have them
  const [preferences, setPreferences] = useState({
    theme: "dark",
    language: "en",
    notifications: {
      email: true,
      push: true,
      studyReminders: true,
      socialActivity: true,
      achievements: true,
    },
    privacy: {
      profileVisibility: "friends",
      showOnlineStatus: true,
      allowFriendRequests: true,
    },
  });

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-white">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-slate-800">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="subscription">Subscription</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>
                    {user?.username?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline">Change Photo</Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username" className="text-white">
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={user?.username}
                    className="mt-2 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={user?.email}
                    className="mt-2 bg-slate-800 border-slate-600 text-white"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio" className="text-white">
                  Bio
                </Label>
                <Textarea
                  id="bio"
                  value={user?.bio}
                  className="mt-2 bg-slate-800 border-slate-600 text-white"
                  rows={3}
                />
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Dark Mode</h4>
                  <p className="text-gray-400 text-sm">
                    Use dark theme across the app
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Focus Mode</h4>
                  <p className="text-gray-400 text-sm">
                    Hide distracting elements during study
                  </p>
                </div>
                <Switch />
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">Language</h4>
                <Select defaultValue="en">
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <h4 className="text-white font-medium mb-3">
                  Default Session Length
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">25 minutes</span>
                    <span className="text-white">50 minutes</span>
                  </div>
                  <Slider defaultValue={[25]} max={50} min={15} step={5} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">
                    Email Notifications
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Receive updates via email
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Push Notifications</h4>
                  <p className="text-gray-400 text-sm">
                    Get notifications on your device
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Study Reminders</h4>
                  <p className="text-gray-400 text-sm">Remind me to study</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">
                    Achievement Notifications
                  </h4>
                  <p className="text-gray-400 text-sm">Celebrate your wins</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-white font-medium mb-3">
                  Profile Visibility
                </h4>
                <RadioGroup defaultValue="friends">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="public" id="public" />
                    <Label htmlFor="public" className="text-white">
                      Public
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="friends" id="friends" />
                    <Label htmlFor="friends" className="text-white">
                      Friends Only
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="private" id="private" />
                    <Label htmlFor="private" className="text-white">
                      Private
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">Show Online Status</h4>
                  <p className="text-gray-400 text-sm">
                    Let others see when you're online
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">
                    Allow Friend Requests
                  </h4>
                  <p className="text-gray-400 text-sm">
                    Others can send you friend requests
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscription" className="space-y-6">
          <Card className="bg-slate-900/80 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Subscription</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {false ? ( // Mock premium status for demo
                <div className="text-center p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-lg border border-yellow-500/30">
                  <Trophy size={48} className="mx-auto mb-4 text-yellow-500" />
                  <h3 className="text-xl font-bold text-white mb-2">
                    Premium Member
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Your subscription is active until{" "}
                    {user.subscription?.validUntil?.toLocaleDateString()}
                  </p>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>✅ Unlimited study groups</p>
                    <p>✅ Advanced analytics</p>
                    <p>✅ Priority support</p>
                    <p>✅ Export data</p>
                  </div>
                  <Button variant="outline" className="mt-4">
                    Manage Subscription
                  </Button>
                </div>
              ) : (
                <div className="text-center p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    Upgrade to Premium
                  </h3>
                  <p className="text-gray-400 mb-6">
                    Unlock advanced features and enhance your learning
                    experience
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card className="bg-slate-800 border-slate-600">
                      <CardContent className="p-4 text-center">
                        <h4 className="text-white font-bold">Premium</h4>
                        <p className="text-2xl font-bold text-white mt-2">
                          $9.99/mo
                        </p>
                        <ul className="text-sm text-gray-300 mt-4 space-y-1">
                          <li>✅ Unlimited groups</li>
                          <li>✅ Advanced analytics</li>
                          <li>✅ Priority support</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card className="bg-slate-800 border-slate-600">
                      <CardContent className="p-4 text-center">
                        <h4 className="text-white font-bold">Pro</h4>
                        <p className="text-2xl font-bold text-white mt-2">
                          $19.99/mo
                        </p>
                        <ul className="text-sm text-gray-300 mt-4 space-y-1">
                          <li>✅ Everything in Premium</li>
                          <li>✅ AI study assistant</li>
                          <li>✅ Custom themes</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500">
                    Upgrade Now
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Enhanced Login Page
function LoginPage() {
  return <Login />;
}

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <AuthProvider>
          <ChatProvider>
            <StudyProvider>
              <Routes>
                <Route
                  path="/login"
                  element={
                    <AuthGate>
                      <LoginPage />
                    </AuthGate>
                  }
                />
                <Route
                  path="/chat/:friendId"
                  element={
                    <ProtectedRoute>
                      <Chat />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </StudyProvider>
          </ChatProvider>
        </AuthProvider>
      </TooltipProvider>
    </BrowserRouter>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default App;
