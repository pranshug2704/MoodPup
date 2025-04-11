import React, { useState } from 'react';
import DogDisplay from '../components/DogDisplay';
import MoodInput from '../components/MoodInput';
import MoodHistory from '../components/MoodHistory';
import DogCustomizer, { DogCustomization } from '../components/DogCustomizer';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { useDogCustomization } from '../hooks/useDogCustomization';
import { Emotion } from '../utils/emotionAnalyzer';

const MoodPupMain: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const { moodHistory, addMoodEntry } = useMoodHistory();
  const { customization, updateCustomization } = useDogCustomization();
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  const handleEmotionDetected = (emotion: Emotion, text: string) => {
    setCurrentEmotion(emotion);
    addMoodEntry({ text, emotion });
  };

  const handleCustomizeSave = (newCustomization: DogCustomization) => {
    updateCustomization(newCustomization);
    setIsCustomizerOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-pastel_bg font-sans text-gray-800">
      <div className="w-full max-w-md md:max-w-lg relative">
        <button
          onClick={() => setIsCustomizerOpen(true)}
          className="absolute -top-2 -right-2 sm:top-4 sm:right-4 p-2 bg-brand_pink text-white rounded-full shadow-md hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-transform hover:scale-110 z-10"
          aria-label="Customize MoodPup"
        >
          <span className="text-xl">🎨</span>
        </button>

        <div className="bg-white/80 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl space-y-6 sm:space-y-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-700 flex items-center justify-center gap-2">
             <span>🐾</span> MoodPup <span>🐾</span>
          </h1>
          
          <div className="flex justify-center">
            <DogDisplay emotion={currentEmotion} customization={customization} />
          </div>

          <div className="w-full flex justify-center px-2 sm:px-0">
            <MoodInput onEmotionDetected={handleEmotionDetected} />
          </div>

          <div className="w-full flex justify-center px-2 sm:px-0">
            <MoodHistory moodHistory={moodHistory} />
          </div>
        </div>
      </div>

      <DogCustomizer
        isOpen={isCustomizerOpen}
        onClose={() => setIsCustomizerOpen(false)}
        onCustomize={handleCustomizeSave}
        initialCustomization={customization}
      />
    </div>
  );
};

export default MoodPupMain; 