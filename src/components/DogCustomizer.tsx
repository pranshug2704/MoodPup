/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Keep motion for buttons
import styled from '@emotion/styled';

// Define the types for customization options
export interface DogCustomization {
  name: string;
  breed: 'Shiba' | 'Golden Retriever' | 'Husky' | 'Poodle';
  color: string;
  accessories: string[]; // e.g., ['bandana', 'glasses']
}

interface DogCustomizerProps {
  onCustomize: (customization: DogCustomization) => void;
  initialCustomization: DogCustomization;
}

const availableBreeds: DogCustomization['breed'][] = ['Shiba', 'Golden Retriever', 'Husky', 'Poodle'];
const availableAccessories = ['bandana', 'glasses', 'hat', 'bow_tie'];

// Helper for accessory icon/label
const accessoryDetails: { [key: string]: { icon: string; label: string } } = {
  bandana: { icon: '🧣', label: 'Bandana' },
  glasses: { icon: '🕶️', label: 'Glasses' },
  hat: { icon: '🤠', label: 'Hat' },
  bow_tie: { icon: '🎀', label: 'Bow Tie' },
};

// Styled Components
const PanelContainer = styled.div`
  width: 280px;
  padding: 1.5rem;
  background-color: transparent;
  /* box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05); */
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #1f2937; // gray-800
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
  border: 1px solid #d1d5db; // gray-300
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
  border: 1px solid #d1d5db;
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
  gap: 0.5rem;
`;

const ColorInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  border-radius: 50%;
  overflow: hidden; // Ensure background color fills the circle

  &::-webkit-color-swatch-wrapper {
    padding: 0;
    border-radius: 50%;
  }
  &::-webkit-color-swatch {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
  }

  &::-moz-color-swatch {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
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

const AccessoryLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const DogCustomizer: React.FC<DogCustomizerProps> = ({ onCustomize, initialCustomization }) => {
  // Initialize state from initialCustomization
  const [name, setName] = useState(initialCustomization.name);
  const [breed, setBreed] = useState<DogCustomization['breed']>(initialCustomization.breed);
  const [color, setColor] = useState<string>(initialCustomization.color);
  const [accessories, setAccessories] = useState<string[]>(initialCustomization.accessories);

  // Keep this useEffect to trigger updates outward
  useEffect(() => {
    const currentCustomization: DogCustomization = { name, breed, color, accessories };
    console.log('[DogCustomizer] Change detected, calling onCustomize:', currentCustomization);
    onCustomize(currentCustomization);
  }, [name, breed, color, accessories, onCustomize]);

  const handleAccessoryChange = (accessory: string) => {
    setAccessories(prev =>
      prev.includes(accessory)
        ? prev.filter(acc => acc !== accessory)
        : [...prev, accessory]
    );
  };

  return (
    <PanelContainer>
      <Title>Customize 🎨</Title>
      <CustomForm>
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
          <Label htmlFor="accentColor">Accent Color</Label>
          <ColorInputWrapper>
            <ColorInput 
              type="color" 
              id="accentColor" 
              value={color} 
              onChange={(e) => setColor(e.target.value)} 
            />
            {/* Optionally display hex code */}
             <span style={{ fontFamily: 'monospace', fontSize: '0.9em' }}>{color}</span> 
          </ColorInputWrapper>
        </FieldGroup>
        <FieldGroup>
          <Label>Accessories</Label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {availableAccessories.map(acc => {
              const isActive = accessories.includes(acc);
              const details = accessoryDetails[acc] || { icon: '?', label: acc };
              return (
                <AccessoryButton
                  key={acc}
                  type="button"
                  onClick={() => handleAccessoryChange(acc)}
                  whileTap={{ scale: 0.95 }}
                  isActive={isActive}
                  accentColor={color}
                >
                  <span>{details.icon}</span>
                  <AccessoryLabel>{details.label}</AccessoryLabel>
                </AccessoryButton>
              );
            })}
          </div>
        </FieldGroup>
      </CustomForm>
    </PanelContainer>
  );
};

export default DogCustomizer; 