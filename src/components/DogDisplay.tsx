/** @jsxImportSource @emotion/react */
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from '@emotion/styled';
import { DogCustomization } from './DogCustomizer';
import { Emotion } from '../utils/emotionAnalyzer';

// Import PNG Images (Vite returns the URL)
import shibaImageUrl from '../assets/Shiba.png';
import retrieverImageUrl from '../assets/Retriever.png';
import huskyImageUrl from '../assets/Husky.png';
import poodleImageUrl from '../assets/Poodle.png';
import bandanaImageUrl from '../assets/Bandana.png';
import glassesImageUrl from '../assets/Glasses.png';
import hatImageUrl from '../assets/Hat.png';
import bowtieImageUrl from '../assets/Bowtie.png';
// Add a default/fallback image import if desired
// import defaultDogImageUrl from '../assets/DefaultDog.png';

interface DogDisplayProps {
  emotion: Emotion;
  customization: DogCustomization;
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
  bandana: bandanaImageUrl,
  glasses: glassesImageUrl,
  hat: hatImageUrl,
  bow_tie: bowtieImageUrl,
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
  top: -12%; // Example position
  left: 50%;
  transform: translateX(-50%);
  z-index: 3; 
`;

const GlassesWrapper = styled(AccessoryWrapperBase)`
  width: 60%;
  height: auto;
  top: 35%; 
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

// Update BandanaWrapper to accept breed and adjust size
const BandanaWrapper = styled(AccessoryWrapperBase)<{ breed: DogCustomization['breed'] }>`
  /* Base size for Shiba/Husky */
  width: 70%; 
  height: auto;
  bottom: 10%;
  left: 47%;
  transform: translateX(-50%);
  z-index: 1;

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

const DogDisplay: React.FC<DogDisplayProps> = ({ emotion, customization }) => {
  const breedImageUrl = breedImageMap[customization.breed] || shibaImageUrl;
  
  // Calculate offset for top/left style
  const offset = getBreedOffset(customization.breed);
  // Start from center (50%) and apply pixel offset
  // Note: Calculating percentage offset might be complex, pixel is simpler here
  const positionStyle = {
      top: `calc(50% + ${offset.y}px)`,
      left: `calc(50% + ${offset.x}px)`,
      // Transform needed to re-center the element itself after top/left shift
      transform: `translate(-50%, -50%)` 
  };

  return (
    <DisplayContainer>
      <DogName>{customization.name}</DogName>
      <ImageFrame>
        <AnimatePresence>
          <BaseImageWrapper
            key={customization.breed} 
            breed={customization.breed} 
            // Apply top/left via style prop, remove transform style
            style={positionStyle}
            // Keep animation props for opacity/scale
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
                opacity: 1, 
                scale: 1,
            }}
            exit={{ opacity: 0, scale: 0.7 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            {/* Image is now positioned by its own styles within wrapper */}
            <img src={breedImageUrl} alt={customization.breed} />
          </BaseImageWrapper>
        </AnimatePresence>

        {/* Accessories - Render specific wrappers */}
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
            case 'bandana': 
              WrapperComponent = BandanaWrapper; 
              // Pass the breed specifically to BandanaWrapper
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
      </ImageFrame>
    </DisplayContainer>
  );
};

export default DogDisplay; 