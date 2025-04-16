/** @jsxImportSource @emotion/react */
import { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import DogDisplay from '../components/DogDisplay';
import MoodInput from '../components/MoodInput';
import MoodHistoryGraph from '../components/MoodHistory';
import DogCustomizer, { DogCustomization } from '../components/DogCustomizer';
import { useMoodHistory } from '../hooks/useMoodHistory';
import { useDogCustomization } from '../hooks/useDogCustomization';
import { Emotion } from '../utils/emotionAnalyzer';

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

const LeftPanel = styled.div<{ customization: DogCustomization }>`
  flex-shrink: 0;
  background-color: ${props => getBackgroundColorForBreed(props.customization.breed)}; 
  /* Ensure DogCustomizer internal bg doesn't conflict or set it transparent */
  transition: background-color 0.3s ease;
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

const RightInputPanel = styled.div<{ customization: DogCustomization }>`
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
`;

const MoodPupMain: React.FC = () => {
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const { moodHistory, addMoodEntry } = useMoodHistory();
  const { customization, updateCustomization } = useDogCustomization();

  const handleEmotionDetected = useCallback((emotion: Emotion, text: string) => {
    setCurrentEmotion(emotion);
    addMoodEntry({ text, emotion });
  }, [addMoodEntry]);

  const handleCustomizeUpdate = useCallback((newCustomization: DogCustomization) => {
    // console.log('[MoodPupMain] handleCustomizeUpdate called:', newCustomization);
    updateCustomization(newCustomization);
  }, [updateCustomization]);

  return (
    <MainContainer customization={customization}>
      <LeftPanel customization={customization}>
        <DogCustomizer
          onCustomize={handleCustomizeUpdate}
          initialCustomization={customization}
        />
      </LeftPanel>

      <CenterPanel customization={customization}>
        <TopCenterSection>
          <DogDisplayWrapper>
            <DogDisplay
              emotion={currentEmotion}
              customization={customization}
            />
          </DogDisplayWrapper>
        </TopCenterSection>

        <BottomGraphSection>
          <MoodHistoryGraph moodHistory={moodHistory} />
        </BottomGraphSection>
      </CenterPanel>

      <RightInputPanel customization={customization}>
        <MoodInput 
            onEmotionDetected={handleEmotionDetected} 
            customization={customization} 
        />
      </RightInputPanel>
    </MainContainer>
  );
};

export default MoodPupMain;