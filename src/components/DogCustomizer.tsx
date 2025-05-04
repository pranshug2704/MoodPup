/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Keep motion for buttons
import styled from '@emotion/styled';

// Import background thumbnail images
import parkThumbUrl from '../assets/park_day.png';
import roomThumbUrl from '../assets/cozy_room.png';
import starsThumbUrl from '../assets/starry_night.png';
import hillsThumbUrl from '../assets/sunset_hills.png';
// Import dice icon
import diceIconUrl from '../assets/dice.png';
// Import accessory images
import scarfImageUrl from '../assets/Scarf.png';
import glassesImageUrl from '../assets/Glasses.png';
import hatImageUrl from '../assets/Hat.png';
import bowtieImageUrl from '../assets/Bowtie.png';

// Define the types for customization options
export interface DogCustomization {
  name: string;
  breed: 'Shiba' | 'Golden Retriever' | 'Husky' | 'Poodle';
  color: string;
  accessories: string[]; // e.g., ['bandana', 'glasses']
  background: string; // Add background identifier (e.g., 'park', 'room')
}

interface DogCustomizerProps {
  onCustomize: (customization: DogCustomization) => void;
  initialCustomization: DogCustomization;
}

const availableBreeds: DogCustomization['breed'][] = ['Shiba', 'Golden Retriever', 'Husky', 'Poodle'];
const availableAccessories = ['scarf', 'glasses', 'hat', 'bow_tie'];

// Helper for accessory icon/label
const accessoryDetails: { [key: string]: { icon: string; label: string } } = {
  scarf: { icon: scarfImageUrl, label: 'Scarf' },
  glasses: { icon: glassesImageUrl, label: 'Glasses' },
  hat: { icon: hatImageUrl, label: 'Hat' },
  bow_tie: { icon: bowtieImageUrl, label: 'Bow Tie' },
};

// Background Options Data
const backgroundOptions = [
  { id: 'park_day', name: 'Park', thumb: parkThumbUrl },
  { id: 'cozy_room', name: 'Room', thumb: roomThumbUrl },
  { id: 'starry_night', name: 'Stars', thumb: starsThumbUrl },
  { id: 'sunset_hills', name: 'Hills', thumb: hillsThumbUrl },
];

// Styled Components
const PanelContainer = styled.div`
  width: 280px;
  padding: 1.5rem;
  background-color: transparent;
  /* box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); */
  /* height: 100vh; */ /* Remove fixed height */
  /* overflow-y: auto; */ /* Remove internal scroll */
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2<{ accentColor: string }>`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: ${props => props.accentColor}; /* Use accent color */
  padding-left: 45px; /* Add padding to avoid toggle button */
  transition: color 0.3s ease; /* Add transition */
`;

const CustomForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FieldGroup = styled.div``; // Simple div wrapper for spacing

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563; // gray-600
  margin-bottom: 0.25rem;
`;

const Input = styled.input<{ accentColor: string }>`
  width: 100%;
  padding: 0.625rem;
  border: 2px solid ${props => props.accentColor}cc; /* Use accent color, thicker border */
  border-radius: 0.5rem;
  font-size: 1rem;
  box-sizing: border-box; // Ensure consistent sizing
  height: 2.5rem; // Explicit height
  line-height: normal; // Reset line-height for input
  &:focus {
    outline: none;
    border-color: ${props => props.accentColor};
    box-shadow: 0 0 0 2px ${props => props.accentColor}33; // Add alpha
  }
`;

const Select = styled.select<{ accentColor: string }>`
  width: 100%;
  padding: 0 0.625rem; // Adjust padding slightly for select appearance
  border: 2px solid ${props => props.accentColor}cc; /* Use accent color, thicker border */
  border-radius: 0.5rem;
  font-size: 1rem;
  background-color: white;
  box-sizing: border-box; // Ensure consistent sizing
  height: 2.5rem; // Explicit height (match input)
  appearance: none; // Remove default browser appearance for better control
  background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22%239ca3af%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M10%2012.586l-4.293-4.293a1%201%200%201%200-1.414%201.414l5%205a1%201%200%200%200%201.414%200l5-5a1%201%200%200%200-1.414-1.414L10%2012.586z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E'); // Basic dropdown arrow
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1.25em 1.25em;
  &:focus {
    outline: none;
    border-color: ${props => props.accentColor};
    box-shadow: 0 0 0 2px ${props => props.accentColor}33;
  }
`;

// Input type="color" specific styles
const ColorInputWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem; /* Increased gap */
`;

const ColorInput = styled.input`
  /* Reset appearance */
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  /* Rectangular Shape */
  width: 180px; /* Wider rectangle */
  height: 32px; /* Shorter */
  background-color: transparent;
  border: 1px solid #d1d5db; /* Add a subtle border */
  border-radius: 0.375rem; /* Slight rounding */
  cursor: pointer;
  overflow: hidden;

  /* Ensure color swatch fills the rectangle */
  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 0; /* Remove rounding from wrapper */
  }
  &::-webkit-color-swatch {
    border: none; /* Remove default swatch border */
    border-radius: 0; /* Remove rounding */
  }
  &::-moz-color-swatch {
    border: none;
    border-radius: 0;
  }
`;

const RandomizeButton = styled(motion.button)`
  /* padding: 0.5rem 0.75rem; */ /* Remove padding */
  padding: 0.25rem; /* Add small padding around image */
  width: 40px; /* Keep width */
  height: 32px; /* Match shorter color input height */
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  background-color: white;
  /* color: #4b5563; */ /* No text color */
  /* font-size: 0.875rem; */ /* No text */
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
  display: flex; /* Center image */
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }

  img {
    display: block;
    height: 75%; /* Adjust size of icon */
    width: auto;
  }
