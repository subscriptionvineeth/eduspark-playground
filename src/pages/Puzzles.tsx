import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PageLayout from '@/components/layouts/PageLayout';
import { Button } from '@/components/ui/button';
import { GamifiedQuiz, QuizQuestion } from '@/components/GamifiedQuiz';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Puzzle, BrainCog, Lightbulb, RotateCcw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const mathPuzzles: QuizQuestion[] = [
  {
    id: 1,
    question: "If you have 3 apples and you take away 2, how many do you have?",
    options: ["1 apple", "2 apples", "3 apples", "5 apples"],
    answer: 1,
    explanation: "You take 2 apples away, so you have those 2 apples with you! The question is asking how many you have, not how many are left.",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "A farmer has 17 sheep, all but 9 die. How many sheep are still alive?",
    options: ["8 sheep", "9 sheep", "17 sheep", "0 sheep"],
    answer: 1,
    explanation: "The phrase 'all but 9' means that 9 sheep are still alive. It's a tricky way of saying that all except 9 sheep have died.",
    difficulty: "medium"
  },
  {
    id: 3,
    question: "If you divide 30 by half and add 10, what do you get?",
    options: ["25", "35", "40", "70"],
    answer: 3,
    explanation: "When you divide by half, you're actually multiplying by 2. So 30 ÷ 0.5 = 30 × 2 = 60. Then 60 + 10 = 70.",
    difficulty: "hard"
  },
  {
    id: 4,
    question: "I am an odd number. Take away a letter and I become even. What number am I?",
    options: ["Seven", "Nine", "Five", "Three"],
    answer: 0,
    explanation: "SEVEN. Take away the 'S' and it becomes 'EVEN'.",
    difficulty: "medium"
  },
  {
    id: 5,
    question: "What can you put between 7 and 8 to make the result greater than 7 but less than 8?",
    options: ["Addition sign (+)", "Subtraction sign (-)", "Decimal point (.)", "Division sign (÷)"],
    answer: 2,
    explanation: "If you put a decimal point, you get 7.8, which is greater than 7 but less than 8.",
    difficulty: "easy"
  }
];

const logicPuzzles: QuizQuestion[] = [
  {
    id: 1,
    question: "A girl met a bear in a wasteland. They both got scared and ran away. The girl ran to the north, the bear to the west. Suddenly the girl stopped, aimed her gun to the south and shot the bear. What color was the bear?",
    options: ["Brown", "Black", "White", "Cannot determine"],
    answer: 2,
    explanation: "This could only happen at the North Pole. The girl ran south, then turned around and fired south. The bear ran west from the North Pole. This means the bear must be a polar bear, which is white.",
    difficulty: "hard"
  },
  {
    id: 2,
    question: "If you have a cube, how many squares are there in total?",
    options: ["6", "8", "12", "24"],
    answer: 0,
    explanation: "A cube has 6 faces, and each face is a square. So there are 6 squares in total.",
    difficulty: "easy"
  },
  {
    id: 3,
    question: "I am taken from a mine, and shut in a wooden case, from which I am never released. Yet I am used by almost everyone. What am I?",
    options: ["Gold", "Diamond", "Coal", "Pencil lead"],
    answer: 3,
    explanation: "Pencil lead (graphite) is taken from a mine, enclosed in a wooden pencil case, and is used by almost everyone for writing.",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "What letter comes next in this sequence? O, T, T, F, F, S, S, ?",
    options: ["E", "N", "T", "O"],
    answer: 0,
    explanation: "These letters stand for the first letters of number words: One, Two, Three, Four, Five, Six, Seven, Eight. So the next letter is E.",
    difficulty: "hard"
  },
  {
    id: 5,
    question: "A man builds a house with all 4 sides facing south. A bear walks by. What color is the bear?",
    options: ["Brown", "Black", "White", "Cannot determine"],
    answer: 2,
    explanation: "The only place on Earth where all 4 sides of a house can face south is the North Pole. Polar bears are white and live near the North Pole.",
    difficulty: "medium"
  }
];

const wordPuzzles: QuizQuestion[] = [
  {
    id: 1,
    question: "What 5-letter word becomes shorter when you add two letters to it?",
    options: ["Small", "Short", "Brief", "Light"],
    answer: 1,
    explanation: "The word 'short' becomes 'shorter' when you add 'er' to it. So adding two letters actually makes it 'shorter'!",
    difficulty: "medium"
  },
  {
    id: 2,
    question: "What word in the English language does the following: The first two letters signify a male, the first three letters signify a female, the first four letters signify a great person, while the entire word signifies a great woman?",
    options: ["Heroine", "Heroic", "Woman", "Female"],
    answer: 0,
    explanation: "Heroine: 'He' for male, 'Her' for female, 'Hero' for a great person, and 'Heroine' for a great woman.",
    difficulty: "hard"
  },
  {
    id: 3,
    question: "What English word retains the same pronunciation, even after you take away four of its five letters?",
    options: ["Plate", "Queue", "Tough", "Eight"],
    answer: 1,
    explanation: "Queue. If you remove four letters, leaving just 'Q', the pronunciation remains the same.",
    difficulty: "medium"
  },
  {
    id: 4,
    question: "I'm light as a feather, but the strongest person can't hold me for more than a few minutes. What am I?",
    options: ["Breath", "Time", "Thought", "Water"],
    answer: 0,
    explanation: "Breath. It's very light, but even the strongest person needs to exhale and inhale regularly - they can't 'hold their breath' for very long.",
    difficulty: "easy"
  },
  {
    id: 5,
    question: "Forward I am heavy, backward I am not. What am I?",
    options: ["Walk", "Ton", "Loss", "Gain"],
    answer: 1,
    explanation: "The word 'ton' means a heavy weight. Backwards, 'ton' becomes 'not'. So forward it's heavy, backward it's not.",
    difficulty: "medium"
  }
];

