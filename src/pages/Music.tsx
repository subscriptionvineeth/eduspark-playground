
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card } from "@/components/ui/card";

const Music = () => {
  const navigate = useNavigate();
  const [currentPattern, setCurrentPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'playing' | 'failed'>('waiting');

  const notes = [
    { frequency: 262, color: 'bg-red-400' },     // C4
    { frequency: 294, color: 'bg-blue-400' },    // D4
    { frequency: 330, color: 'bg-green-400' },   // E4
    { frequency: 349, color: 'bg-yellow-400' }   // F4
  ];

  const playNote = (frequency: number) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.start();
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const startGame = () => {
    setGameStatus('playing');
    setCurrentPattern([]);
    setUserPattern([]);
    setLevel(1);
    addToPattern();
  };

  const addToPattern = () => {
    const newPattern = [...currentPattern, Math.floor(Math.random() * 4)];
    setCurrentPattern(newPattern);
    playPattern(newPattern);
  };

  const playPattern = async (pattern: number[]) => {
    setIsPlaying(true);
    for (let i = 0; i < pattern.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      playNote(notes[pattern[i]].frequency);
    }
    setIsPlaying(false);
  };

  const handleNoteClick = (index: number) => {
    if (isPlaying || gameStatus !== 'playing') return;

    playNote(notes[index].frequency);
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);

    if (newUserPattern[newUserPattern.length - 1] !== currentPattern[newUserPattern.length - 1]) {
      setGameStatus('failed');
      return;
    }

    if (newUserPattern.length === currentPattern.length) {
      setUserPattern([]);
      setLevel(level + 1);
      setTimeout(() => {
        addToPattern();
      }, 1000);
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
            Music & Rhythm
          </motion.h1>
          
          <div className="space-y-8">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Memory Melody</h2>
              <div className="space-y-6">
                <div className="text-center">
                  {gameStatus === 'waiting' && (
                    <Button onClick={startGame}>Start Game</Button>
                  )}
                  {gameStatus === 'playing' && (
                    <div className="text-xl font-medium">Level: {level}</div>
                  )}
                  {gameStatus === 'failed' && (
                    <div className="space-y-4">
                      <div className="text-xl font-medium">Game Over! You reached level {level}</div>
                      <Button onClick={startGame}>Play Again</Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {notes.map((note, index) => (
                    <Button
                      key={index}
                      onClick={() => handleNoteClick(index)}
                      disabled={isPlaying || gameStatus !== 'playing'}
                      className={`h-24 ${note.color}`}
                    />
                  ))}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Coming Soon!</h2>
              <div className="text-gray-600">
                <p>More musical activities:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Virtual Piano</li>
                  <li>Rhythm Games</li>
                  <li>Song Creation</li>
                  <li>Music Theory Fun</li>
                </ul>
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Music;
