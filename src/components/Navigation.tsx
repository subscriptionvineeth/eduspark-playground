import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Book, Pencil, Calculator, Atom, BookOpen, Home } from "lucide-react";
import { cn } from "@/lib/utils";
import UserProfile from "./UserProfile";

const navigationItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/reading", icon: Book, label: "Reading" },
  { path: "/drawing", icon: Pencil, label: "Drawing" },
  { path: "/math", icon: Calculator, label: "Math" },
  { path: "/science", icon: Atom, label: "Science" },
  { path: "/stories", icon: BookOpen, label: "Stories" },
];

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-lg z-10 px-4 py-2"
    >
      <div className="flex items-center">
        <div className="flex-none">
          <UserProfile />
        </div>
        <div className="flex-1 flex justify-around items-center">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <motion.button
                key={item.path}
                whileTap={{ scale: 0.9 }}
                className={cn(
                  "flex flex-col items-center p-2 rounded-xl transition-colors",
                  isActive ? "text-primary" : "text-gray-400 hover:text-primary"
                )}
                onClick={() => navigate(item.path)}
              >
                <Icon className="h-6 w-6 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default Navigation; 