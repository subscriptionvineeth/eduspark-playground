import { motion } from "framer-motion";
import SubjectCard from "@/components/SubjectCard";
import { Book, Pencil, Calculator, Atom, BookOpen, Award, Brain, MusicIcon, Sparkles, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const Index = () => {
  const navigate = useNavigate();
  const { username, totalPoints, progress } = useUser();
  const [mounted, setMounted] = useState(false);

  // Set mounted state to enable animations after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const subjects = [
    {
      title: "Reading & Phonics",
      description: "Practice reading and learn new words",
      icon: <Book className="text-blue-600" />,
      color: "from-blue-100 to-blue-200 border-blue-300",
      gradientColor: "from-blue-500 to-blue-700",
      path: "/reading",
      progress: progress.reading?.completed || 0,
    },
    {
      title: "Drawing & Art",
      description: "Express yourself through art",
      icon: <Pencil className="text-purple-600" />,
      color: "from-purple-100 to-purple-200 border-purple-300",
      gradientColor: "from-purple-500 to-purple-700",
      path: "/drawing",
      progress: progress.drawing?.completed || 0,
    },
    {
      title: "Math Games",
      description: "Fun with numbers and shapes",
      icon: <Calculator className="text-green-600" />,
      color: "from-green-100 to-green-200 border-green-300",
      gradientColor: "from-green-500 to-green-700",
      path: "/math",
      progress: progress.math?.completed || 0,
    },
    {
      title: "Science Fun",
      description: "Discover the world around you",
      icon: <Atom className="text-pink-600" />,
      color: "from-pink-100 to-pink-200 border-pink-300",
      gradientColor: "from-pink-500 to-pink-700",
      path: "/science",
      progress: progress.science?.completed || 0,
    },
    {
      title: "Moral Stories",
      description: "Learn wisdom from classic Indian tales",
      icon: <BookOpen className="text-amber-600" />,
      color: "from-amber-100 to-amber-200 border-amber-300",
      gradientColor: "from-amber-500 to-amber-700",
      path: "/stories",
      progress: progress.stories?.completed || 0,
    },
    {
      title: "Puzzles & Brain Teasers",
      description: "Challenge your mind with fun puzzles",
      icon: <Brain className="text-indigo-600" />,
      color: "from-indigo-100 to-indigo-200 border-indigo-300",
      gradientColor: "from-indigo-500 to-indigo-700",
      path: "/puzzles",
      progress: progress.puzzles?.completed || 0,
    },
    {
      title: "Music & Sounds",
      description: "Explore rhythms and melodies",
      icon: <MusicIcon className="text-red-600" />,
      color: "from-red-100 to-red-200 border-red-300",
      gradientColor: "from-red-500 to-red-700",
      path: "/music",
      progress: progress.music?.completed || 0,
    },
  ];

  // Calculate learning stats
  const completedSubjects = Object.values(progress).filter(p => p?.completed >= 10).length;
  const totalActivities = Object.values(progress).reduce((sum, p) => sum + (p?.completed || 0), 0);
  const subjectsStarted = Object.values(progress).filter(p => p?.completed > 0).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-4 py-8 md:py-12 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5 blur-3xl"
            initial={{ 
              width: `${Math.random() * 30 + 20}rem`, 
              height: `${Math.random() * 30 + 20}rem`,
              x: `${Math.random() * 100}%`, 
              y: `${Math.random() * 100}%`,
              opacity: 0.05 + Math.random() * 0.15
            }}
            animate={{
              x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
              y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            }}
            transition={{
              duration: 30 + Math.random() * 30,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
        ))}
        
        {/* Decorative elements */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute h-1 w-1 bg-yellow-200 rounded-full shadow-glow"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              scale: Math.random() > 0.5 ? 1 : 1.5,
              opacity: 0.4 + Math.random() * 0.6
            }}
            animate={{
              opacity: [0.4 + Math.random() * 0.6, 0.1, 0.4 + Math.random() * 0.6],
              scale: [1, Math.random() > 0.5 ? 1.5 : 0.8, 1]
            }}
            transition={{
              duration: 1 + Math.random() * 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: mounted ? 1 : 0 }}
        className="max-w-7xl mx-auto relative z-10 pb-20"
      >
        <div className="text-center mb-16 relative">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-block relative"
          >
            <motion.div 
              className="absolute -right-16 -top-12 text-yellow-300 hidden md:block"
              animate={{ 
                rotate: [0, 10, -10, 10, 0],
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Sparkles size={48} />
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 drop-shadow-md">
              EduPlay <span className="text-yellow-300">Kids</span>
            </h1>
          </motion.div>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto"
          >
            A fun and interactive learning platform designed to help children explore, 
            create, and grow through educational games and activities.
          </motion.p>
        </div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          <Card className="p-8 bg-white/95 border-0 shadow-xl rounded-2xl backdrop-blur-sm hover:shadow-yellow-200/20 hover:shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-yellow-100 rounded-full mb-3 shadow-inner">
                <Award className="h-10 w-10 text-yellow-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800">{totalPoints}</h3>
              <p className="text-sm font-medium text-gray-600">Total Points Earned</p>
            </div>
          </Card>
          
          <Card className="p-8 bg-white/95 border-0 shadow-xl rounded-2xl backdrop-blur-sm hover:shadow-green-200/20 hover:shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-green-100 rounded-full mb-3 shadow-inner">
                <Sparkles className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800">{totalActivities}</h3>
              <p className="text-sm font-medium text-gray-600">Activities Completed</p>
            </div>
          </Card>
          
          <Card className="p-8 bg-white/95 border-0 shadow-xl rounded-2xl backdrop-blur-sm hover:shadow-blue-200/20 hover:shadow-2xl transition-all">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 bg-blue-100 rounded-full mb-3 shadow-inner">
                <BookOpen className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-4xl font-bold text-gray-800">{subjectsStarted}/{subjects.length}</h3>
              <p className="text-sm font-medium text-gray-600">Subjects Explored</p>
            </div>
          </Card>
        </motion.div>

        {/* Continue learning section (if there's progress) */}
        {Object.values(progress).some(p => p?.completed > 0) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <Star className="text-yellow-300 mr-3 h-6 w-6" />
                <h2 className="text-3xl font-bold text-white">Continue Learning</h2>
              </div>
              <Button 
                variant="secondary"
                className="bg-white/90 hover:bg-white text-blue-700 border-0 font-medium rounded-full px-6"
                onClick={() => {
                  // Navigate to the subject with most recent progress
                  const mostRecent = Object.entries(progress)
                    .filter(([_, p]) => p?.completed > 0)
                    .sort(([_, a], [__, b]) => (b?.lastActivity || "").localeCompare(a?.lastActivity || ""))
                    [0];
                  
                  if (mostRecent) {
                    const subjectPath = subjects.find(s => s.title.toLowerCase().includes(mostRecent[0]))?.path;
                    if (subjectPath) navigate(subjectPath);
                  }
                }}
              >
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(progress)
                .filter(([_, p]) => p?.completed > 0)
                .sort(([_, a], [__, b]) => (b?.lastActivity || "").localeCompare(a?.lastActivity || ""))
                .slice(0, 3)
                .map(([key]) => {
                  const subject = subjects.find(s => s.title.toLowerCase().includes(key));
                  if (!subject) return null;
                  return (
                    <motion.div
                      key={key}
                      whileHover={{ scale: 1.03, y: -5 }}
                      whileTap={{ scale: 0.98 }}
                      className={`bg-gradient-to-br ${subject.gradientColor} p-6 rounded-2xl shadow-lg cursor-pointer border border-white/10`}
                      onClick={() => navigate(subject.path)}
                    >
                      <div className="flex items-center space-x-4">
                        <div className="p-4 bg-white rounded-full shadow-md">
                          {subject.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-white">{subject.title}</h3>
                          <div className="mt-3 w-full space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-white/80">Progress</span>
                              <span className="font-medium text-white">{Math.min(subject.progress, 10)}/10</span>
                            </div>
                            <Progress 
                              value={subject.progress > 0 ? 100 * Math.min(subject.progress / 10, 1) : 0} 
                              className="h-2 bg-white/20" 
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
            </div>
          </motion.div>
        )}

        {/* All subjects grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="relative"
        >
          <div className="flex items-center mb-8">
            <Sparkles className="text-yellow-300 mr-3 h-6 w-6" />
            <h2 className="text-3xl font-bold text-white">Explore All Subjects</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {subjects.map((subject, index) => (
              <motion.div
                key={subject.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
              >
                <SubjectCard
                  title={subject.title}
                  description={subject.description}
                  icon={subject.icon}
                  progress={subject.progress}
                  onClick={() => navigate(subject.path)}
                  color={subject.color}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
