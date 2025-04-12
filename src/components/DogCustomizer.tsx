import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'; // Keep motion for buttons

// Define the types for customization options
export interface DogCustomization {
  name: string;
  breed: 'Shiba' | 'Golden Retriever' | 'Husky' | 'Poodle';
  color: 'light' | 'medium' | 'dark';
  accessories: string[]; // e.g., ['bandana', 'glasses']
}

interface DogCustomizerProps {
  onCustomize: (customization: DogCustomization) => void;
  initialCustomization: DogCustomization;
}

const availableBreeds: DogCustomization['breed'][] = ['Shiba', 'Golden Retriever', 'Husky', 'Poodle'];
const availableColors: DogCustomization['color'][] = ['light', 'medium', 'dark'];
const availableAccessories = ['bandana', 'glasses', 'hat', 'bow_tie'];

// Helper for accessory icon/label
const accessoryDetails: { [key: string]: { icon: string; label: string } } = {
  bandana: { icon: '🧣', label: 'Bandana' },
  glasses: { icon: '🕶️', label: 'Glasses' },
  hat: { icon: '🤠', label: 'Hat' },
  bow_tie: { icon: '🎀', label: 'Bow Tie' },
};

const DogCustomizer: React.FC<DogCustomizerProps> = ({ onCustomize, initialCustomization }) => {
  const [name, setName] = useState(initialCustomization.name);
  const [breed, setBreed] = useState<DogCustomization['breed']>(initialCustomization.breed);
  const [color, setColor] = useState<DogCustomization['color']>(initialCustomization.color);
  const [accessories, setAccessories] = useState<string[]>(initialCustomization.accessories);

  // Update state if initial customization changes externally
  useEffect(() => {
    setName(initialCustomization.name);
    setBreed(initialCustomization.breed);
    setColor(initialCustomization.color);
    setAccessories(initialCustomization.accessories);
  }, [initialCustomization]);

  // Trigger customize immediately on change instead of explicit save
  useEffect(() => {
    const currentCustomization: DogCustomization = { name, breed, color, accessories };
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
    <div style={{ // Basic sidebar styling
      width: '280px', 
      padding: '1.5rem', 
      background: '#ffffff', 
      boxShadow: '2px 0 5px rgba(0,0,0,0.1)', 
      height: '100vh', // Full viewport height
      overflowY: 'auto', // Allow scrolling within panel
      borderRight: '1px solid #e5e7eb'
    }}>
      <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem' }}>Customize 🎨</h2>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Dog Name */}
        <div>
          <label htmlFor="dogName" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.25rem' }}>Name</label>
          <input type="text" id="dogName" value={name} onChange={(e) => setName(e.target.value)} placeholder="MoodPup's Name" required 
                 style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}/>
        </div>

        {/* Breed Dropdown */}
        <div>
          <label htmlFor="breed" style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.25rem' }}>Breed</label>
          <select id="breed" value={breed} onChange={(e) => setBreed(e.target.value as DogCustomization['breed'])} 
                  style={{ width: '100%', padding: '0.625rem', border: '1px solid #d1d5db', borderRadius: '0.5rem' }}>
            {availableBreeds.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        {/* Color Theme Radio Buttons */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem' }}>Color Theme</label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {availableColors.map(c => (
              <label key={c} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="radio" name="colorTheme" value={c} checked={color === c} onChange={(e) => setColor(e.target.value as DogCustomization['color'])} style={{ position: 'absolute', opacity: 0 }}/>
                <span style={{ width: '2rem', height: '2rem', borderRadius: '9999px', border: '2px solid transparent', display:'flex', alignItems:'center', justifyContent:'center', transition: 'all 0.2s', borderColor: color === c ? '#ec4899' : 'transparent', transform: color === c ? 'scale(1.1)' : 'scale(1)' }}>
                  <span style={{ width: '1.5rem', height: '1.5rem', borderRadius: '9999px', boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)',
                                  background: c === 'light' ? 'linear-gradient(to bottom right, #fef3c7, #dbeafe)' : c === 'medium' ? 'linear-gradient(to bottom right, #f3e8ff, #e0e7ff)' : '#1f2937' }}>
                  </span>
                </span>
                <span style={{ fontSize: '0.875rem', textTransform: 'capitalize', color: color === c ? '#be185d' : '#4b5563', fontWeight: color === c ? 500 : 400 }}>{c}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Accessories Toggles */}
        <div>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#4b5563', marginBottom: '0.5rem' }}>Accessories</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
            {availableAccessories.map(acc => {
              const isActive = accessories.includes(acc);
              const details = accessoryDetails[acc] || { icon: '?', label: acc };
              return (
                <motion.button
                  key={acc}
                  type="button"
                  onClick={() => handleAccessoryChange(acc)}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0.75rem', borderRadius: '9999px', border: '2px solid', 
                    transition: 'all 0.15s',
                    borderColor: isActive ? '#be185d' : '#d1d5db',
                    background: isActive ? 'rgba(190, 24, 93, 0.1)' : 'white',
                    color: isActive ? '#9d174d' : '#4b5563',
                    cursor: 'pointer',
                    boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  <span>{details.icon}</span>
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{details.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default DogCustomizer; 