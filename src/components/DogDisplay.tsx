/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { DogCustomization } from './DogCustomizer';
import { Emotion } from '../utils/emotionAnalyzer';

interface DogDisplayProps {
  emotion: Emotion;
  customization: DogCustomization;
}

// Define simple emoji sequences for "idle" animation
const idleAnimationFrames: Record<DogCustomization['breed'], string[]> = {
  Shiba: ['🦊', '🦊✨'],
  'Golden Retriever': ['🐕', '🐕‍🦺'], // Using guide dog as alternate frame
  Husky: ['🐺', '🐺💤'], // Using sleeping face
  Poodle: ['🐩', '🐩🎀'], // Adding a bow
};

// Styled Components
const DisplayContainer = styled.div`
  padding: 1.5rem;
  background-color: #f0f9ff;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 2px solid rgba(255, 255, 255, 0.5);
  width: 280px;
  text-align: center;
`;

const DogName = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
`;

const EmojiFrame = styled.div`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: linear-gradient(to bottom right, white, #f3f4f6);
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
  border: 2px solid white;
  overflow: hidden;
`;

const EmojiSpan = styled(motion.span)`
  font-size: 5rem;
  display: inline-block;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

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
  const [currentFrameIndex, setCurrentFrameIndex] = useState(0);

  // Effect to cycle through animation frames
  useEffect(() => {
    const frames = idleAnimationFrames[customization.breed] || ['🐶']; // Default generic dog
    const intervalId = setInterval(() => {
      setCurrentFrameIndex(prevIndex => (prevIndex + 1) % frames.length);
    }, 1500); // Change frame every 1.5 seconds

    // Cleanup: clear interval when component unmounts or breed changes
    return () => clearInterval(intervalId);
  }, [customization.breed]); // Re-run effect only if breed changes

  // Get the current base emoji frame for the animation
  const baseAvatar = (idleAnimationFrames[customization.breed] || ['🐶'])[currentFrameIndex];

  const emotionModifier = getEmotionModifier(emotion);
  const emotionalAvatar = `${baseAvatar}${emotionModifier}`;
  const finalAvatar = applyAccessories(emotionalAvatar, customization.accessories);

  return (
    <DisplayContainer>
      <DogName>
        {customization.name}
      </DogName>
      <EmojiFrame>
        <AnimatePresence mode="wait">
          <EmojiSpan
            key={finalAvatar}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            {finalAvatar}
          </EmojiSpan>
        </AnimatePresence>
      </EmojiFrame>
    </DisplayContainer>
  );
};

export default DogDisplay; 