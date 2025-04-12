import React, { useState, useEffect } from 'react';
import DogDisplay from '../components/DogDisplay';
import MoodInput from '../components/MoodInput';
import MoodHistoryGraph from '../components/MoodHistory';
import DogCustomizer, { DogCustomization } from '../components/DogCustomizer';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { useDogCustomization } from '../hooks/useDogCustomization';
import { Emotion } from '../utils/emotionAnalyzer';

const MoodPupMain: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [reactionTrigger, setReactionTrigger] = useState(0);
  const { moodHistory, addMoodEntry } = useMoodHistory();
  const { customization, updateCustomization } = useDogCustomization();

  const handleEmotionDetected = (emotion: Emotion, text: string) => {
    setCurrentEmotion(emotion);
    addMoodEntry({ text, emotion });
    setReactionTrigger(prev => prev + 1);
  };

  const handleCustomizeUpdate = (newCustomization: DogCustomization) => {
    updateCustomization(newCustomization);
  };

  // Unified background color
  const unifiedBgColor = '#f8fafc'; // Example: Very light gray (Tailwind slate-50)

  const mainStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '100vh',
    position: 'relative', 
    backgroundColor: unifiedBgColor, // Apply unified background
  };

  const leftPanelStyle: React.CSSProperties = {
    flexShrink: 0,
    backgroundColor: unifiedBgColor, // Apply unified background
    // Note: DogCustomizer itself might have its own background set internally, needs checking/overriding if necessary
  };

  const centerPanelStyle: React.CSSProperties = {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: unifiedBgColor, // Apply unified background
  };

  const topCenterStyle: React.CSSProperties = {
    flexGrow: 1, 
    display: 'flex',
    alignItems: 'center', 
    justifyContent: 'center', // Just center the dog display now
    padding: '2rem',
    // Removed gap
  };

  const dogDisplayContainerStyle: React.CSSProperties = {
    // No changes needed
  };

  // Styles for the input container fixed to the right
  const moodInputContainerStyle: React.CSSProperties = {
    position: 'fixed',
    right: '1.5rem', 
    top: '50%',
    transform: 'translateY(-50%)',
    width: '250px',
    padding: '1rem',
    background: 'rgba(241, 245, 249, 0.8)', // Match unified background (slate-100) with slight transparency
    backdropFilter: 'blur(4px)',
    borderRadius: '0.75rem', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)', 
    zIndex: 10,
  };

  const bottomGraphStyle: React.CSSProperties = {
    width: '100%',
    height: '120px',
    padding: '0',
    boxSizing: 'border-box',
    position: 'relative',
    // No background set here - graph component handles its own gradient
  };

  return (
    <div style={mainStyle}>
      {/* Left Panel */}
      <div style={leftPanelStyle}>
        <DogCustomizer
          onCustomize={handleCustomizeUpdate}
          initialCustomization={customization}
        />
      </div>

      {/* Center Panel (Dog + Graph) */} 
      <div style={centerPanelStyle}>
        {/* Top section (Pup ONLY) */}
        <div style={topCenterStyle}>
          <div style={dogDisplayContainerStyle}>
            <DogDisplay 
              emotion={currentEmotion} 
              customization={customization} 
              reactionTrigger={reactionTrigger} 
            />
          </div>
          {/* MoodInput is now positioned absolutely */} 
        </div>
        
        {/* Bottom section (Graph) */}
        <div style={bottomGraphStyle}>
          <MoodHistoryGraph moodHistory={moodHistory} />
        </div>
      </div>

      {/* Right Input Panel (Positioned Absolutely) */}
      <div style={moodInputContainerStyle}>
        <MoodInput onEmotionDetected={handleEmotionDetected} />
      </div>
    </div>
  );
};

export default MoodPupMain; 