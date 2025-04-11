import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { analyzeEmotion, Emotion } from '../utils/emotionAnalyzer';

interface MoodInputProps {
  onEmotionDetected: (emotion: Emotion, text: string) => void;
}

const MoodInput: React.FC<MoodInputProps> = ({ onEmotionDetected }) => {
  const [text, setText] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!text.trim()) return; // Don't submit empty input

    const detectedEmotion = analyzeEmotion(text);
    onEmotionDetected(detectedEmotion, text);
    setText(''); // Clear the input after submission
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type how you feel... 🐶"
        rows={3}
        className="w-full p-3 border border-gray-200 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand_teal/60 focus:border-transparent resize-none placeholder-gray-400 text-gray-700 transition-shadow duration-200 focus:shadow-md"
      />
      <motion.button
        type="submit"
        className="w-full px-6 py-3 bg-brand_teal text-white font-semibold text-lg rounded-xl shadow hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-brand_teal focus:ring-offset-2 flex items-center justify-center space-x-2 disabled:opacity-50"
        disabled={!text.trim()}
        whileHover={{ scale: text.trim() ? 1.03 : 1 }}
        whileTap={{ scale: text.trim() ? 0.97 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <span>Tell MoodPup</span>
        <span>🐾</span>
      </motion.button>
    </form>
  );
};

export default MoodInput; 