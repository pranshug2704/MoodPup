import { useState, useEffect, useCallback } from 'react';
import { DogCustomization } from '../components/DogCustomizer';

const LOCAL_STORAGE_KEY = 'dogCustomization';

// Default customization includes background
const defaultCustomization: DogCustomization = {
  name: 'MoodPup',
  breed: 'Shiba',
  color: '#ec4899', // Default to Pink-500
  accessories: [],
  background: 'park_day', // Default background identifier
};

export function useDogCustomization() {
  const [customization, setCustomization] = useState<DogCustomization>(() => {
    // Initialize state from localStorage or use default
    try {
      const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItem) {
        const parsed = JSON.parse(storedItem);
        // Basic validation: Ensure color is a string (might be old 'light'/'medium'/'dark')
        if (typeof parsed.color !== 'string' || !parsed.color.startsWith('#')) {
           parsed.color = defaultCustomization.color; // Reset to default hex if invalid
        }
        // Add default background if missing from older storage
        if (typeof parsed.background !== 'string') {
            parsed.background = defaultCustomization.background;
        }
        return parsed;
      } 
      return defaultCustomization;
    } catch (error) {
      console.error("Error reading dog customization from localStorage:", error);
      return defaultCustomization;
    }
  });

  // Provide a stable function to update the customization
  const updateCustomization = useCallback((newCustomization: DogCustomization) => {
    console.log('[useDogCustomization] updateCustomization called, setting new state:', newCustomization);
    setCustomization(newCustomization);
  }, []);

  // Log when the customization state itself changes (after setCustomization)
  useEffect(() => {
    console.log('[useDogCustomization] Customization state updated:', customization);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customization));
    } catch (error) {
      console.error("Error saving dog customization to localStorage:", error);
    }
  }, [customization]);

  return { customization, updateCustomization };
} 