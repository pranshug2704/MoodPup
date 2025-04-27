/** @jsxImportSource @emotion/react */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { DogCustomization } from './DogCustomizer';
// import { Emotion } from '../utils/emotionAnalyzer'; // Remove unused import

// Import PNG Images (Vite returns the URL)
import shibaImageUrl from '../assets/Shiba.png';
import retrieverImageUrl from '../assets/Retriever.png';
import huskyImageUrl from '../assets/Husky.png';
import poodleImageUrl from '../assets/Poodle.png';
import bandanaImageUrl from '../assets/Bandana.png';
import glassesImageUrl from '../assets/Glasses.png';
import hatImageUrl from '../assets/Hat.png';
import bowtieImageUrl from '../assets/Bowtie.png';
// Import Scarf image
import scarfImageUrl from '../assets/Scarf.png'; // New import
// Add a default/fallback image import if desired
// import defaultDogImageUrl from '../assets/DefaultDog.png';

// Background Image Imports
import parkImageUrl from '../assets/park_day.png';
import roomImageUrl from '../assets/cozy_room.png';
import starsImageUrl from '../assets/starry_night.png';
import hillsImageUrl from '../assets/sunset_hills.png';

interface DogDisplayProps {
  // emotion: Emotion; // Remove unused prop
  customization: DogCustomization;
  showBubble: boolean;
  bubbleText: string;
}

// Map breed names to PNG image URLs
const breedImageMap: Record<DogCustomization['breed'], string> = {
  Shiba: shibaImageUrl,
  'Golden Retriever': retrieverImageUrl,
  Husky: huskyImageUrl,
  Poodle: poodleImageUrl,
};

// Map accessory names to PNG image URLs
const accessoryImageMap: Record<string, string> = {
  scarf: scarfImageUrl, // Rename bandana -> scarf, update variable
  glasses: glassesImageUrl,
  hat: hatImageUrl,
  bow_tie: bowtieImageUrl,
};

// Map background IDs to Image URLs
const backgroundUrlMap: Record<string, string> = {
  park_day: parkImageUrl,
  cozy_room: roomImageUrl,
  starry_night: starsImageUrl,
  sunset_hills: hillsImageUrl,
};

// --- Helper Functions ---

// ** EDIT THESE OFFSETS FOR PRECISION **
// Returns { x: pixelOffset, y: pixelOffset }
const getBreedOffset = (breed: DogCustomization['breed']) => {
  switch (breed) {
    case 'Golden Retriever': return { x: -89, y: -80 }; // Assume this is the reference
    case 'Shiba': return { x: -86, y: -90 }; // Example: Move slightly right, slightly up
    case 'Husky': return { x: -72, y: -90 }; // Example: Move slightly down
    case 'Poodle': return { x: -75, y: -90 }; // Example: Move slightly left, slightly up
    default: return { x: 0, y: 0 };
  }
};

// --- Styled Components ---
const DisplayContainer = styled.div<{ backgroundId: string; accentColor: string }>`
  padding: 1.5rem;
  /* background-color: #f0f9ff; */ /* Remove static background color */
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15); /* Slightly stronger shadow */
  border: 3px solid ${props => props.accentColor}cc; /* Use accent color for border (slightly transparent) */
  width: 280px;
  text-align: center;
  position: relative;
  overflow: hidden; /* Hide parts of bg image that extend past border-radius */

  /* Apply background image */
  background-image: url(${props => backgroundUrlMap[props.backgroundId] || parkImageUrl}); /* Default to park */
  background-size: cover;
  background-position: center;
  transition: background-image 0.3s ease-in-out;
`;

const DogName = styled.p`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #374151;
`;

// Rename SvgFrame -> ImageFrame
const ImageFrame = styled.div`
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Apply breed-specific offset via positioning
const BaseImageWrapper = styled(motion.div)<{ breed: DogCustomization['breed'] }>`
  position: absolute; /* Use absolute positioning */
  width: 100%; /* Adjust as needed */
  height: 100%; /* Adjust as needed */
  /* Remove flex centering */
  /* display: flex; */
  /* align-items: center; */
  /* justify-content: center; */
  /* Transform removed */
  img {
    display: block;
    position: absolute; /* Allow positioning img within wrapper */
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%); /* Center image itself */
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

// Remove Generic AccessoryImageWrapper
// const AccessoryImageWrapper = styled(motion.div)` ... `;

// --- Accessory-Specific Styled Wrappers --- 
// Base styles for all accessory wrappers
const AccessoryWrapperBase = styled(motion.div)`
  position: absolute;
  pointer-events: none; // Allow clicks through to base image if needed
  display: flex; 
  align-items: center;
  justify-content: center;
  img {
    display: block;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

// ** EDIT THESE VALUES FOR PRECISION **
const HatWrapper = styled(AccessoryWrapperBase)`
  width: 50%; // Example size
  height: auto;
  top: -8%; /* Adjusted from -12% */
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;

