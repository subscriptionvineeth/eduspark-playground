import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import PageLayout from "@/components/layouts/PageLayout";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Story {
  id: number;
  title: string;
  summary: string;
  content: string;
  moral: string;
  image: string;
}

const stories: Story[] = [
  {
    id: 1,
    title: "The Thirsty Crow",
    summary: "A clever crow finds a way to drink water from a pot with low water level.",
    content: `Long ago, there was a crow that was very thirsty. It had been flying for hours and needed water badly. The crow flew around searching for water. Finally, it spotted a pot of water on the ground.

    The crow quickly flew down to the pot and tried to drink from it. But there was very little water in the pot, and the crow's beak couldn't reach it. 
    
    The crow thought hard about what to do. Then it noticed some small pebbles nearby. It had an idea! 
    
    One by one, the crow picked up pebbles in its beak and dropped them into the pot. As more pebbles filled the pot, the water level rose. 
    
    After adding many pebbles, the water finally rose high enough for the crow to drink. The crow quenched its thirst and flew away happily.`,
    moral: "Where there's a will, there's a way. Intelligence and resourcefulness can solve difficult problems.",
    image: "/images/thirsty-crow.png"
  },
  {
    id: 2,
    title: "The Honest Woodcutter",
    summary: "A woodcutter is rewarded for his honesty after losing his axe in a river.",
    content: `Once there was a poor woodcutter who earned his living by cutting trees near a river. One day, while cutting a tree, his axe slipped from his hands and fell into the deep river.

    The woodcutter was very sad. The axe was his only means of livelihood, and he could not afford to buy a new one. He sat by the river and began to weep.
    
    Seeing his plight, the God of Water appeared before him and asked why he was crying. The woodcutter explained his problem.
    
    The Water God dived into the river and brought out a golden axe. "Is this your axe?" he asked. The woodcutter said no, it wasn't his.
    
    The Water God dived again and brought out a silver axe. Again, the woodcutter said it wasn't his.
    
    Finally, the Water God brought out the woodcutter's old iron axe. The woodcutter was overjoyed and thanked the God.
    
    Impressed by his honesty, the Water God gifted him all three axes. The woodcutter returned home a wealthy man, rewarded for his truthfulness.`,
    moral: "Honesty is the best policy. Being truthful, even in difficult situations, brings its own rewards.",
    image: "/images/honest-woodcutter.png"
  },
  {
    id: 3,
    title: "The Tortoise and The Hare",
    summary: "A slow tortoise wins a race against a swift but overconfident hare.",
    content: `In a forest, a hare was very proud of his speed. He often made fun of the slow-moving tortoise. Tired of the hare's boasting, the tortoise challenged him to a race. The hare laughed but accepted the challenge.

    On race day, the hare sped off, leaving the tortoise far behind. Seeing his huge lead, the hare decided to take a nap under a tree. "I'll just rest for a while and still win easily," he thought.
    
    Meanwhile, the tortoise kept moving slowly but steadily. He passed the sleeping hare and continued towards the finish line.
    
    When the hare woke up, he was shocked to see the tortoise was nowhere in sight. He ran as fast as he could, but it was too late. The tortoise had already crossed the finish line and won the race.
    
    The hare learned a valuable lesson that day - never underestimate others and never be overconfident.`,
    moral: "Slow and steady wins the race. Persistence and determination often overcome natural talent when the talented become complacent.",
    image: "/images/tortoise-hare.png"
  },
  {
    id: 4,
    title: "The Four Friends",
    summary: "Four friends with different abilities work together to protect themselves.",
    content: `Once upon a time, there were four friends: a deer, a crow, a tortoise, and a mouse. They lived together in harmony in a forest.

    One day, a hunter set a trap and caught the deer. Seeing their friend in danger, the other three animals devised a plan to rescue him.
    
    The crow flew around to distract the hunter. The mouse gnawed through the ropes of the trap, freeing the deer. But as they were escaping, they realized their friend, the tortoise, was too slow and might get caught.
    
    The deer carried the tortoise on his back, and all four escaped safely. They continued to live together, protecting each other from all dangers through their friendship and combination of different skills.`,
    moral: "Unity is strength. When friends work together, combining their unique abilities, they can overcome any challenge.",
    image: "/images/four-friends.png"
  }
];

const Stories = () => {
  const { updateProgress } = useUser();
  const { toast } = useToast();
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isReading, setIsReading] = useState(false);
  const speakInstance = useRef<SpeechSynthesisUtterance | null>(null);
  const currentStory = stories[currentStoryIndex];

  useEffect(() => {
    // Cancel any ongoing speech when component unmounts
    return () => {
      if (isReading) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isReading]);

  const handleNextStory = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
    setCurrentStoryIndex((prevIndex) => (prevIndex + 1) % stories.length);
    updateProgress("stories", 5);
  };

  const handlePrevStory = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    }
    setCurrentStoryIndex((prevIndex) => (prevIndex - 1 + stories.length) % stories.length);
  };

  const toggleReading = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      // Create a new utterance for the story
      const utterance = new SpeechSynthesisUtterance(currentStory.content);
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1.0;
      
      // Set up end event
      utterance.onend = () => {
        setIsReading(false);
        updateProgress("stories", 10);
        toast({
          title: "Story completed!",
          description: "Well done for listening to the whole story.",
          variant: "default"
        });
      };
      
      // Start speaking
      speakInstance.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  return (
    <PageLayout title="Moral Stories">
      <div className="space-y-6">
        <Card className="p-6 relative overflow-hidden">
          <motion.div
            className="absolute -right-20 -top-20 w-40 h-40 bg-primary-accent/20 rounded-full"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 8, repeat: Infinity }}
          />

          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{currentStory.title}</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline" 
                  size="icon"
                  onClick={handlePrevStory}
                  disabled={isReading}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleReading}
                >
                  {isReading ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextStory}
                  disabled={isReading}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{currentStory.content}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h3 className="text-lg font-medium mb-1">Moral of the Story:</h3>
              <p className="text-gray-700">{currentStory.moral}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Story Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stories.map((story, index) => (
              <motion.div
                key={story.id}
                whileHover={{ scale: 1.02 }}
                className={`p-4 rounded-lg cursor-pointer ${
                  index === currentStoryIndex ? "bg-primary/10 border border-primary" : "bg-gray-50"
                }`}
                onClick={() => {
                  if (isReading) {
                    window.speechSynthesis.cancel();
                    setIsReading(false);
                  }
                  setCurrentStoryIndex(index);
                }}
              >
                <h3 className="font-medium">{story.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{story.summary}</p>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Stories; 