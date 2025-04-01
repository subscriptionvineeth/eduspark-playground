import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface ActivityProgress {
  completed: number;
  totalPoints: number;
  lastActivity: string;
}

interface UserContextType {
  username: string;
  setUsername: (name: string) => void;
  avatar: number;
  setAvatar: (avatar: number) => void;
  progress: Record<string, ActivityProgress>;
  updateProgress: (activity: string, points: number) => void;
  totalPoints: number;
}

const initialProgress = {
  reading: { completed: 0, totalPoints: 0, lastActivity: "" },
  drawing: { completed: 0, totalPoints: 0, lastActivity: "" },
  math: { completed: 0, totalPoints: 0, lastActivity: "" },
  science: { completed: 0, totalPoints: 0, lastActivity: "" },
  stories: { completed: 0, totalPoints: 0, lastActivity: "" },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState(() => {
    const saved = localStorage.getItem("username");
    return saved || "Explorer";
  });
  
  const [avatar, setAvatar] = useState(() => {
    const saved = localStorage.getItem("avatar");
    return saved ? parseInt(saved) : 1;
  });
  
  const [progress, setProgress] = useState<Record<string, ActivityProgress>>(() => {
    const saved = localStorage.getItem("progress");
    return saved ? JSON.parse(saved) : initialProgress;
  });

  const updateProgress = (activity: string, points: number) => {
    setProgress(prev => {
      const now = new Date().toISOString();
      const updated = {
        ...prev,
        [activity]: {
          completed: (prev[activity]?.completed || 0) + 1,
          totalPoints: (prev[activity]?.totalPoints || 0) + points,
          lastActivity: now
        }
      };
      return updated;
    });
  };

  const totalPoints = Object.values(progress).reduce(
    (sum, activity) => sum + activity.totalPoints, 0
  );

  useEffect(() => {
    localStorage.setItem("username", username);
    localStorage.setItem("avatar", avatar.toString());
    localStorage.setItem("progress", JSON.stringify(progress));
  }, [username, avatar, progress]);

  return (
    <UserContext.Provider value={{
      username,
      setUsername,
      avatar,
      setAvatar,
      progress,
      updateProgress,
      totalPoints
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}; 