
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Science = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const questions = [
    {
      question: "What do plants need to grow?",
      options: ["Water and Sunlight", "Pizza", "Television", "Candy"],
      answer: 0
    },
    {
      question: "Which animal can fly?",
      options: ["Fish", "Bird", "Snake", "Cat"],
      answer: 1
    },
    {
      question: "What makes a rainbow appear?",
      options: ["Magic", "Rain and Sun", "Night", "Wind"],
      answer: 1
    }
  ];

  const handleAnswer = (selectedOption: number) => {
    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-primary p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-primary-foreground mb-6"
          >
            Science Fun
          </motion.h1>
          
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Science Quiz</h2>
              {!showResult ? (
                <div className="space-y-6">
                  <div className="text-xl font-medium">
                    {questions[currentQuestion].question}
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentQuestion].options.map((option, index) => (
                      <Button
                        key={index}
                        onClick={() => handleAnswer(index)}
                        variant="outline"
                        className="text-lg py-6"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold">
                    Quiz Complete! 🎉
                  </div>
                  <div className="text-xl">
                    Your score: {score} out of {questions.length}
                  </div>
                  <Button onClick={resetQuiz}>Try Again</Button>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
              <div className="text-gray-600">
                <p>More science experiments and activities:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Virtual Lab Experiments</li>
                  <li>Nature Explorer</li>
                  <li>Space Adventure</li>
                  <li>Animal Kingdom</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Science;
