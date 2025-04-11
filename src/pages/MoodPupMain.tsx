import React, { useState } from 'react';
import DogDisplay from '../components/DogDisplay';
import MoodInput from '../components/MoodInput';
import MoodHistory from '../components/MoodHistory';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { Emotion } from '../utils/emotionAnalyzer';

const MoodPupMain: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const { moodHistory, addMoodEntry } = useMoodHistory();

  const handleEmotionDetected = (emotion: Emotion, text: string) => {
    setCurrentEmotion(emotion);
    addMoodEntry({ text, emotion });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">MoodPup</h1>

      {/* Dog Display Area */}
      <div className="mb-8">
        <DogDisplay emotion={currentEmotion} />
      </div>

      {/* Input Area */}
      <div className="w-full flex justify-center mb-8">
        <MoodInput onEmotionDetected={handleEmotionDetected} />
      </div>

      {/* History Area */}
      <div className="w-full flex justify-center">
        <MoodHistory moodHistory={moodHistory} />
      </div>
    </div>
  );
};

export default MoodPupMain; 