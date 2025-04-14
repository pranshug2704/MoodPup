/** @jsxImportSource @emotion/react */
import { useState, KeyboardEvent } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { analyzeEmotion, Emotion } from '../utils/emotionAnalyzer';
import { DogCustomization } from '../components/DogCustomizer';

interface MoodInputProps {
  onEmotionDetected: (emotion: Emotion, text: string) => void;
  customization: DogCustomization;
}

// Utility to darken hex color for hover (basic example)
const darkenColor = (color: string, amount: number = 20): string => {
  let usePound = false;
  if (color[0] == "#") {
    color = color.slice(1);
    usePound = true;
  }
  const num = parseInt(color, 16);
  let r = (num >> 16) - amount;
  let b = ((num >> 8) & 0x00FF) - amount;
  let g = (num & 0x0000FF) - amount;
  if (r < 0) r = 0;
  if (b < 0) b = 0;
  if (g < 0) g = 0;
  return (usePound ? "#" : "") + String("000000" + (g | (b << 8) | (r << 16)).toString(16)).slice(-6);
};

// Styled Components
const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem; // Replaces margin-bottom on textarea
  box-sizing: border-box;
`;

const StyledTextarea = styled.textarea<{ accentColor: string }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db; // gray-300
  border-radius: 0.75rem; // rounded-xl
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); // shadow-sm
  background-color: white;
  resize: none;
  font-family: inherit;
  font-size: 1rem;
  color: #374151; // gray-700
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${props => props.accentColor};
    box-shadow: 0 0 0 2px ${props => props.accentColor}4D; /* Use 4D for ~30% alpha */
  }

  &::placeholder {
    color: #9ca3af; // gray-400
  }
`;

const SubmitButton = styled(motion.button)<{ accentColor: string }>`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.accentColor};
  color: white;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s ease;
  box-sizing: border-box;

  &:hover:not(:disabled) {
    background-color: ${props => darkenColor(props.accentColor, 15)}; // Darken by 15
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.accentColor}66; /* Use 66 for ~40% alpha */
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const MoodInput: React.FC<MoodInputProps> = ({ onEmotionDetected, customization }) => {
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
    <InputForm onSubmit={handleSubmit}>
      <StyledTextarea
        accentColor={customization.color}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="How do you feel?"
        rows={3}
      />
      <SubmitButton
        accentColor={customization.color}
        type="submit"
        disabled={!text.trim()}
        whileHover={{ scale: text.trim() ? 1.03 : 1 }}
        whileTap={{ scale: text.trim() ? 0.97 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <span>Tell MoodPup</span>
        <span>🐾</span>
      </SubmitButton>
    </InputForm>
  );
};

export default MoodInput; 