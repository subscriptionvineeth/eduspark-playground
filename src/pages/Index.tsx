
import { motion } from "framer-motion";
import SubjectCard from "@/components/SubjectCard";
import { Book, Pencil, Calculator, Atom, Music } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      title: "Reading & Phonics",
      description: "Practice reading and learn new words",
      icon: <Book className="animate-float" />,
      path: "/reading",
    },
    {
      title: "Drawing & Art",
      description: "Express yourself through art",
      icon: <Pencil className="animate-float" />,
      path: "/drawing",
    },
    {
      title: "Math Games",
      description: "Fun with numbers and shapes",
      icon: <Calculator className="animate-float" />,
      path: "/math",
    },
    {
      title: "Science Fun",
      description: "Discover the world around you",
      icon: <Atom className="animate-float" />,
      path: "/science",
    },
    {
      title: "Music & Rhythm",
      description: "Learn through songs and beats",
      icon: <Music className="animate-float" />,
      path: "/music",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary to-white px-4 py-8 md:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4"
          >
            Welcome to EduPlay Kids
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600"
          >
            Let's learn and have fun together!
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4"
        >
          {subjects.map((subject, index) => (
            <motion.div
              key={subject.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1) }}
            >
              <SubjectCard
                title={subject.title}
                description={subject.description}
                icon={subject.icon}
                onClick={() => navigate(subject.path)}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
