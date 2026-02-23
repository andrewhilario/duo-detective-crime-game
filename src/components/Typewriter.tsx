"use client";
import React, { useState, useEffect, useRef } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30, className = '', onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const completedRef = useRef(false);

  // Reset when text changes
  useEffect(() => {
    setDisplayedText('');
    setCurrentIndex(0);
    completedRef.current = false;
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed + (Math.random() * 20)); // Add slight randomization for realistic typing
      return () => clearTimeout(timeout);
    } else if (currentIndex === text.length && !completedRef.current) {
      completedRef.current = true;
      if (onComplete) onComplete();
    }
  }, [currentIndex, text, speed, onComplete]);

  return (
    <span className={`${className} font-mono`}>
      {displayedText}
      {currentIndex < text.length && <span className="animate-pulse bg-red-500 w-2 h-4 inline-block ml-1 align-middle"></span>}
    </span>
  );
};
