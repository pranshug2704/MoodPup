/** @jsxImportSource @emotion/react */
import { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import DogDisplay from '../components/DogDisplay';
import MoodInput from '../components/MoodInput';
import MoodHistoryGraph from '../components/MoodHistory';
import DogCustomizer, { DogCustomization } from '../components/DogCustomizer';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { useDogCustomization } from '../hooks/useDogCustomization';
import { Emotion } from '../utils/emotionAnalyzer';

// Import button images
import GearIconUrl from '../assets/customize_closed_gear.png';
import BrushIconUrl from '../assets/customize_open_dogbrush.png';

// Helper function for dynamic background color based on breed
const getBackgroundColorForBreed = (breed: DogCustomization['breed']): string => {
  switch (breed) {
    case 'Golden Retriever': return '#fdf6e3'; // Soft Hazel/Beige
    case 'Shiba': return '#ffe4c4'; // Soft Orange/Bisque
    case 'Husky': return '#e0f2fe'; // Soft Light Blue/Gray
    case 'Poodle': return '#fff5f7'; // Soft Pink/Lavender Blush
    default: return '#f8fafc'; // Default light gray (slate-50)
  }
};

// Define styled components
// Pass customization prop for dynamic styling
const MainContainer = styled.div<{ customization: DogCustomization }>`
  display: flex;
  min-height: 100vh;
  position: relative;
  background-color: ${props => {
    const breed = props.customization.breed;
    const color = getBackgroundColorForBreed(breed);
    console.log(`[MainContainer] Breed: ${breed}, Calculated BG Color: ${color}`); // DEBUG
    return color;
  }};
  /* background-color: magenta; */ /* Remove debug color */
  transition: background-color 0.3s ease;
`;

// New button positioned independently
const CustomizeToggleButton = styled.button`
  position: fixed; /* Or absolute relative to MainContainer */
  top: 1rem;
  left: 1.5rem; /* Adjusted offset further right */
  z-index: 50; /* Ensure it's above everything */
  /* background: rgba(255, 255, 255, 0.7); */ /* Remove background */
  background: transparent;
  /* backdrop-filter: blur(4px); */ /* Optional: remove filter if bg is transparent */
  border: none; /* Remove border */
  /* color: #374151; // gray-700 */ /* No text color needed */
  padding: 0; /* Remove padding */
  border-radius: 50%; /* Make it circular */
  width: 44px; /* Adjust size as needed */
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* font-size: 1.25rem; */ /* No font size needed */
  cursor: pointer;
  /* box-shadow: 0 2px 5px rgba(0,0,0,0.1); */ /* Optional: keep or remove shadow */
  transition: transform 0.2s ease;
  &:hover {
    /* background: rgba(255, 255, 255, 0.9); */ /* No hover background */
    /* Add subtle scale or other hover effect if desired */
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    /* object-fit: contain; */ /* Add object-fit */
    object-fit: cover; /* Use cover instead */
  }
`;

// LeftPanel no longer needs isCollapsed prop directly for its button
const LeftPanel = styled.div<{ customization: DogCustomization; isCollapsed: boolean }>`
  flex-shrink: 0;
  position: relative; /* Keep relative if needed for other internal positioning */
  width: ${props => props.isCollapsed ? '0' : '280px'}; /* Control width based on state */
  overflow: hidden; /* Hide content when collapsed */
  background-color: ${props => getBackgroundColorForBreed(props.customization.breed)}; 
  /* Ensure DogCustomizer internal bg doesn't conflict or set it transparent */
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const CenterPanel = styled.div<{ customization: DogCustomization }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => getBackgroundColorForBreed(props.customization.breed)};
  transition: background-color 0.3s ease;
`;

const TopCenterSection = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
`;

const DogDisplayWrapper = styled.div`
  /* Add specific styles if needed */
  /* Shift removed - dog position handled internally now */
  /* transform: translateX(-15px); */ 
`;

const BottomGraphSection = styled.div`
  width: 100%;
  height: 120px;
  box-sizing: border-box;
  position: relative;
`;

// Make RightInputPanel a motion component and add cursor styles
const RightInputPanel = styled(motion.div)<{ customization: DogCustomization }>`
  position: fixed;
  right: 1.5rem;
  top: 50%;
  transform: translateY(-50%);
  width: 250px;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
  border-radius: 0.75rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  z-index: 10;
  border: 1px solid rgba(0, 0, 0, 0.05);
  cursor: grab; /* Add grab cursor */
  &:active {
    cursor: grabbing; /* Change cursor while dragging */
  }
`;

// Helper function for bubble text
const getBubbleTextForEmotion = (emotion: Emotion): string => {
  switch (emotion) {
    case 'happy':
    case 'excited':
      return 'Woof! Woof!';
    case 'calm':
    case 'neutral':
      return 'Woof.';
    case 'anxious':
    case 'sad':
      return 'Whimper...';
    default:
      return '...';
  }
};

const MoodPupMain: React.FC = () => {
  // const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const { moodHistory, addMoodEntry } = useMoodHistory();
  const { customization, updateCustomization } = useDogCustomization();
  
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('');
  const bubbleTimeoutRef = useRef<number | null>(null);
  const [isCustomizerCollapsed, setIsCustomizerCollapsed] = useState(true); // Start collapsed

  const handleEmotionDetected = useCallback((emotion: Emotion, text: string) => {
    // setCurrentEmotion(emotion);
    addMoodEntry({ text, emotion });

    // --- Speech Bubble Logic ---
    // Clear any existing timeout
    if (bubbleTimeoutRef.current) {
      clearTimeout(bubbleTimeoutRef.current);
    }
    // Set text and show bubble
    setBubbleText(getBubbleTextForEmotion(emotion));
    setShowBubble(true);
    // Set timeout to hide bubble after 3 seconds
    bubbleTimeoutRef.current = setTimeout(() => {
      setShowBubble(false);
    }, 3000);

  }, [addMoodEntry]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (bubbleTimeoutRef.current) {
        clearTimeout(bubbleTimeoutRef.current);
      }
    };
  }, []);

  const handleCustomizeUpdate = useCallback((newCustomization: DogCustomization) => {
    updateCustomization(newCustomization);
  }, [updateCustomization]);

  // console.log('[MoodPupMain] Rendering with showBubble:', showBubble);

  const toggleCustomizer = () => setIsCustomizerCollapsed(!isCustomizerCollapsed);

  return (
    <MainContainer customization={customization}>
      {/* Always visible toggle button */}
      <CustomizeToggleButton onClick={toggleCustomizer} title={isCustomizerCollapsed ? "Open Customizer" : "Close Customizer"}>
        <img src={isCustomizerCollapsed ? GearIconUrl : BrushIconUrl} alt={isCustomizerCollapsed ? "Open Customizer" : "Close Customizer"} />
      </CustomizeToggleButton>

      <LeftPanel customization={customization} isCollapsed={isCustomizerCollapsed}>
        <DogCustomizer
          onCustomize={handleCustomizeUpdate}
          initialCustomization={customization}
        />
      </LeftPanel>

      <CenterPanel customization={customization}>
        <TopCenterSection>
          <DogDisplayWrapper>
            <DogDisplay
              customization={customization}
              showBubble={showBubble}
              bubbleText={bubbleText}
            />
          </DogDisplayWrapper>
        </TopCenterSection>

        <BottomGraphSection>
          <MoodHistoryGraph moodHistory={moodHistory} />
        </BottomGraphSection>
      </CenterPanel>

      <RightInputPanel 
        customization={customization}
        drag // Enable dragging
        dragMomentum={false} // Disable momentum
      >
        <MoodInput 
            onEmotionDetected={handleEmotionDetected} 
            customization={customization} 
        />
      </RightInputPanel>
    </MainContainer>
  );
};

export default MoodPupMain;