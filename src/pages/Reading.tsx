
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Reading = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState("cat");
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  
  const words = [
    { word: "cat", phonetic: "kæt" },
    { word: "dog", phonetic: "dɔɡ" },
    { word: "sun", phonetic: "sʌn" },
    { word: "hat", phonetic: "hæt" },
    { word: "pen", phonetic: "pɛn" },
    { word: "cup", phonetic: "kʌp" },
    { word: "bed", phonetic: "bɛd" },
    { word: "fox", phonetic: "fɑks" },
    { word: "pig", phonetic: "pɪɡ" },
    { word: "bus", phonetic: "bʌs" }
  ];

  const playWord = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Create a speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(currentWord);
    utterance.rate = 0.8; // Slightly slower for clarity
    utterance.pitch = 1.2; // Slightly higher pitch for child-friendly sound
    
    // Add an event listener for when speech ends
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const checkWord = () => {
    const isCorrect = userInput.toLowerCase() === currentWord;
    setFeedback(isCorrect ? "Perfect! 🌟" : "Try again! You can do it! 💪");
    if (isCorrect) {
      setTimeout(() => {
        const randomWord = words[Math.floor(Math.random() * words.length)].word;
        setCurrentWord(randomWord);
        setUserInput("");
        setFeedback("");
      }, 1500);
    }
  };

  const nextWord = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)].word;
    setCurrentWord(randomWord);
    setUserInput("");
    setFeedback("");
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
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold tracking-wide">
                    {currentWord}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={playWord}
                    disabled={isPlaying}
                    className="rounded-full"
                  >
                    <Play className={`h-4 w-4 ${isPlaying ? 'text-gray-400' : 'text-primary'}`} />
                  </Button>
                </div>
                
                <div className="text-lg text-gray-600">
                  {words.find(w => w.word === currentWord)?.phonetic}
                </div>

                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="border-2 border-primary rounded-lg p-2 text-center text-2xl w-40"
                  placeholder="Type the word"
                />
                <div className="flex gap-4">
                  <Button 
                    onClick={checkWord}
                    className="bg-primary-accent hover:bg-primary-accent/90"
                  >
                    Check Word
                  </Button>
                  <Button
                    variant="outline"
                    onClick={nextWord}
                  >
                    Next Word
                  </Button>
                </div>
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
              <h2 className="text-2xl font-semibold mb-4">Reading Tips</h2>
              <div className="text-gray-600 space-y-2">
                <p>👂 Listen to the word pronunciation by clicking the play button</p>
                <p>👀 Look at the phonetic spelling to understand the sounds</p>
                <p>✍️ Practice typing the word to improve spelling</p>
                <p>🔄 Use the Next Word button to practice different words</p>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reading;
