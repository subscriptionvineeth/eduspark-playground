import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Trophy, AlertCircle, Check, X, HelpCircle } from 'lucide-react';
import { Confetti } from '@/components/ui/confetti';
import * as ProgressPrimitive from "@radix-ui/react-progress";

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  image?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface GamifiedQuizProps {
  questions: QuizQuestion[];
  onComplete: (score: number, totalQuestions: number) => void;
  showTimer?: boolean;
  timePerQuestion?: number; // Time in seconds
  showHints?: boolean;
  title?: string;
}

export const GamifiedQuiz: React.FC<GamifiedQuizProps> = ({
  questions,
  onComplete,
  showTimer = true,
  timePerQuestion = 20,
  showHints = true,
  title = 'Quiz'
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [lifeLines, setLifeLines] = useState(2); // Number of hints/helps available
  const [showConfetti, setShowConfetti] = useState(false);
  const [streak, setStreak] = useState(0);
  
  const currentQuestion = questions[currentQuestionIndex];
  
  // Reset timer when moving to a new question
  useEffect(() => {
    if (showTimer && !showExplanation && !isCompleted) {
      setTimeLeft(timePerQuestion);
      
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Time's up, show the correct answer
            setShowExplanation(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [currentQuestionIndex, showExplanation, isCompleted]);

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation) return; // Prevent selection after answer is revealed
    
    setSelectedOption(optionIndex);
    setShowExplanation(true);
    
    if (optionIndex === currentQuestion.answer) {
      setScore((prev) => prev + 1);
      setStreak((prev) => prev + 1);
      
      // Show confetti for correct answers or when achieving a streak
      if (streak >= 2) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    setSelectedOption(null);
    setShowExplanation(false);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      onComplete(score, questions.length);
    }
  };

  const useLifeLine = () => {
    if (lifeLines > 0 && !showExplanation) {
      setLifeLines((prev) => prev - 1);
      
      // Create a list of wrong answers (excluding the correct one)
      const wrongOptions = currentQuestion.options
        .map((_, index) => index)
        .filter(index => index !== currentQuestion.answer);
      
      // Randomly select half of the wrong answers to disable
      const disableCount = Math.floor(wrongOptions.length / 2);
      const optionsToDisable = wrongOptions
        .sort(() => 0.5 - Math.random())
        .slice(0, disableCount);
      
      // Automatically disable these options visually (implementation in UI below)
      return optionsToDisable;
    }
    return [];
  };

  const [disabledOptions, setDisabledOptions] = useState<number[]>([]);
  
  const handleLifeLine = () => {
    const optionsToDisable = useLifeLine();
    setDisabledOptions(optionsToDisable);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setShowExplanation(false);
    setIsCompleted(false);
    setTimeLeft(timePerQuestion);
    setLifeLines(2);
    setStreak(0);
    setDisabledOptions([]);
  };

  return (
    <div className="space-y-6 relative">
      {showConfetti && <Confetti duration={3000} />}
      
      {!isCompleted ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <span>Question {currentQuestionIndex + 1}/{questions.length}</span>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-medium">{score}</span>
              </div>
              
              {streak >= 2 && (
                <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13 3L14.5 1.5L16 3L17.5 1.5L19 3L20.5 1.5L22 3V7L20.5 8.5L22 10L20.5 11.5L22 13L20.5 14.5L22 16V20L20.5 21.5L19 20L17.5 21.5L16 20L14.5 21.5L13 20L11.5 21.5L10 20L8.5 21.5L7 20L5.5 21.5L4 20V16L2.5 14.5L4 13L2.5 11.5L4 10L2.5 8.5L4 7V3L5.5 1.5L7 3L8.5 1.5L10 3L11.5 1.5L13 3Z" fill="currentColor"/>
                    <path d="M12 6L12.95 8.95L16 9.25L13.88 11.43L14.54 14.5L12 12.91L9.46 14.5L10.12 11.43L8 9.25L11.05 8.95L12 6Z" fill="currentColor"/>
                  </svg>
                  <span>{streak} streak!</span>
                </div>
              )}
              
              {showHints && (
                <div className="flex items-center gap-1">
                  <HelpCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">{lifeLines}</span>
                </div>
              )}
            </div>
          </div>
          
          {showTimer && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>Time left</span>
                <span>{timeLeft}s</span>
              </div>
              <ProgressPrimitive.Root
                className="relative h-2 w-full overflow-hidden rounded-full bg-secondary"
                value={(timeLeft / timePerQuestion) * 100}
              >
                <ProgressPrimitive.Indicator
                  className={`h-full w-full flex-1 transition-all ${
                    timeLeft < 5 ? 'bg-red-500' : timeLeft < 10 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ transform: `translateX(-${100 - ((timeLeft / timePerQuestion) * 100 || 0)}%)` }}
                />
              </ProgressPrimitive.Root>
            </div>
          )}
          
          <Card className="p-6 relative overflow-hidden shadow-md">
            <motion.div
              className="absolute -right-10 -top-10 w-40 h-40 bg-primary-accent/10 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-4">{currentQuestion.question}</h3>
              
              {currentQuestion.image && (
                <div className="mb-4 flex justify-center">
                  <img 
                    src={currentQuestion.image} 
                    alt={`Question ${currentQuestionIndex + 1}`} 
                    className="max-h-40 rounded-lg"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3 mt-6">
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: !showExplanation ? 1.02 : 1 }}
                    whileTap={{ scale: !showExplanation ? 0.98 : 1 }}
                  >
                    <Button
                      onClick={() => !showExplanation && handleOptionSelect(index)}
                      variant={
                        showExplanation
                          ? index === currentQuestion.answer
                            ? "default"
                            : selectedOption === index
                            ? "destructive"
                            : "outline"
                          : selectedOption === index
                          ? "default"
                          : "outline"
                      }
                      className={`w-full text-left justify-start p-4 h-auto ${
                        disabledOptions.includes(index) ? 'opacity-50' : ''
                      } ${
                        showExplanation && index === currentQuestion.answer
                          ? "bg-green-500 hover:bg-green-500 text-white"
                          : showExplanation && selectedOption === index
                          ? "bg-red-500 hover:bg-red-500 text-white"
                          : ""
                      }`}
                      disabled={showExplanation || disabledOptions.includes(index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="flex-grow">{option}</span>
                        {showExplanation && index === currentQuestion.answer && (
                          <Check className="h-5 w-5 flex-shrink-0" />
                        )}
                        {showExplanation && selectedOption === index && index !== currentQuestion.answer && (
                          <X className="h-5 w-5 flex-shrink-0" />
                        )}
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
              
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500"
                >
                  <h4 className="font-medium mb-1 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Explanation:
                  </h4>
                  <p className="text-gray-700">{currentQuestion.explanation}</p>
                  <div className="mt-4">
                    <Button onClick={nextQuestion}>
                      {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
                    </Button>
                  </div>
                </motion.div>
              )}
              
              {!showExplanation && showHints && lifeLines > 0 && (
                <div className="mt-4 flex justify-center">
                  <Button 
                    variant="outline" 
                    onClick={handleLifeLine}
                    className="text-sm"
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Use Hint ({lifeLines} left)
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-6"
        >
          <Card className="p-8 relative overflow-hidden shadow-md">
            <motion.div
              className="absolute -right-20 -top-20 w-60 h-60 bg-green-100 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <div className="relative z-10">
              <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-primary mb-4">Quiz Complete!</h2>
              
              <div className="text-xl mb-2">
                Your score: {score} out of {questions.length}
                <div className="text-base mt-1 text-gray-600">
                  ({Math.round((score / questions.length) * 100)}%)
                </div>
              </div>
              
              <div className="py-4">
                {score === questions.length ? (
                  <div className="text-green-600 font-medium">Perfect score! Incredible job!</div>
                ) : score >= questions.length * 0.8 ? (
                  <div className="text-green-600 font-medium">Excellent work! You're a star!</div>
                ) : score >= questions.length * 0.6 ? (
                  <div className="text-blue-600 font-medium">Good job! Keep practicing!</div>
                ) : (
                  <div className="text-orange-600 font-medium">Nice effort! Try again to improve!</div>
                )}
              </div>
              
              <div className="mt-6">
                <Button onClick={restartQuiz} size="lg">
                  Try Again
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}; 