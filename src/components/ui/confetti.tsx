import React, { useState, useEffect } from 'react';
import ReactConfetti from 'react-confetti';

interface ConfettiProps {
  duration?: number;
}

export const Confetti: React.FC<ConfettiProps> = ({ duration = 3000 }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set dimensions
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    // Initial update
    updateDimensions();

    // Add listener for window resize
    window.addEventListener('resize', updateDimensions);

    // Set a timeout to hide the confetti after duration
    const timeout = setTimeout(() => {
      setIsVisible(false);
    }, duration);

    // Cleanup
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timeout);
    };
  }, [duration]);

  if (!isVisible) return null;

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={300}
      gravity={0.2}
      colors={[
        '#f44336', // red
        '#e91e63', // pink
        '#9c27b0', // purple
        '#673ab7', // deep purple
        '#3f51b5', // indigo
        '#2196f3', // blue
        '#03a9f4', // light blue
        '#00bcd4', // cyan
        '#009688', // teal
        '#4caf50', // green
        '#8bc34a', // light green
        '#cddc39', // lime
        '#ffeb3b', // yellow
        '#ffc107', // amber
        '#ff9800', // orange
        '#ff5722'  // deep orange
      ]}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 9999
      }}
    />
  );
}; 