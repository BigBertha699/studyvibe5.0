import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export interface Friend {
  id: string;
  username: string;
  avatar: string;
  bio?: string;
  lastSeen?: string;
  isOnline?: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  type: "text" | "image" | "video";
  timestamp: Date;
  isRead: boolean;
}

export interface Chat {
  friendId: string;
  messages: Message[];
  lastMessage?: Message;
}

export interface StudyGroup {
  id: string;
  name: string;
  picture?: string;
  adminId: string;
  members: string[];
  createdAt: Date;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  mediaUrl: string;
  timestamp: Date;
  isViewed: boolean;
}

interface ChatContextType {
  friends: Friend[];
  chats: Chat[];
  studyGroups: StudyGroup[];
  stories: Story[];
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  sendMessage: (
    friendId: string,
    content: string,
    type: "text" | "image" | "video",
  ) => void;
  markMessagesAsRead: (friendId: string) => void;
  createStudyGroup: (
    name: string,
    memberIds: string[],
    currentUserId: string,
  ) => void;
  addStory: (
    mediaUrl: string,
    userId: string,
    username: string,
    avatar: string,
  ) => void;
  getChatWithFriend: (friendId: string) => Chat | undefined;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Mock data
const mockFriends: Friend[] = [
  {
    id: "2",
    username: "alice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    bio: "Student at MIT",
    isOnline: true,
  },
  {
    id: "3",
    username: "bob",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    bio: "CS Major",
    isOnline: false,
    lastSeen: "2 hours ago",
  },
  {
    id: "4",
    username: "carol",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
    bio: "Math enthusiast",
    isOnline: true,
  },
];

const mockStories: Story[] = [
  {
    id: "1",
    userId: "2",
    username: "alice",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
    mediaUrl:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isViewed: false,
  },
  {
    id: "2",
    userId: "3",
    username: "bob",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
    mediaUrl:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isViewed: false,
  },
];

export function ChatProvider({ children }: { children: ReactNode }) {
  const [friends, setFriends] = useState<Friend[]>(mockFriends);
  const [chats, setChats] = useState<Chat[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [stories, setStories] = useState<Story[]>(mockStories);

  const addFriend = useCallback((friend: Friend) => {
    setFriends((prev) => [...prev, friend]);
  }, []);

  const removeFriend = useCallback((friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
    setChats((prev) => prev.filter((c) => c.friendId !== friendId));
  }, []);

  const sendMessage = useCallback(
    (
      friendId: string,
      content: string,
      type: "text" | "image" | "video" = "text",
    ) => {
      const message: Message = {
        id: Date.now().toString(),
        senderId: "1", // Current user ID
        receiverId: friendId,
        content,
        type,
        timestamp: new Date(),
        isRead: false,
      };

      setChats((prev) => {
        const existingChat = prev.find((c) => c.friendId === friendId);
        if (existingChat) {
          return prev.map((c) =>
            c.friendId === friendId
              ? {
                  ...c,
                  messages: [...c.messages, message],
                  lastMessage: message,
                }
              : c,
          );
        } else {
          return [
            ...prev,
            { friendId, messages: [message], lastMessage: message },
          ];
        }
      });
    },
    [],
  );

  const markMessagesAsRead = useCallback((friendId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        c.friendId === friendId
          ? {
              ...c,
              messages: c.messages.map((m) => ({ ...m, isRead: true })),
            }
          : c,
      ),
    );
  }, []);

  const createStudyGroup = useCallback(
    (name: string, memberIds: string[], currentUserId: string) => {
      const newGroup: StudyGroup = {
        id: Date.now().toString(),
        name,
        adminId: currentUserId,
        members: [currentUserId, ...memberIds],
        createdAt: new Date(),
      };
      setStudyGroups((prev) => [...prev, newGroup]);
    },
    [],
  );

  const addStory = useCallback(
    (mediaUrl: string, userId: string, username: string, avatar: string) => {
      const newStory: Story = {
        id: Date.now().toString(),
        userId,
        username,
        avatar,
        mediaUrl,
        timestamp: new Date(),
        isViewed: false,
      };
      setStories((prev) => [newStory, ...prev]);
    },
    [],
  );

  const getChatWithFriend = useCallback(
    (friendId: string) => {
      return chats.find((c) => c.friendId === friendId);
    },
    [chats],
  );

  return (
    <ChatContext.Provider
      value={{
        friends,
        chats,
        studyGroups,
        stories,
        addFriend,
        removeFriend,
        sendMessage,
        markMessagesAsRead,
        createStudyGroup,
        addStory,
        getChatWithFriend,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
