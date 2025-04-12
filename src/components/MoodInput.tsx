import React, { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import { analyzeEmotion, Emotion } from '../utils/emotionAnalyzer';

interface MoodInputProps {
  onEmotionDetected: (emotion: Emotion, text: string) => void;
}

const MoodInput: React.FC<MoodInputProps> = ({ onEmotionDetected }) => {
  const [text, setText] = useState('');

  const triggerSubmit = () => {
    if (!text.trim()) return;
    const detectedEmotion = analyzeEmotion(text);
    onEmotionDetected(detectedEmotion, text);
    setText('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    triggerSubmit();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      triggerSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="How do you feel?"
        rows={3}
        style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}
      />
      <motion.button
        type="submit"
        disabled={!text.trim()}
        whileHover={{ scale: text.trim() ? 1.03 : 1 }}
        whileTap={{ scale: text.trim() ? 0.97 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
        style={{
          width: '100%', 
          padding: '0.75rem 1.5rem', 
          background: '#0d9488',
          color: 'white', 
          border: 'none', 
          borderRadius: '0.75rem', 
          cursor: 'pointer',
          fontWeight: 600,
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          opacity: !text.trim() ? 0.6 : 1,
        }}
      >
        <span>Tell MoodPup</span>
        <span>🐾</span>
      </motion.button>
    </form>
  );
};

export default MoodInput; 