import { useState, useEffect, useCallback } from 'react';
import { DogCustomization } from '../components/DogCustomizer';

// Import available options for randomization
// (Assuming these are exported or accessible)
// If not directly importable, define them here:
const availableBreeds: DogCustomization['breed'][] = ['Shiba', 'Golden Retriever', 'Husky', 'Poodle'];
const availableAccessories = ['scarf', 'glasses', 'hat', 'bow_tie'];
const backgroundOptionIds = ['park_day', 'cozy_room', 'starry_night', 'sunset_hills'];
const possibleNames = ['Buddy', 'Lucy', 'Max', 'Daisy', 'Charlie', 'Sadie', 'Cooper', 'Luna'];

const LOCAL_STORAGE_KEY = 'dogCustomization';

// Default is now just a fallback in case of error
const fallbackCustomization: DogCustomization = {
  name: 'MoodPup',
  breed: 'Shiba',
  color: '#ec4899',
  accessories: [],
  background: 'park_day',
};

// Helper to get a random item from an array
const getRandomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

// Helper to get multiple unique random items
const getRandomUniqueItems = <T,>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function useDogCustomization() {
  const [customization, setCustomization] = useState<DogCustomization>(() => {
    try {
      const storedItem = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedItem) {
        // Existing user: Load and validate stored data
        const parsed = JSON.parse(storedItem);
        // Basic validation (ensure required fields exist and have basic types)
        if (typeof parsed.name !== 'string') parsed.name = fallbackCustomization.name;
        if (!availableBreeds.includes(parsed.breed)) parsed.breed = fallbackCustomization.breed;
        if (typeof parsed.color !== 'string' || !parsed.color.startsWith('#')) parsed.color = fallbackCustomization.color;
        if (!Array.isArray(parsed.accessories)) parsed.accessories = fallbackCustomization.accessories;
        if (typeof parsed.background !== 'string' || !backgroundOptionIds.includes(parsed.background)) parsed.background = fallbackCustomization.background;
        
        console.log('[useDogCustomization] Loaded from localStorage:', parsed);
        return parsed;
      } else {
        // First time user: Randomize!
        console.log('[useDogCustomization] No data found, randomizing initial state...');
        const randomName = getRandomItem(possibleNames);
        const randomBreed = getRandomItem(availableBreeds);
        const randomColor = `#${Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')}`;
        const numAccessories = Math.floor(Math.random() * 3); // 0, 1, or 2 accessories
        const randomAccessories = getRandomUniqueItems(availableAccessories, numAccessories);
        const randomBackground = getRandomItem(backgroundOptionIds);

        const randomInitialState: DogCustomization = {
          name: randomName,
          breed: randomBreed,
          color: randomColor,
          accessories: randomAccessories,
          background: randomBackground,
        };
        console.log('[useDogCustomization] Randomized state:', randomInitialState);
        // Save the randomized state immediately so it persists on refresh
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(randomInitialState));
        return randomInitialState;
      }
    } catch (error) {
      console.error("Error initializing dog customization:", error);
      // Fallback if anything goes wrong
      return fallbackCustomization;
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