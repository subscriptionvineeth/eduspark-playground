import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, VolumeIcon, Book, AlignJustify, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import PageLayout from "@/components/layouts/PageLayout";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface WordData {
  word: string;
  phonetic: string;
  definition: string;
  category: string;
  image?: string;
}

interface LetterData {
  letter: string;
  upperCase: string;
  lowerCase: string;
  soundDescription: string;
  examples: string[];
}

const letters: LetterData[] = [
  {
    letter: "A",
    upperCase: "A",
    lowerCase: "a",
    soundDescription: "Ah (as in 'apple') or Ay (as in 'ape')",
    examples: ["Apple", "Ant", "Airplane"]
  },
  {
    letter: "B",
    upperCase: "B",
    lowerCase: "b",
    soundDescription: "Buh (as in 'ball')",
    examples: ["Ball", "Bear", "Boat"]
  },
  {
    letter: "C",
    upperCase: "C",
    lowerCase: "c",
    soundDescription: "Kuh (as in 'cat') or Sss (as in 'city')",
    examples: ["Cat", "Car", "City"]
  },
  {
    letter: "D",
    upperCase: "D",
    lowerCase: "d",
    soundDescription: "Duh (as in 'dog')",
    examples: ["Dog", "Duck", "Door"]
  },
  {
    letter: "E",
    upperCase: "E",
    lowerCase: "e",
    soundDescription: "Eh (as in 'elephant') or Ee (as in 'equal')",
    examples: ["Elephant", "Egg", "Exit"]
  },
  {
    letter: "F",
    upperCase: "F",
    lowerCase: "f",
    soundDescription: "Fff (as in 'fish')",
    examples: ["Fish", "Frog", "Fan"]
  },
  {
    letter: "G",
    upperCase: "G",
    lowerCase: "g",
    soundDescription: "Guh (as in 'goat') or Jjj (as in 'giraffe')",
    examples: ["Goat", "Grass", "Giraffe"]
  },
  {
    letter: "H",
    upperCase: "H",
    lowerCase: "h",
    soundDescription: "Hhh (as in 'house')",
    examples: ["House", "Hat", "Hand"]
  }
];

const allWords: WordData[] = [
  // Animals
  { word: "cat", phonetic: "kæt", definition: "A small furry animal with four legs that is often kept as a pet", category: "animals", image: "/images/cat.png" },
  { word: "dog", phonetic: "dɔɡ", definition: "A common four-legged animal, especially kept by people as a pet or to hunt or guard things", category: "animals", image: "/images/dog.png" },
  { word: "fox", phonetic: "fɑks", definition: "A wild animal that looks like a dog and has reddish-brown fur, a pointed nose, and a bushy tail", category: "animals", image: "/images/fox.png" },
  { word: "pig", phonetic: "pɪɡ", definition: "A farm animal with short legs, a broad nose, and a small curly tail", category: "animals", image: "/images/pig.png" },
  { word: "cow", phonetic: "kaʊ", definition: "A large farm animal kept for milk or meat", category: "animals", image: "/images/cow.png" },
  
  // Objects
  { word: "hat", phonetic: "hæt", definition: "A covering for the head", category: "objects", image: "/images/hat.png" },
  { word: "pen", phonetic: "pɛn", definition: "A tool used for writing or drawing with ink", category: "objects", image: "/images/pen.png" },
  { word: "cup", phonetic: "kʌp", definition: "A small container used for drinking", category: "objects", image: "/images/cup.png" },
  { word: "bed", phonetic: "bɛd", definition: "A piece of furniture for sleeping on", category: "objects", image: "/images/bed.png" },
  { word: "bus", phonetic: "bʌs", definition: "A large road vehicle that carries passengers", category: "objects", image: "/images/bus.png" },
  
  // Nature
  { word: "sun", phonetic: "sʌn", definition: "The star around which Earth orbits", category: "nature", image: "/images/sun.png" },
  { word: "sky", phonetic: "skaɪ", definition: "The area above the earth that you can see when you look up", category: "nature", image: "/images/sky.png" },
  { word: "tree", phonetic: "triː", definition: "A tall plant with a wooden trunk and branches", category: "nature", image: "/images/tree.png" },
  { word: "rain", phonetic: "reɪn", definition: "Water that falls from clouds in small drops", category: "nature", image: "/images/rain.png" },
  { word: "moon", phonetic: "muːn", definition: "The natural satellite of the earth", category: "nature", image: "/images/moon.png" },
  
  // Food
  { word: "pie", phonetic: "paɪ", definition: "A baked dish with a pastry crust and a filling", category: "food", image: "/images/pie.png" },
  { word: "jam", phonetic: "dʒæm", definition: "A sweet spread made from fruit and sugar", category: "food", image: "/images/jam.png" },
  { word: "egg", phonetic: "ɛɡ", definition: "A food laid by birds and some reptiles, with a hard shell around a white and yolk", category: "food", image: "/images/egg.png" },
  { word: "milk", phonetic: "mɪlk", definition: "A white liquid produced by cows, used as a drink", category: "food", image: "/images/milk.png" },
  { word: "cake", phonetic: "keɪk", definition: "A sweet baked food made from flour, sugar, and other ingredients", category: "food", image: "/images/cake.png" }
];

