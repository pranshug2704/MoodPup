import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import { DogCustomization } from './DogCustomizer'; // Import the customization type
import { Emotion } from '../utils/emotionAnalyzer';

interface DogDisplayProps {
  emotion: Emotion;
  customization: DogCustomization;
}

// Helper to get base emoji based on breed
const getBaseEmoji = (breed: DogCustomization['breed']): string => {
  switch (breed) {
    case 'Shiba': return '🦊';
    case 'Golden Retriever': return '🐕';
    case 'Husky': return '🐺'; // Using wolf as proxy
    case 'Poodle': return '🐩';
    default: return '🐶'; // Generic dog
  }
};

// Helper to get emotion modifier (simple for now)
const getEmotionModifier = (emotion: Emotion): string => {
  switch (emotion) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'excited': return '🤩';
    case 'calm': return '😌';
    case 'anxious': return '😟';
    default: return '😐'; // Neutral
  }
};

// Helper to add accessory emojis
const applyAccessories = (base: string, accessories: string[]): string => {
  let final = base;
  if (accessories.includes('glasses')) final += '🕶️';
  if (accessories.includes('hat')) final += '🤠'; // Example hat
  if (accessories.includes('bandana')) final += '🧣'; // Example bandana
  if (accessories.includes('bow_tie')) final += '🎀'; // Example bow tie
  return final;
};

const DogDisplay: React.FC<DogDisplayProps> = ({ emotion, customization }) => {
  const baseAvatar = getBaseEmoji(customization.breed);
  const emotionModifier = getEmotionModifier(emotion);
  const emotionalAvatar = `${baseAvatar}${emotionModifier}`;
  const finalAvatar = applyAccessories(emotionalAvatar, customization.accessories);

  return (
    // Habitat Card Styling
    <div className="bg-pastel_accent p-6 rounded-2xl shadow-lg w-full max-w-[280px] mx-auto flex flex-col items-center text-center border-4 border-white border-opacity-50">
      {/* Dog Name */}
      <p className="text-xl font-semibold text-gray-700 mb-3">
        {customization.name}
      </p>
      {/* Circular Frame for Emoji */}
      <div className="w-40 h-40 sm:w-48 sm:h-48 bg-gradient-to-br from-white to-gray-100 rounded-full flex items-center justify-center shadow-inner mb-3 overflow-hidden border-2 border-white">
        <AnimatePresence mode="wait">
          <motion.span
            key={finalAvatar} // Key change triggers animation
            className="text-7xl sm:text-8xl drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }} // Custom ease for bounce
            style={{ display: 'inline-block' }}
          >
            {finalAvatar}
          </motion.span>
        </AnimatePresence>
      </div>
      {/* Optional: Emotion text - could be added here */}
      {/* <p className="text-sm text-gray-600 capitalize">Feeling: {emotion}</p> */}
    </div>
  );
};

export default DogDisplay; 