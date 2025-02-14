
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Math = () => {
  const navigate = useNavigate();
  const [num1, setNum1] = useState(() => Math.floor(Math.random() * 10));
  const [num2, setNum2] = useState(() => Math.floor(Math.random() * 10));
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState("");

  const checkAnswer = () => {
    const correct = num1 + num2 === parseInt(userAnswer);
    setFeedback(correct ? "Correct! Great job! 🎉" : "Try again! You can do it! 💪");
    if (correct) {
      setTimeout(() => {
        setNum1(Math.floor(Math.random() * 10));
        setNum2(Math.floor(Math.random() * 10));
        setUserAnswer("");
        setFeedback("");
      }, 1500);
    }
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
            Math Games
          </motion.h1>
          
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Addition Adventure</h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-4xl font-bold">
                  {num1} + {num2} = ?
                </div>
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className="border-2 border-primary rounded-lg p-2 text-center text-2xl w-20"
                  placeholder="?"
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
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
              <div className="text-gray-600">
                <p>More exciting math games are on the way:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Multiplication Mania</li>
                  <li>Division Detective</li>
                  <li>Shape Sorting</li>
                  <li>Number Patterns</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Math;
