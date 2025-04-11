import React, { useState } from 'react';
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
    <form onSubmit={handleSubmit} className="w-full max-w-md p-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="How are you feeling today?"
        rows={4}
        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 mb-4 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
      />
      <button
        type="submit"
        className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Tell MoodPup
      </button>
    </form>
  );
};

export default MoodInput; 