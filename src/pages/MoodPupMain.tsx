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

  @media (max-width: 768px) {
    flex-direction: column;
  }
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

  @media (max-width: 768px) {
    position: fixed; /* Take out of flow */
    top: 0;
    left: 0;
    height: calc(100% - 140px); /* Stop above graph */
    z-index: 40; /* Below toggle button */
    /* Adjust width for mobile overlay */
    width: ${props => props.isCollapsed ? '0' : '72%'}; 
    border-right: ${props => props.isCollapsed ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'}; /* Add border when open */
    box-shadow: ${props => props.isCollapsed ? 'none' : '4px 0px 15px rgba(0,0,0,0.1)'}; /* Add shadow when open */
    cursor: grabbing;
  }
`;

const CenterPanel = styled.div<{ customization: DogCustomization }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  background-color: ${props => getBackgroundColorForBreed(props.customization.breed)};
  transition: background-color 0.3s ease;
  /* Ensure it takes full width on mobile if MainContainer is column */
  width: 100%; 
`;

const TopCenterSection = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem; /* Reduce padding on mobile */
    /* flex-grow: 0; */ /* Revert this change */
    /* align-items: center; */ /* Remove vertical alignment */
  }
`;

const DogDisplayWrapper = styled.div`
  /* Add specific styles if needed */
  /* Shift removed - dog position handled internally now */
  /* transform: translateX(-15px); */ 
  position: relative;

  @media (max-width: 768px) {
    height: 80px; /* Further reduce height on mobile */
  }
`;

const BottomGraphSection = styled.div`
  width: 100%;
  height: 120px;
  box-sizing: border-box;
  position: relative;

  @media (max-width: 768px) {
    height: 100px; /* Reduce height on mobile */
  }
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

  @media (max-width: 768px) {
    position: static; /* Change from fixed */
    transform: none; /* Remove Y transform */
    width: 90%; /* Make it responsive */
    max-width: 400px; /* Optional max-width */
    margin: 1rem auto; /* Reduce vertical margin */
    right: auto;
    top: auto;
    backdrop-filter: none; /* Remove blur on mobile? */
    background: rgba(255, 255, 255, 0.8); /* Adjust background */
    z-index: auto;
    cursor: default; /* Disable grab cursor on mobile */
    &:active {
      cursor: default;
    }
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
  const leftPanelRef = useRef<HTMLDivElement>(null); // Ref for the panel
  const toggleButtonRef = useRef<HTMLButtonElement>(null); // Ref for the toggle button

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

  // Effect to handle clicking outside the panel on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click is outside the panel AND outside the toggle button
      if (
        leftPanelRef.current &&
        !leftPanelRef.current.contains(event.target as Node) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target as Node)
      ) {
        // Only close if it's currently open
        if (!isCustomizerCollapsed) {
           setIsCustomizerCollapsed(true);
        }
      }
    };

    // Check if we are on mobile and the panel is open
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    // Add listener only when the panel is open AND on mobile
    if (!isCustomizerCollapsed && isMobile) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      // Remove listener if panel is closed or becomes closed, or if not on mobile
      document.removeEventListener('mousedown', handleClickOutside);
    }

    // Cleanup listener on component unmount or when state/media query changes
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    // Add isCustomizerCollapsed to dependency array
    // We don't strictly need to add isMobile as a dependency here,
    // as the listener is removed/added correctly based on isCustomizerCollapsed alone,
    // but it's good practice to include variables used in the effect logic.
    // However, adding window.matchMedia directly can cause issues.
    // A more robust solution might involve a dedicated resize listener hook,
    // but this check on effect run should cover most cases.
  }, [isCustomizerCollapsed]); // Rerun effect if collapsed state changes

  return (
    <MainContainer customization={customization}>
      {/* Always visible toggle button */}
      <CustomizeToggleButton 
        ref={toggleButtonRef} // Add ref
        onClick={toggleCustomizer} 
        title={isCustomizerCollapsed ? "Open Customizer" : "Close Customizer"}
      >
        <img src={isCustomizerCollapsed ? GearIconUrl : BrushIconUrl} alt={isCustomizerCollapsed ? "Open Customizer" : "Close Customizer"} />
      </CustomizeToggleButton>

      <LeftPanel 
        ref={leftPanelRef} // Add ref
        customization={customization} 
        isCollapsed={isCustomizerCollapsed}
      >
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