const GlassesWrapper = styled(AccessoryWrapperBase)`
  width: 60%;
  height: auto;
  top: 35%; 
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

// Update BandanaWrapper to ScarfWrapper
const ScarfWrapper = styled(AccessoryWrapperBase)<{ breed: DogCustomization['breed'] }>`
  /* Base size for Shiba/Husky */
  width: 70%; 
  height: auto;
  bottom: 10%;
  left: 47%;
  transform: translateX(-50%);
  z-index: 2;

  /* Adjust size for specific breeds */
  ${props => (props.breed === 'Poodle' || props.breed === 'Golden Retriever') && `
    width: 60%; /* Make slightly smaller for Poodle/Retriever */
    /* Alternatively, could use transform: scale(0.9); */
    /* Adjust position slightly if needed due to size change */
    /* bottom: 11%; */ 
    /* left: 39%; */
  `}
`;

const BowtieWrapper = styled(AccessoryWrapperBase)`
  width: 30%;
  height: auto;
  bottom: 30%; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
`;
// --- End Accessory-Specific Wrappers --- 

// Speech Bubble Styled Component - Remove positioning styles
const SpeechBubble = styled(motion.div)<{ accentColor: string }>`
  position: absolute; /* Keep absolute */
  /* Remove top, right, transform - will be set via inline style */
  background-color: ${props => props.accentColor};
  color: ${props => {
      // Basic luminance check (adjust threshold as needed)
      const hex = props.accentColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      return luminance > 0.5 ? '#374151' : '#ffffff'; // Dark text on light bg, White text on dark bg
    }};
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  box-shadow: -2px 2px 5px rgba(0,0,0,0.15);
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 10;
  /* Keep pointer-events: none; ? Maybe not if inside frame now */

  /* Triangle Tail pointing right */
  &::after {
    content: '';
    position: absolute;
    top: 50%; 
    left: 100%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid ${props => props.accentColor};
  }
`;

const DogDisplay: React.FC<DogDisplayProps> = ({ 
  // emotion, // Remove from destructuring
  customization, 
  showBubble, 
  bubbleText 
}) => {
  const breedImageUrl = breedImageMap[customization.breed] || shibaImageUrl;
  const offset = getBreedOffset(customization.breed);
  
  // Base position calculation (relative to ImageFrame center)
  const baseTop = `calc(50% + ${offset.y}px)`;
  const baseLeft = `calc(50% + ${offset.x}px)`;
  
  // Style for the dog image wrapper
  const imagePositionStyle = {
      top: baseTop,
      left: baseLeft,
      transform: `translate(-50%, -50%)` 
  };
  
  // Style for the bubble (position relative to dog's center, then shift left)
  const bubblePositionStyle = {
      top: baseTop, 
      left: baseLeft,
      // Translate bubble up by 50% of its height (center vertically)
      // Translate bubble left by 50% of dog width + 100% of bubble width + gap
      // Using fixed pixel estimate for simplicity, adjust as needed:
      transform: `translate(calc(-80% - -20px), 140%)` 
      // Alternative: use percentages relative to wrapper if sizes are known
      // transform: `translate(-110%, -50%)` // Example % adjustment
  };

  return (
    <DisplayContainer 
      backgroundId={customization.background}
      accentColor={customization.color} // Pass accent color
    >
      <DogName>{customization.name}</DogName>
      <ImageFrame>
        {/* Base Image */} 
        <AnimatePresence>
          <BaseImageWrapper
            key={customization.breed} 
            breed={customization.breed} 
            style={imagePositionStyle} // Apply position style
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            <img src={breedImageUrl} alt={customization.breed} />
          </BaseImageWrapper>
        </AnimatePresence>

        {/* Accessories */} 
        {customization.accessories.map(accKey => {
          const accessoryImageUrl = accessoryImageMap[accKey];
          if (!accessoryImageUrl) return null; 
          
          let WrapperComponent: React.ComponentType<any>; // Need a type that accepts props
          let additionalProps: any = {}; // Object to hold extra props like breed

          switch (accKey) {
            case 'hat': 
              WrapperComponent = HatWrapper; 
              break;
            case 'glasses': 
              WrapperComponent = GlassesWrapper; 
              break;
            case 'scarf': // Rename bandana -> scarf
              WrapperComponent = ScarfWrapper; // Rename BandanaWrapper -> ScarfWrapper
              // Pass the breed specifically to ScarfWrapper
              additionalProps = { breed: customization.breed }; 
              break;
            case 'bow_tie': 
              WrapperComponent = BowtieWrapper; 
              break;
            default: return null;
          }

          return (
            <AnimatePresence key={`${customization.breed}-${accKey}`}>
              <WrapperComponent
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                {...additionalProps} // Spread additional props (e.g., breed for bandana)
              >
                <img src={accessoryImageUrl} alt={accKey} />
              </WrapperComponent>
            </AnimatePresence>
          );
        })}

        {/* Speech Bubble - Now inside ImageFrame */} 
        <AnimatePresence>
          {showBubble && (
            <SpeechBubble
              style={bubblePositionStyle} // Apply dynamic position style
              initial={{ opacity: 0 /*, x: '10px' */ }}
              animate={{ opacity: 1 /*, x: '0px' */ }}
              exit={{ opacity: 0 /*, x: '5px' */ }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              accentColor={customization.color}
            >
              {bubbleText}
            </SpeechBubble>
          )}
        </AnimatePresence>
      </ImageFrame>
    </DisplayContainer>
  );
};

export default DogDisplay; 