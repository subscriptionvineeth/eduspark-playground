import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import PageLayout from "@/components/layouts/PageLayout";
import { Trophy, Star, Calculator, Grid3X3, Clock } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";

const MathGames = () => {
  const { updateProgress } = useUser();
  const { toast } = useToast();
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 10));
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameMode, setGameMode] = useState<"addition" | "subtraction" | "multiplication" | "division">("addition");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [showMultiplicationTable, setShowMultiplicationTable] = useState(false);
  const [tableNumber, setTableNumber] = useState(2);

  useEffect(() => {
    generateProblem();
  }, [gameMode, difficulty]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && isTimerActive) {
      handleTimerEnd();
    }

    return () => {
      clearTimeout(timer);
    };
  }, [timeLeft, isTimerActive]);

  const startChallengeMode = () => {
    setScore(0);
    setCorrectAnswers(0);
    setTotalQuestions(0);
    setTimeLeft(30);
    setIsTimerActive(true);
    generateProblem();
    
    toast({
      title: "Challenge started!",
      description: "Solve as many problems as you can in 30 seconds!",
      variant: "default"
    });
  };

  const handleTimerEnd = () => {
    setIsTimerActive(false);
    
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
    
    updateProgress("math", score);
    
    toast({
      title: "Challenge completed!",
      description: `You solved ${correctAnswers} out of ${totalQuestions} problems (${accuracy}% accuracy)`,
      variant: "default"
    });
  };

  const generateProblem = () => {
    let a, b;
    
    // Generate numbers based on difficulty
    switch (difficulty) {
      case "easy":
        a = Math.floor(Math.random() * 10); // 0-9
        b = Math.floor(Math.random() * 10); // 0-9
        break;
      case "medium":
        a = Math.floor(Math.random() * 20); // 0-19
        b = Math.floor(Math.random() * 15); // 0-14
        break;
      case "hard":
        a = Math.floor(Math.random() * 50) + 10; // 10-59
        b = Math.floor(Math.random() * 30) + 5;  // 5-34
        break;
      default:
        a = Math.floor(Math.random() * 10);
        b = Math.floor(Math.random() * 10);
    }
    
    // Handle specific cases for each operation
    if (gameMode === "subtraction") {
      // Make sure a >= b for subtraction (no negative answers)
      if (a < b) {
        [a, b] = [b, a]; // Swap values
      }
    } else if (gameMode === "division") {
      // Make sure division results in a whole number
      b = b === 0 ? 1 : b; // Avoid division by zero
      a = b * Math.floor(Math.random() * 10) + b; // Make a a multiple of b
    } else if (gameMode === "multiplication") {
      // For easy difficulty, keep numbers smaller
      if (difficulty === "easy") {
        a = Math.floor(Math.random() * 5) + 1; // 1-5
        b = Math.floor(Math.random() * 5) + 1; // 1-5
      }
    }
    
    setNum1(a);
    setNum2(b);
    setUserAnswer("");
  };

  const checkAnswer = () => {
    let expected;
    
    switch (gameMode) {
      case "addition":
        expected = num1 + num2;
        break;
      case "subtraction":
        expected = num1 - num2;
        break;
      case "multiplication":
        expected = num1 * num2;
        break;
      case "division":
        expected = num1 / num2;
        break;
      default:
        expected = num1 + num2;
    }
    
    const userGuess = parseFloat(userAnswer);
    const correct = userGuess === expected;
    
    if (isTimerActive) {
      setTotalQuestions(prev => prev + 1);
    }
    
    if (correct) {
      setFeedback("Correct! Great job! 🎉");
      const pointsEarned = difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3;
      setScore(prev => prev + pointsEarned);
      
      if (isTimerActive) {
        setCorrectAnswers(prev => prev + 1);
      } else {
        // Update progress and award points if not in challenge mode
        updateProgress("math", pointsEarned);
      }
      
      if (score > 0 && score % 5 === 0 && !isTimerActive) {
        toast({
          title: "Math achievement!",
          description: `You've solved ${score + 1} math problems correctly!`,
          variant: "default"
        });
      }
      
      setTimeout(() => {
        generateProblem();
        setFeedback("");
      }, 1000);
    } else {
      setFeedback("Try again! You can do it! 💪");
    }
  };

  const switchGameMode = (mode: "addition" | "subtraction" | "multiplication" | "division") => {
    setGameMode(mode);
    setFeedback("");
  };

  const switchDifficulty = (level: "easy" | "medium" | "hard") => {
    setDifficulty(level);
    setFeedback("");
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const generateOperationSymbol = () => {
    switch (gameMode) {
      case "addition": return "+";
      case "subtraction": return "-";
      case "multiplication": return "×";
      case "division": return "÷";
      default: return "+";
    }
  };

  return (
    <PageLayout title="Math Games">
      <div className="space-y-8">
        <Tabs defaultValue="practice" className="w-full">
          <TabsList className="mb-4 w-full flex justify-center">
            <TabsTrigger value="practice">Practice Mode</TabsTrigger>
            <TabsTrigger value="challenge">Challenge Mode</TabsTrigger>
            <TabsTrigger value="tables">Multiplication Tables</TabsTrigger>
          </TabsList>
          
          <TabsContent value="practice" className="space-y-6">
            <Card className="p-6 relative overflow-hidden">
              <motion.div
                className="absolute -left-20 -bottom-20 w-40 h-40 bg-primary-accent/20 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 5, repeat: Infinity }}
              />
              
              <div className="flex flex-wrap gap-4 mb-6 relative z-10">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant={gameMode === "addition" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => switchGameMode("addition")}
                  >
                    Addition
                  </Button>
                  <Button 
                    variant={gameMode === "subtraction" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => switchGameMode("subtraction")}
                  >
                    Subtraction
                  </Button>
                  <Button 
                    variant={gameMode === "multiplication" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => switchGameMode("multiplication")}
                  >
                    Multiplication
                  </Button>
                  <Button 
                    variant={gameMode === "division" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => switchGameMode("division")}
                  >
                    Division
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2 ml-auto">
                  <Button 
                    variant={difficulty === "easy" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => switchDifficulty("easy")}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Easy
                  </Button>
                  <Button 
                    variant={difficulty === "medium" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => switchDifficulty("medium")}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                  >
                    Medium
                  </Button>
                  <Button 
                    variant={difficulty === "hard" ? "default" : "outline"}
                    size="sm" 
                    onClick={() => switchDifficulty("hard")}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Hard
                  </Button>
                </div>
              </div>
              
              <div className="flex flex-col items-center space-y-4 relative z-10">
                <div className="text-4xl font-bold">
                  {num1} {generateOperationSymbol()} {num2} = ?
                </div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-2 border-primary rounded-lg p-2 text-center text-2xl w-28"
                  placeholder="?"
                  autoFocus
                />
                <Button 
                  onClick={checkAnswer}
                  className="bg-primary-accent hover:bg-primary-accent/90"
                >
                  Check Answer
                </Button>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-lg font-medium text-center"
                  >
                    {feedback}
                  </motion.div>
                )}
                
                {score > 0 && (
                  <div className="flex items-center gap-2 text-sm font-medium text-primary">
                    <Trophy className="h-4 w-4" />
                    <span>Score: {score}</span>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="challenge" className="space-y-6">
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="w-full flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-orange-500" />
                    <span className="font-semibold">Time: {timeLeft}s</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span className="font-semibold">Score: {score}</span>
                  </div>
                </div>
                
                {isTimerActive ? (
                  <>
                    <Progress value={(timeLeft / 30) * 100} className="h-2 w-full" />
                    
                    <div className="text-4xl font-bold my-6">
                      {num1} {generateOperationSymbol()} {num2} = ?
                    </div>
                    
                    <input
                      type="number"
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="border-2 border-primary rounded-lg p-2 text-center text-2xl w-28"
                      placeholder="?"
                      autoFocus
                    />
                    
                    <Button 
                      onClick={checkAnswer}
                      className="bg-primary-accent hover:bg-primary-accent/90"
                    >
                      Submit
                    </Button>
                    
                    <div className="text-sm text-gray-600">
                      Solved: {correctAnswers} / {totalQuestions} questions
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <h3 className="text-xl font-semibold mb-4">Math Challenge</h3>
                    <p className="text-gray-600 mb-6">
                      Solve as many math problems as you can in 30 seconds!
                    </p>
                    <Button 
                      onClick={startChallengeMode}
                      className="bg-primary hover:bg-primary/90"
                      size="lg"
                    >
                      Start Challenge
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="tables" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Multiplication Tables</h3>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(number => (
                  <Button
                    key={number}
                    variant={tableNumber === number ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTableNumber(number)}
                  >
                    {number}
                  </Button>
                ))}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-center">Table of {tableNumber}</h4>
                  <div className="space-y-2">
                    {Array.from({length: 10}, (_, i) => i + 1).map(i => (
                      <div key={i} className="flex justify-between p-2 rounded hover:bg-gray-100">
                        <div>{tableNumber} × {i} =</div>
                        <div className="font-medium">{tableNumber * i}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-lg mb-3 text-center">Practice</h4>
                  <div className="text-center space-y-4">
                    <p className="text-gray-600">
                      Try to memorize the table and then test yourself!
                    </p>
                    <Button 
                      onClick={() => {
                        setGameMode("multiplication");
                        setNum1(tableNumber);
                        setNum2(Math.floor(Math.random() * 10) + 1);
                        setUserAnswer("");
                        setFeedback("");
                      }}
                    >
                      Practice {tableNumber}'s Table
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Math Tips</h2>
          <div className="text-gray-600">
            <p className="mb-2">Here are some helpful tips for solving math problems:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Addition: Start with the larger number and count up</li>
              <li>Subtraction: Think of it as "how many more to get from the smaller to the larger number"</li>
              <li>Multiplication: Remember it as repeated addition</li>
              <li>Division: Think of it as sharing equally among groups</li>
              <li>Take your time and double-check your answers</li>
            </ul>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default MathGames;