`;

const AccessoryButton = styled(motion.button)<{ isActive: boolean; accentColor: string }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  border: 2px solid ${props => props.isActive ? props.accentColor : '#d1d5db'};
  transition: all 0.15s;
  background-color: ${props => props.isActive ? `${props.accentColor}26` : 'white'};
  color: ${props => props.isActive ? props.accentColor : '#4b5563'};
  cursor: pointer;
  box-shadow: ${props => props.isActive ? '0 2px 4px rgba(0,0,0,0.08)' : 'none'};

  &:hover {
     border-color: ${props => props.isActive ? props.accentColor : '#9ca3af'};
     background-color: ${props => props.isActive ? `${props.accentColor}33` : '#f9fafb'}; /* Adjust hover alpha */
  }
`;

// Style for the accessory icon image within the button
const AccessoryIconImage = styled.img`
  height: 20px; /* Control image size */
  width: 20px;
  object-fit: contain;
`;

const AccessoryLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

// Styles for Background Selection
const ThumbnailContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr); // 2 columns
  gap: 0.75rem;
`;

const ThumbnailButton = styled.button<{ isActive: boolean; accentColor: string }>`
  display: block;
  padding: 0;
  border: 3px solid ${props => props.isActive ? props.accentColor : 'transparent'};
  border-radius: 0.5rem;
  cursor: pointer;
  overflow: hidden;
  aspect-ratio: 16 / 10; // Maintain aspect ratio
  transition: border-color 0.2s ease;
  position: relative;
  background-color: #e5e7eb; // Placeholder bg

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.accentColor}66;
  }

  /* Optional: subtle dim effect when not active */
  /* img { 
    opacity: ${props => props.isActive ? 1 : 0.85}; 
    transition: opacity 0.2s ease;
  } */
`;

const ThumbnailImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DogCustomizer: React.FC<DogCustomizerProps> = ({ onCustomize, initialCustomization }) => {
  // Initialize state from initialCustomization
  const [name, setName] = useState(initialCustomization.name);
  const [breed, setBreed] = useState<DogCustomization['breed']>(initialCustomization.breed);
  const [color, setColor] = useState<string>(initialCustomization.color);
  const [accessories, setAccessories] = useState<string[]>(initialCustomization.accessories);
  // Add state for selected background
  const [background, setBackground] = useState<string>(initialCustomization.background);

  // Keep this useEffect to trigger updates outward
  useEffect(() => {
    const currentCustomization: DogCustomization = { name, breed, color, accessories, background };
    console.log('[DogCustomizer] Change detected, calling onCustomize:', currentCustomization);
    onCustomize(currentCustomization);
  }, [name, breed, color, accessories, background, onCustomize]);

  const handleAccessoryChange = (accessory: string) => {
    setAccessories(prev =>
      prev.includes(accessory)
        ? prev.filter(acc => acc !== accessory)
        : [...prev, accessory]
    );
  };

  // Function to generate and set random color
  const handleRandomizeColor = () => {
    const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
    setColor(randomColor);
  };

  return (
    <PanelContainer>
      <Title accentColor={color}>Customize</Title>
      <CustomForm>
        <FieldGroup>
          <Label htmlFor="accentColor">Accent Color</Label>
          <ColorInputWrapper>
            <ColorInput type="color" id="accentColor" value={color} onChange={(e) => setColor(e.target.value)} />
            <RandomizeButton
              type="button" // Prevent form submission
              onClick={handleRandomizeColor}
              whileTap={{ scale: 0.95 }}
              title="Randomize Color" // Add tooltip
            >
              <img src={diceIconUrl} alt="Randomize" />
            </RandomizeButton>
          </ColorInputWrapper>
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="dogName">Name</Label>
          <Input accentColor={color} type="text" id="dogName" value={name} onChange={(e) => setName(e.target.value)} placeholder="MoodPup's Name" required />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="breed">Breed</Label>
          <Select accentColor={color} id="breed" value={breed} onChange={(e) => setBreed(e.target.value as DogCustomization['breed'])}>
            {availableBreeds.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        </FieldGroup>
        <FieldGroup>
          <Label>Accessories</Label>
          <ThumbnailContainer>
            {availableAccessories.map(accKey => {
              const detail = accessoryDetails[accKey];
              const isActive = accessories.includes(accKey);
              return (
                <AccessoryButton
                  key={accKey}
                  type="button"
                  isActive={isActive}
                  onClick={() => handleAccessoryChange(accKey)}
                  accentColor={color}
                  whileTap={{ scale: 0.97 }}
                >
                  <AccessoryIconImage src={detail.icon} alt={detail.label} />
                  <AccessoryLabel>{detail.label}</AccessoryLabel>
                </AccessoryButton>
              );
            })}
          </ThumbnailContainer>
        </FieldGroup>
        <FieldGroup>
          <Label>Background</Label>
          <ThumbnailContainer>
            {backgroundOptions.map(bg => (
              <ThumbnailButton
                key={bg.id}
                type="button"
                isActive={background === bg.id}
                onClick={() => setBackground(bg.id)}
                accentColor={color}
                title={bg.name}
              >
                <ThumbnailImage src={bg.thumb} alt={bg.name} />
              </ThumbnailButton>
            ))}
          </ThumbnailContainer>
        </FieldGroup>
      </CustomForm>
    </PanelContainer>
  );
};

export default DogCustomizer; 