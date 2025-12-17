// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const TypingAnimation = ({ text, speed = 30, delay = 0, className = "" }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    // Start animation after delay
    const startTimer = setTimeout(() => {
      setStarted(true);
    }, delay);

    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (text) {
      if (!started || currentIndex >= text.length) return;

      const typingTimer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(typingTimer);
    }
  }, [currentIndex, text, speed, started]);

  return (
    <div className={className}>
      {displayedText}
      {currentIndex < text?.length && (
        <motion.span
          className="inline-block w-[2px] h-6 bg-green-600 ml-1 align-middle"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default TypingAnimation;
