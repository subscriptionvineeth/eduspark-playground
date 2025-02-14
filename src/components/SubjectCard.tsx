
import { motion } from "framer-motion";

interface SubjectCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const SubjectCard = ({ title, description, icon, onClick }: SubjectCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className="text-4xl text-primary-accent">{icon}</div>
        <h3 className="text-xl font-semibold text-primary-foreground">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </motion.div>
  );
};

export default SubjectCard;
