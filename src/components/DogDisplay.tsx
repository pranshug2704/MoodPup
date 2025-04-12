import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import { DogCustomization } from './DogCustomizer'; // Import the customization type
import { Emotion } from '../utils/emotionAnalyzer';

interface DogDisplayProps {
  emotion: Emotion;
  customization: DogCustomization;
  reactionTrigger: number; // Add prop to trigger animation
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

const DogDisplay: React.FC<DogDisplayProps> = ({ emotion, customization, reactionTrigger }) => {
  const baseAvatar = getBaseEmoji(customization.breed);
  const emotionModifier = getEmotionModifier(emotion);
  const emotionalAvatar = `${baseAvatar}${emotionModifier}`;
  const finalAvatar = applyAccessories(emotionalAvatar, customization.accessories);

  return (
    // Wrap in motion.div for reaction animation
    <motion.div
      key={reactionTrigger} // Change key to re-trigger animation
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.05, 1] }} // Simple pulse animation
      transition={{ duration: 0.3 }}
    >
      <div style={{ textAlign: 'center' /* Basic centering */ }}>
        <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>{customization.name}</p>
        <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: '#eee', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            <motion.span
              key={finalAvatar}
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.3, ease: [0.17, 0.67, 0.83, 0.67] }}
              style={{ display: 'inline-block', fontSize: '4rem' /* Adjusted size */ }}
            >
              {finalAvatar}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default DogDisplay; 