
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Reading = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState("cat");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const words = ["cat", "dog", "sun", "hat", "pen", "cup", "bed", "fox", "pig", "bus"];

  const checkWord = () => {
    const isCorrect = userInput.toLowerCase() === currentWord;
    setFeedback(isCorrect ? "Perfect! 🌟" : "Try again! You can do it! 💪");
    if (isCorrect) {
      setTimeout(() => {
        const newWord = words[Math.floor(Math.random() * words.length)];
        setCurrentWord(newWord);
        setUserInput("");
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
            Reading & Phonics
          </motion.h1>
          
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Word Practice</h2>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-4xl font-bold tracking-wide">
                  {currentWord}
                </div>
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="border-2 border-primary rounded-lg p-2 text-center text-2xl w-40"
                  placeholder="Type the word"
                />
                <Button 
                  onClick={checkWord}
                  className="bg-primary-accent hover:bg-primary-accent/90"
                >
                  Check Word
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
                <p>More reading activities on the way:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Story Time Adventures</li>
                  <li>Letter Recognition Games</li>
                  <li>Rhyming Words</li>
                  <li>Sight Word Practice</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reading;
