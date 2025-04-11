import { useState, useEffect, useCallback } from 'react';
import { DogCustomization } from '../components/DogCustomizer';

const LOCAL_STORAGE_KEY = 'dogCustomization';

// Default customization if nothing is found in localStorage
const defaultCustomization: DogCustomization = {
  name: 'MoodPup',
  breed: 'Shiba',
  color: 'light',
  accessories: [],
};

export function useDogCustomization() {
  const [customization, setCustomization] = useState<DogCustomization>(() => {
    // Initialize state from localStorage or use default
    try {
      const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedItem ? JSON.parse(storedItem) : defaultCustomization;
    } catch (error) {
      console.error("Error reading dog customization from localStorage:", error);
      return defaultCustomization;
    }
  });

  // Persist state to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customization));
    } catch (error) {
      console.error("Error saving dog customization to localStorage:", error);
    }
  }, [customization]);

  // Provide a stable function to update the customization
  const updateCustomization = useCallback((newCustomization: DogCustomization) => {
    setCustomization(newCustomization);
  }, []);

  return { customization, updateCustomization };
} 