export default function Puzzles() {
  const [activeTab, setActiveTab] = useState("math");
  const [completedQuizzes, setCompletedQuizzes] = useState<Record<string, boolean>>({});
  const [scores, setScores] = useState<Record<string, { score: number, total: number }>>({});
  const { toast } = useToast();

  const handleQuizComplete = (category: string, score: number, total: number) => {
    // Mark this category as completed
    setCompletedQuizzes(prev => ({
      ...prev,
      [category]: true
    }));
    
    // Save the score
    setScores(prev => ({
      ...prev,
      [category]: { score, total }
    }));
    
    // Show a toast notification
    toast({
      title: `${category.charAt(0).toUpperCase() + category.slice(1)} Quiz Completed!`,
      description: `You scored ${score} out of ${total}. ${
        score === total 
          ? "Perfect score! Amazing work!" 
          : score >= total * 0.8 
            ? "Great job!"
            : "Keep practicing to improve!"
      }`,
      duration: 5000
    });
  };

  const resetQuiz = (category: string) => {
    setCompletedQuizzes(prev => ({
      ...prev,
      [category]: false
    }));
  };

  // Calculate total score across all quizzes
  const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = Object.values(scores).reduce((acc, curr) => acc + curr.total, 0);
  const overallPercentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  
  return (
    <PageLayout title="Puzzles">
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-2">Brain Teasers & Puzzles</h1>
          <p className="text-muted-foreground">
            Solve puzzles to sharpen your thinking and have fun learning!
          </p>
        </motion.div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="math" className="flex items-center gap-2">
            <Puzzle className="h-4 w-4" />
            <span>Math Puzzles</span>
          </TabsTrigger>
          <TabsTrigger value="logic" className="flex items-center gap-2">
            <BrainCog className="h-4 w-4" />
            <span>Logic Puzzles</span>
          </TabsTrigger>
          <TabsTrigger value="word" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            <span>Word Puzzles</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="math" className="space-y-4">
          {completedQuizzes.math ? (
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Math Puzzles Completed!</h3>
              <p className="mb-4">
                You scored {scores.math?.score || 0} out of {scores.math?.total || 0}
                ({Math.round(((scores.math?.score || 0) / (scores.math?.total || 1)) * 100)}%)
              </p>
              <Button onClick={() => resetQuiz("math")} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Card>
          ) : (
            <GamifiedQuiz 
              questions={mathPuzzles} 
              onComplete={(score, total) => handleQuizComplete("math", score, total)}
              title="Math Puzzles"
            />
          )}
        </TabsContent>
        
        <TabsContent value="logic" className="space-y-4">
          {completedQuizzes.logic ? (
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Logic Puzzles Completed!</h3>
              <p className="mb-4">
                You scored {scores.logic?.score || 0} out of {scores.logic?.total || 0}
                ({Math.round(((scores.logic?.score || 0) / (scores.logic?.total || 1)) * 100)}%)
              </p>
              <Button onClick={() => resetQuiz("logic")} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Card>
          ) : (
            <GamifiedQuiz 
              questions={logicPuzzles} 
              onComplete={(score, total) => handleQuizComplete("logic", score, total)}
              title="Logic Puzzles"
            />
          )}
        </TabsContent>
        
        <TabsContent value="word" className="space-y-4">
          {completedQuizzes.word ? (
            <Card className="p-6 text-center">
              <h3 className="text-xl font-semibold mb-4">Word Puzzles Completed!</h3>
              <p className="mb-4">
                You scored {scores.word?.score || 0} out of {scores.word?.total || 0}
                ({Math.round(((scores.word?.score || 0) / (scores.word?.total || 1)) * 100)}%)
              </p>
              <Button onClick={() => resetQuiz("word")} variant="outline" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </Card>
          ) : (
            <GamifiedQuiz 
              questions={wordPuzzles} 
              onComplete={(score, total) => handleQuizComplete("word", score, total)}
              title="Word Puzzles"
            />
          )}
        </TabsContent>
      </Tabs>
      
      {totalPossible > 0 && (
        <Card className="mt-8 p-6 bg-primary/5">
          <h3 className="text-lg font-semibold mb-4">Your Overall Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{totalScore}</div>
              <div className="text-sm text-muted-foreground">Points Earned</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{Object.keys(completedQuizzes).filter(k => completedQuizzes[k]).length}/3</div>
              <div className="text-sm text-muted-foreground">Puzzles Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{overallPercentage}%</div>
              <div className="text-sm text-muted-foreground">Overall Score</div>
            </div>
          </div>
        </Card>
      )}
      
      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Puzzle-Solving Tips:
        </h3>
        <ul className="list-disc list-inside space-y-2 text-sm">
          <li>Read the question carefully - watch for tricky wording!</li>
          <li>Think about unusual interpretations of the question.</li>
          <li>For math puzzles, remember that the obvious formula might not always apply.</li>
          <li>For word puzzles, think about multiple meanings of words.</li>
          <li>Don't rush - sometimes the best approach is to take your time.</li>
        </ul>
      </div>
    </PageLayout>
  );
} 