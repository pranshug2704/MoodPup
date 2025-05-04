/** @jsxImportSource @emotion/react */
import { useState, useEffect, useCallback, useRef } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';
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
import SuggestionsIconUrl from '../assets/suggestions.png'; // Import suggestions icon

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

// Suggestions Button (Top Right) - Back to button
const SuggestionsButton = styled.button`
  position: fixed;
  top: 1.1rem; /* Match customize button top */
  right: 1.5rem; /* Position on the right */
  z-index: 50; /* Ensure it's above everything */
  background: transparent;
  border: none;
  padding: 0;
  border-radius: 50%; /* Make it circular */
  width: 44px; /* Match customize button size */
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
  &:active {
    transform: scale(0.95);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover; /* Or contain, depending on image aspect ratio */
  }
`;

// LeftPanel no longer needs isCollapsed prop directly for its button
const LeftPanel = styled.div<{ customization: DogCustomization; isCollapsed: boolean }>`
  flex-shrink: 0;
  position: relative; /* Keep relative if needed for other internal positioning */
  width: ${props => props.isCollapsed ? '0' : '280px'}; /* Control width based on state */
  /* overflow: hidden; */ /* Hide content when collapsed */
  overflow-y: auto; /* Allow vertical scrolling */
  overflow-x: hidden; /* Prevent horizontal scrolling */
  background-color: ${props => getBackgroundColorForBreed(props.customization.breed)}; 
  /* Ensure DogCustomizer internal bg doesn't conflict or set it transparent */
  transition: width 0.3s ease, background-color 0.3s ease;

  @media (max-width: 768px) {
    position: fixed; /* Take out of flow */
    top: 0;
    left: 0;
    height: calc(81.5%); /* Stop above graph */
    z-index: 40; /* Below toggle button */
    /* Adjust width for mobile overlay */
    width: ${props => props.isCollapsed ? '0' : '72%'}; 
    border-right: ${props => props.isCollapsed ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'}; /* Add border when open */
    box-shadow: ${props => props.isCollapsed ? 'none' : '4px 0px 15px rgba(0,0,0,0.1)'}; /* Add shadow when open */
    cursor: grabbing;
  }
`;

// Restore previous CenterPanel layout
const CenterPanel = styled.div<{ customization: DogCustomization }>`
  flex-grow: 1;
  display: flex;
  flex-direction: column; // Restore column direction
  align-items: center; // Keep desktop alignment
  justify-content: flex-start; // Restore start justification
  /* justify-content: center; */ // Remove center justification
  background-color: ${props => getBackgroundColorForBreed(props.customization.breed)};
  transition: background-color 0.3s ease;
  width: 100%; 

  @media (max-width: 768px) {
    /* flex-grow: 0; */ // Remove this mobile override
    /* No specific mobile overrides needed here now */
  }
`;

const TopCenterSection = styled.div`
  flex-grow: 1; // Restore flex-grow to push graph down
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%; // Ensure it takes width within CenterPanel
  position: relative;

  @media (max-width: 768px) {
    padding: 1rem; /* Reduce padding on mobile */
    flex-grow: 1; // Keep flex-grow on mobile too
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
    height: 80px; /* Further reduce height on mobile */
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

// Suggestion Panel Styles
const PanelOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 55; /* Above other elements but below panel */
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SuggestionPanel = styled(motion.div)`
  background: white;
  padding: 1.5rem 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  z-index: 60;
  position: relative; // For positioning close button
`;

const PanelTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #374151;
`;

const SuggestionTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box;
  margin-bottom: 1rem;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: #a5b4fc; // Use a neutral focus color
    box-shadow: 0 0 0 2px #a5b4fc66;
  }
`;

const PanelButton = styled(motion.button)`
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.5rem;
  background-color: #8b5cf6; // Purple-500
  color: white;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
  &:hover {
    background-color: #7c3aed; // Purple-600
  }
`;

const ClosePanelButton = styled.button`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #9ca3af; // Gray-400
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
  &:hover {
    color: #6b7280; // Gray-500
  }
`;

// --- End Suggestion Panel Styles ---

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
  const [isSuggestionPanelOpen, setIsSuggestionPanelOpen] = useState(false);
  const [suggestionText, setSuggestionText] = useState('');
  const [isSubmittingSuggestion, setIsSubmittingSuggestion] = useState(false);

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

  // --- Suggestion Panel Logic ---
  const toggleSuggestionPanel = () => {
    setIsSuggestionPanelOpen(!isSuggestionPanelOpen);
    // Clear text when opening
    if (!isSuggestionPanelOpen) {
        setSuggestionText('');
    }
  };

  const handleSuggestionSubmit = async () => {
    if (suggestionText.trim()) {
      setIsSubmittingSuggestion(true);
      const endpoint = 'https://formspree.io/f/movdvkor';
      const payload = {
        suggestion: suggestionText,
      };

      try {
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          alert("Suggestion sent successfully! Thank you!");
          setSuggestionText('');
          setIsSuggestionPanelOpen(false);
        } else {
          // Try to get error message from Formspree response if possible
          const errorData = await response.json().catch(() => ({})); // Catch if response isn't JSON
          const errorMessage = errorData?.error || `Form submission failed (Status: ${response.status}). Please try again.`;
          console.error("Formspree error:", errorData);
          alert(errorMessage);
        }
      } catch (error) {
        console.error("Network error submitting suggestion:", error);
        alert("Could not send suggestion due to a network error. Please check your connection and try again.");
      } finally {
        setIsSubmittingSuggestion(false);
      }
    } else {
      alert("Please enter a suggestion before submitting.");
    }
  };
  // --- End Suggestion Panel Logic ---

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

      {/* Suggestions Button */}
      <SuggestionsButton title="Send Suggestion" onClick={toggleSuggestionPanel}>
        <img src={SuggestionsIconUrl} alt="Send Suggestion" />
      </SuggestionsButton>

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

      {/* Center Panel (Restored Structure) */}
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
        {/* Bottom Graph Section (Moved back inside CenterPanel) */}
        {/* Note: This requires CenterPanel to be flex-direction: column */}
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

      {/* Suggestion Panel Modal */}
      <AnimatePresence>
        {isSuggestionPanelOpen && (
          <PanelOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SuggestionPanel
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <ClosePanelButton onClick={toggleSuggestionPanel}>&times;</ClosePanelButton>
              <PanelTitle>Suggestions</PanelTitle>
              <SuggestionTextarea
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder="Enter your suggestion here..."
              />
              <PanelButton 
                onClick={handleSuggestionSubmit}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmittingSuggestion}
              >
                {isSubmittingSuggestion ? 'Sending...' : 'Submit'}
              </PanelButton>
            </SuggestionPanel>
          </PanelOverlay>
        )}
      </AnimatePresence>
    </MainContainer>
  );
};

export default MoodPupMain;