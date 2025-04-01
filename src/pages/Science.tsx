import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import PageLayout from "@/components/layouts/PageLayout";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lightbulb, Zap, Microscope, Atom, Leaf, CloudRain } from "lucide-react";

interface ExperimentType {
  id: number;
  title: string;
  description: string;
  materials: string[];
  steps: string[];
  explanation: string;
  safetyTips: string[];
  icon: React.ReactNode;
}

interface QuestionType {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

const experiments: ExperimentType[] = [
  {
    id: 1,
    title: "Balloon Static Electricity",
    description: "Learn about static electricity by making a balloon stick to a wall.",
    materials: ["Balloon", "Piece of wool or your hair", "Dry wall"],
    steps: [
      "Inflate the balloon and tie it.",
      "Rub the balloon against wool or your hair for 30 seconds.",
      "Place the balloon against a dry wall and watch it stick!",
      "Try different materials to see what works best."
    ],
    explanation: "When you rub the balloon against wool or hair, electrons transfer to the balloon, giving it a negative charge. This negative charge is attracted to the positive charges in the wall, causing the balloon to stick.",
    safetyTips: ["Be careful not to pop the balloon near your face or ears."],
    icon: <Zap />
  },
  {
    id: 2,
    title: "Rainbow in a Glass",
    description: "Create a colorful density tower using different liquids.",
    materials: ["Tall clear glass", "Honey or corn syrup", "Dish soap", "Water", "Vegetable oil", "Rubbing alcohol", "Food coloring"],
    steps: [
      "Pour honey or corn syrup into the bottom of the glass.",
      "Slowly add dish soap down the side of the glass.",
      "Mix water with food coloring and slowly pour it down the side.",
      "Slowly pour vegetable oil down the side.",
      "Mix rubbing alcohol with a different food color and very slowly add it last."
    ],
    explanation: "Different liquids have different densities (weight per volume). Heavier liquids sink to the bottom while lighter ones float on top, creating distinct layers.",
    safetyTips: ["Do not drink any of the solutions.", "Adult supervision needed when handling rubbing alcohol."],
    icon: <CloudRain />
  },
  {
    id: 3,
    title: "Plant Growth Observation",
    description: "Observe how plants grow under different conditions.",
    materials: ["3 small cups", "Soil", "Bean or pea seeds", "Water", "Notebook for observations"],
    steps: [
      "Fill each cup with soil.",
      "Plant 2-3 seeds in each cup, about 1 cm deep.",
      "Put cup 1 in a sunny spot and water regularly.",
      "Put cup 2 in a dark place and water regularly.",
      "Put cup 3 in a sunny spot but don't water it.",
      "Observe and record changes daily for 2 weeks."
    ],
    explanation: "Plants need sunlight, water, air, and nutrients to grow. By changing these conditions, you can see how each factor affects plant growth.",
    safetyTips: ["Wash hands after handling soil and seeds."],
    icon: <Leaf />
  }
];

const scienceQuiz: QuestionType[] = [
  {
    question: "What do plants need to grow?",
    options: ["Water and Sunlight", "Pizza", "Television", "Candy"],
    answer: 0,
    explanation: "Plants need water, sunlight, air, and nutrients from soil to grow. They use sunlight to make their own food through a process called photosynthesis."
  },
  {
    question: "Which animal can fly?",
    options: ["Fish", "Bird", "Snake", "Cat"],
    answer: 1,
    explanation: "Birds have wings and hollow bones that help them fly. Their bodies are specially adapted for flight."
  },
  {
    question: "What makes a rainbow appear?",
    options: ["Magic", "Rain and Sun", "Night", "Wind"],
    answer: 1,
    explanation: "Rainbows appear when sunlight passes through water droplets in the air. The light is bent (refracted) and separated into different colors."
  },
  {
    question: "What is the largest planet in our solar system?",
    options: ["Earth", "Mars", "Jupiter", "Venus"],
    answer: 2,
    explanation: "Jupiter is the largest planet in our solar system. It's so big that more than 1,300 Earths could fit inside it!"
  },
  {
    question: "What state of matter is water when it boils and turns into steam?",
    options: ["Solid", "Liquid", "Gas", "Plasma"],
    answer: 2,
    explanation: "When water boils, it changes from a liquid to a gas (steam). This change of state is called evaporation."
  },
  {
    question: "Which sense do we use with our nose?",
    options: ["Sight", "Hearing", "Smell", "Taste"],
    answer: 2,
    explanation: "Our nose contains special receptors that detect different odors, giving us our sense of smell."
  },
  {
    question: "What force pulls objects toward the center of the Earth?",
    options: ["Magnetism", "Electricity", "Wind", "Gravity"],
    answer: 3,
    explanation: "Gravity is the force that pulls objects toward Earth. It's what keeps us on the ground and makes things fall when we drop them."
  }
];

const Science = () => {
  const { updateProgress } = useUser();
  const { toast } = useToast();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentType | null>(null);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const handleAnswer = (selectedOption: number) => {
    const newUserAnswers = [...userAnswers];
    newUserAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newUserAnswers);
    
    if (selectedOption === scienceQuiz[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    setShowExplanation(true);
  };

  const nextQuestion = () => {
    setShowExplanation(false);
    
    if (currentQuestion < scienceQuiz.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    setShowResult(true);
    updateProgress("science", score * 5);
    
    if (score >= scienceQuiz.length * 0.7) {
      toast({
        title: "Science Champion!",
        description: `Great job! You scored ${score} out of ${scienceQuiz.length}!`,
        variant: "default"
      });
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    setUserAnswers([]);
  };

  const trackExperiment = (experiment: ExperimentType) => {
    setSelectedExperiment(experiment);
    updateProgress("science", 10);
    
    toast({
      title: "Great choice!",
      description: "Have fun with your experiment and learn something new!",
      variant: "default"
    });
  };

  return (
    <PageLayout title="Science Fun">
      <div className="space-y-8">
        <Tabs defaultValue="experiments" className="w-full">
          <TabsList className="mb-4 w-full flex justify-center">
            <TabsTrigger value="experiments">Experiments</TabsTrigger>
            <TabsTrigger value="quiz">Science Quiz</TabsTrigger>
          </TabsList>
          
          <TabsContent value="experiments" className="space-y-6">
            {selectedExperiment ? (
              <Card className="p-6 relative overflow-hidden">
                <motion.div
                  className="absolute -right-20 -top-20 w-40 h-40 bg-primary-accent/20 rounded-full"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold flex items-center gap-2">
                    <span className="text-primary">{selectedExperiment.icon}</span> 
                    {selectedExperiment.title}
                  </h2>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setSelectedExperiment(null)}
                  >
                    Back to List
                  </Button>
                </div>
                
                <div className="space-y-6">
                  <p className="text-gray-700">{selectedExperiment.description}</p>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Materials You'll Need:</h3>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedExperiment.materials.map((material, index) => (
                        <li key={index} className="text-gray-700">{material}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Steps:</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      {selectedExperiment.steps.map((step, index) => (
                        <li key={index} className="text-gray-700">{step}</li>
                      ))}
                    </ol>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">How It Works:</h3>
                    <p className="text-gray-700">{selectedExperiment.explanation}</p>
                  </div>
                  
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                    <h3 className="text-lg font-medium mb-2">Safety Tips:</h3>
                    <ul className="list-disc list-inside">
                      {selectedExperiment.safetyTips.map((tip, index) => (
                        <li key={index} className="text-gray-700">{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {experiments.map((experiment) => (
                  <motion.div
                    key={experiment.id}
                    whileHover={{ scale: 1.02 }}
                    className="cursor-pointer"
                    onClick={() => trackExperiment(experiment)}
                  >
                    <Card className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="text-primary text-lg">
                          {experiment.icon}
                        </div>
                        <h3 className="font-semibold">{experiment.title}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4 flex-grow">{experiment.description}</p>
                      <Button variant="outline" size="sm" className="self-start">
                        View Experiment
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
            
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Microscope className="text-primary h-6 w-6" />
                <h2 className="text-2xl font-semibold">Science at Home</h2>
              </div>
              <p className="text-gray-700 mb-4">
                Science experiments help us learn about the world around us. They teach us to:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Observe</h3>
                  <p className="text-sm text-gray-600">Look closely at what happens</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Question</h3>
                  <p className="text-sm text-gray-600">Ask why things happen</p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Discover</h3>
                  <p className="text-sm text-gray-600">Find answers through testing</p>
                </div>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="quiz" className="space-y-6">
            <Card className="p-6 relative overflow-hidden">
              <motion.div
                className="absolute -left-20 -bottom-20 w-40 h-40 bg-primary-accent/20 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <h2 className="text-2xl font-semibold mb-4 relative z-10">Science Quiz</h2>
              
              {!showResult ? (
                <div className="space-y-6 relative z-10">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Question {currentQuestion + 1} of {scienceQuiz.length}</span>
                    <span>Score: {score}</span>
                  </div>
                  
                  <div className="text-xl font-medium">
                    {scienceQuiz[currentQuestion].question}
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {scienceQuiz[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => !showExplanation && handleAnswer(index)}
                        variant={
                          showExplanation
                            ? index === scienceQuiz[currentQuestion].answer
                              ? "default"
                              : userAnswers[currentQuestion] === index
                              ? "destructive"
                              : "outline"
                            : userAnswers[currentQuestion] === index
                            ? "default"
                            : "outline"
                        }
                        className={`text-lg py-6 ${
                          showExplanation && index === scienceQuiz[currentQuestion].answer
                            ? "bg-green-500 hover:bg-green-500 text-white"
                            : showExplanation && userAnswers[currentQuestion] === index
                            ? "bg-red-500 hover:bg-red-500 text-white"
                            : ""
                        }`}
                        disabled={showExplanation}
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                  
                  {showExplanation && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
                    >
                      <h3 className="font-medium mb-1">Explanation:</h3>
                      <p>{scienceQuiz[currentQuestion].explanation}</p>
                      <div className="mt-4">
                        <Button onClick={nextQuestion}>
                          {currentQuestion < scienceQuiz.length - 1 ? "Next Question" : "See Results"}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center space-y-6 relative z-10"
                >
                  <div className="text-3xl font-bold text-primary">
                    Quiz Complete! 🎉
                  </div>
                  
                  <div className="text-xl">
                    Your score: {score} out of {scienceQuiz.length}
                    <div className="text-base mt-1 text-gray-600">
                      ({Math.round((score / scienceQuiz.length) * 100)}%)
                    </div>
                  </div>
                  
                  <div className="py-4">
                    {score === scienceQuiz.length ? (
                      <div className="text-green-600 font-medium">Perfect score! You're a science genius!</div>
                    ) : score >= scienceQuiz.length * 0.7 ? (
                      <div className="text-green-600 font-medium">Great job! You know a lot about science!</div>
                    ) : score >= scienceQuiz.length * 0.5 ? (
                      <div className="text-yellow-600 font-medium">Good effort! Keep learning about science!</div>
                    ) : (
                      <div className="text-orange-600 font-medium">Keep practicing! Science is fun to learn!</div>
                    )}
                  </div>
                  
                  <Button onClick={resetQuiz} size="lg">
                    Try Again
                  </Button>
                </motion.div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
};

export default Science;