const Reading = () => {
  const { updateProgress } = useUser();
  const { toast } = useToast();
  const [currentWord, setCurrentWord] = useState<WordData>(allWords[0]);
  const [userInput, setUserInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [filteredWords, setFilteredWords] = useState<WordData[]>(allWords);
  const [showDefinition, setShowDefinition] = useState(false);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [isLetterSoundPlaying, setIsLetterSoundPlaying] = useState(false);
  const [completedWords, setCompletedWords] = useState<string[]>([]);
  
  // Keep track of the current letter
  const currentLetter = letters[currentLetterIndex];
  
  // Get a random word that hasn't been completed recently
  const getRandomWord = (category: string = selectedCategory) => {
    const categoryWords = category === "all" 
      ? allWords 
      : allWords.filter(w => w.category === category);
    
    // Filter out recently completed words unless all words are completed
    const availableWords = categoryWords.filter(w => !completedWords.includes(w.word));
    
    // If all words have been completed, reset completed words
    if (availableWords.length === 0) {
      setCompletedWords([]);
      return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    }
    
    return availableWords[Math.floor(Math.random() * availableWords.length)];
  };

  // Update filtered words when category changes
  useEffect(() => {
    const newFilteredWords = selectedCategory === "all" 
      ? allWords 
      : allWords.filter(w => w.category === selectedCategory);
    setFilteredWords(newFilteredWords);
    setCurrentWord(getRandomWord());
  }, [selectedCategory]);

  const playWord = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    // Create a speech synthesis utterance
    const utterance = new SpeechSynthesisUtterance(currentWord.word);
    utterance.rate = 0.8; // Slightly slower for clarity
    utterance.pitch = 1.2; // Slightly higher pitch for child-friendly sound
    
    // Add an event listener for when speech ends
    utterance.onend = () => {
      setIsPlaying(false);
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const playLetterSound = () => {
    if (isLetterSoundPlaying) return;
    setIsLetterSoundPlaying(true);
    
    // Create a speech synthesis utterance for the letter
    const utterance = new SpeechSynthesisUtterance(currentLetter.letter);
    utterance.rate = 0.7;
    utterance.pitch = 1.2;
    
    // Add an event listener for when speech ends
    utterance.onend = () => {
      setIsLetterSoundPlaying(false);
    };
    
    // Start speaking
    window.speechSynthesis.speak(utterance);
  };

  const checkWord = () => {
    const isCorrect = userInput.toLowerCase() === currentWord.word;
    
    if (isCorrect) {
      const newStreakCount = streakCount + 1;
      setStreakCount(newStreakCount);
      setFeedback("Perfect! 🌟");
      
      // Add to completed words
      setCompletedWords(prev => [...prev, currentWord.word]);
      
      // Update progress and award points
      updateProgress("reading", 10);
      
      if (newStreakCount % 3 === 0) {
        toast({
          title: "Achievement unlocked!",
          description: `You've got a streak of ${newStreakCount} correct words!`,
          variant: "default"
        });
      }
      
      setTimeout(() => {
        const nextWord = getRandomWord();
        setCurrentWord(nextWord);
        setUserInput("");
        setFeedback("");
        setShowDefinition(false);
      }, 1500);
    } else {
      setFeedback("Try again! You can do it! 💪");
      setStreakCount(0);
    }
  };

  const nextWord = () => {
    const nextWord = getRandomWord();
    setCurrentWord(nextWord);
    setUserInput("");
    setFeedback("");
    setShowDefinition(false);
  };
  
  const nextLetter = () => {
    setCurrentLetterIndex((prev) => (prev + 1) % letters.length);
  };
  
  const prevLetter = () => {
    setCurrentLetterIndex((prev) => (prev - 1 + letters.length) % letters.length);
  };

  // Handle enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkWord();
    }
  };

  const toggleDefinition = () => {
    setShowDefinition(!showDefinition);
  };

  return (
    <PageLayout title="Reading & Phonics">
      <Tabs defaultValue="words" className="w-full">
        <TabsList className="mb-4 w-full flex justify-center">
          <TabsTrigger value="words">Word Practice</TabsTrigger>
          <TabsTrigger value="letters">Alphabet Learning</TabsTrigger>
          <TabsTrigger value="progress">My Progress</TabsTrigger>
        </TabsList>
        
        <TabsContent value="words" className="space-y-6">
          <Card className="p-6 relative overflow-hidden">
            <motion.div
              className="absolute -right-20 -top-20 w-40 h-40 bg-primary-accent/20 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
            
            <div className="flex flex-wrap gap-2 mb-6 relative z-10">
              <Button 
                variant={selectedCategory === "all" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory("all")}
              >
                All Words
              </Button>
              <Button 
                variant={selectedCategory === "animals" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory("animals")}
              >
                Animals
              </Button>
              <Button 
                variant={selectedCategory === "objects" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory("objects")}
              >
                Objects
              </Button>
              <Button 
                variant={selectedCategory === "nature" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory("nature")}
              >
                Nature
              </Button>
              <Button 
                variant={selectedCategory === "food" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setSelectedCategory("food")}
              >
                Food
              </Button>
            </div>
            
            <div className="flex flex-col items-center space-y-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold tracking-wide">
                  {currentWord.word}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={playWord}
                  disabled={isPlaying}
                  className="rounded-full"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
              </div>
              
              <div className="text-lg text-gray-600">
                {currentWord.phonetic}
              </div>
              
              <Badge variant="outline" className="cursor-pointer" onClick={toggleDefinition}>
                {showDefinition ? "Hide Definition" : "Show Definition"}
              </Badge>
              
              {showDefinition && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-blue-50 p-3 rounded-lg text-sm text-gray-700 max-w-md text-center"
                >
                  {currentWord.definition}
                </motion.div>
              )}

              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="border-2 border-primary rounded-lg p-2 text-center text-2xl w-40"
                placeholder="Type the word"
                autoFocus
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
              
              {streakCount > 0 && (
                <div className="mt-4 text-sm font-medium text-primary flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Current streak: {streakCount} word{streakCount > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Book className="h-5 w-5 text-primary" />
              Word Collection
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {filteredWords.slice(0, 8).map((word) => (
                <motion.div
                  key={word.word}
                  whileHover={{ scale: 1.03 }}
                  className={`p-3 rounded-lg cursor-pointer ${
                    currentWord.word === word.word ? "bg-primary/10 border border-primary" : "bg-gray-50"
                  }`}
                  onClick={() => {
                    setCurrentWord(word);
                    setUserInput("");
                    setFeedback("");
                    setShowDefinition(false);
                  }}
                >
                  <div className="font-medium">{word.word}</div>
                  <div className="text-xs text-gray-500">{word.phonetic}</div>
                  {completedWords.includes(word.word) && (
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Completed</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="letters" className="space-y-6">
          <Card className="p-6 relative overflow-hidden">
            <motion.div
              className="absolute -left-20 -bottom-20 w-40 h-40 bg-primary-accent/20 rounded-full"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
            
            <div className="flex flex-col items-center space-y-6 relative z-10">
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevLetter}
                >
                  Previous
                </Button>
                <h2 className="text-2xl font-semibold">Letter {currentLetter.letter}</h2>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextLetter}
                >
                  Next
                </Button>
              </div>
              
              <div className="flex gap-12 items-center">
                <div className="text-8xl font-bold text-primary">{currentLetter.upperCase}</div>
                <div className="text-8xl font-bold text-primary-accent">{currentLetter.lowerCase}</div>
              </div>
              
              <Button
                variant="outline"
                onClick={playLetterSound}
                disabled={isLetterSoundPlaying}
                className="flex items-center gap-2"
              >
                <VolumeIcon className="h-4 w-4" />
                {isLetterSoundPlaying ? "Playing..." : "Hear the Sound"}
              </Button>
              
              <div className="bg-gray-50 p-4 rounded-lg w-full">
                <h3 className="font-medium mb-2">Sound:</h3>
                <p className="text-gray-700">{currentLetter.soundDescription}</p>
              </div>
              
              <div className="w-full">
                <h3 className="font-medium mb-2">Example Words:</h3>
                <div className="grid grid-cols-3 gap-3">
                  {currentLetter.examples.map((example, index) => (
                    <div key={index} className="bg-blue-50 p-3 rounded-lg text-center">
                      <span className="text-primary font-bold">{example.charAt(0)}</span>
                      <span>{example.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Practice Activity</h2>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Letter Hunt:</h3>
              <p className="text-gray-700 mb-4">
                Look around your home and find three things that start with the letter "{currentLetter.letter}".
                Say each word out loud and practice the sound!
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  updateProgress("reading", 5);
                  toast({
                    title: "Great job!",
                    description: `You've practiced the letter ${currentLetter.letter}!`,
                    variant: "default"
                  });
                  nextLetter();
                }}
              >
                I Found Three Things!
              </Button>
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="progress" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <AlignJustify className="h-5 w-5 text-primary" />
              Reading Progress
            </h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="font-medium">Words Mastered:</h3>
                <div className="flex justify-between text-sm mb-1">
                  <span>{completedWords.length} out of {allWords.length} words</span>
                  <span>{Math.round((completedWords.length / allWords.length) * 100)}%</span>
                </div>
                <Progress value={(completedWords.length / allWords.length) * 100} className="h-2" />
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Categories Progress:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["animals", "objects", "nature", "food"].map(category => {
                    const categoryWords = allWords.filter(w => w.category === category);
                    const completedCategoryWords = completedWords.filter(word => 
                      categoryWords.some(w => w.word === word)
                    );
                    const percentage = categoryWords.length > 0 
                      ? (completedCategoryWords.length / categoryWords.length) * 100 
                      : 0;
                    
                    return (
                      <div key={category} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">{category}</span>
                          <span>{completedCategoryWords.length}/{categoryWords.length}</span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Reading Tips:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Practice reading aloud every day for at least 10 minutes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Look for words you know when reading books or signs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>If you don't know a word, try sounding out each letter</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Ask for help with difficult words and try to remember them</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
          
          <Button 
            onClick={() => {
              updateProgress("reading", 20);
              toast({
                title: "Achievement Unlocked!",
                description: "You've checked your progress and earned bonus points!",
                variant: "default"
              });
            }}
            className="w-full"
          >
            Claim Progress Bonus
          </Button>
        </TabsContent>
      </Tabs>
    </PageLayout>
  );
};

export default Reading;
