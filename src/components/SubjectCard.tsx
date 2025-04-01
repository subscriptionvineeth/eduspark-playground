import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

interface SubjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress?: number;
  onClick: () => void;
  color?: string;
}

const SubjectCard = ({ 
  title, 
  description, 
  icon, 
  progress = 0, 
  onClick,
  color = "from-blue-50 to-blue-100 border-blue-200"
}: SubjectCardProps) => {
  // Extract the first word of the title to use as a badge/label
  const firstWord = title.split(' ')[0];
  
  return (
    <motion.div
      whileHover={{ 
        scale: 1.03,
        y: -5,
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br ${color} rounded-xl p-6 shadow-md cursor-pointer transition-all duration-300 border border-opacity-40 h-full flex flex-col`}
      onClick={onClick}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="p-3 bg-white rounded-full shadow-sm">
            <div className="text-3xl">{icon}</div>
          </div>
          
          {progress > 0 && (
            <div className="text-xs font-medium bg-white bg-opacity-70 px-2 py-1 rounded-full shadow-sm">
              {Math.min(progress, 10)}/10
            </div>
          )}
        </div>
        
        <div className="flex-grow">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
        </div>
        
        {progress > 0 && (
          <div className="w-full space-y-1 mt-auto">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Progress</span>
            </div>
            <Progress 
              value={progress > 0 ? 100 * Math.min(progress / 10, 1) : 0} 
              className="h-2" 
            />
          </div>
        )}
        
        {progress === 0 && (
          <motion.div 
            className="mt-auto"
            initial={{ opacity: 0.5 }}
            whileHover={{ opacity: 1 }}
          >
            <div className="text-xs font-medium text-primary-foreground bg-primary bg-opacity-80 rounded-full py-1 px-3 inline-block">
              Start Learning
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SubjectCard;
