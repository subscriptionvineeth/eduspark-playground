import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTrigger, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Award, User } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { Progress } from "@/components/ui/progress";

const avatars = [
  "/avatars/avatar1.png", 
  "/avatars/avatar2.png",
  "/avatars/avatar3.png",
  "/avatars/avatar4.png",
  "/avatars/avatar5.png",
  "/avatars/avatar6.png"
];

const UserProfile = () => {
  const { username, setUsername, avatar, setAvatar, progress, totalPoints } = useUser();
  const [editName, setEditName] = useState(username);
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    setUsername(editName);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="rounded-full p-0 w-12 h-12">
          <Avatar className="h-12 w-12 border-2 border-primary">
            <AvatarImage src={avatars[avatar - 1]} alt={username} />
            <AvatarFallback>{username.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={avatars[avatar - 1]} alt={username} />
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              {avatars.map((_, index) => (
                <button
                  key={index}
                  className={`h-10 w-10 rounded-full border-2 overflow-hidden ${avatar === index + 1 ? 'border-primary' : 'border-gray-200'}`}
                  onClick={() => setAvatar(index + 1)}
                >
                  <img 
                    src={avatars[index]} 
                    alt={`Avatar ${index + 1}`} 
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Your Name</label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Enter your name"
              />
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Total Points: {totalPoints}</span>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Your Progress</h3>
              <div className="space-y-3">
                {Object.entries(progress).map(([subject, data]) => (
                  <div key={subject} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{subject}</span>
                      <span>{data.completed} activities</span>
                    </div>
                    <Progress value={data.completed > 0 ? 100 * Math.min(data.completed / 10, 1) : 0} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfile; 