import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion

// Define the types for customization options
export interface DogCustomization {
  name: string;
  breed: 'Shiba' | 'Golden Retriever' | 'Husky' | 'Poodle';
  color: 'light' | 'medium' | 'dark';
  accessories: string[]; // e.g., ['bandana', 'glasses']
}

interface DogCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onCustomize: (customization: DogCustomization) => void;
  initialCustomization: DogCustomization; // To pre-fill the form
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

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.15, ease: 'easeIn' } },
};

const DogCustomizer: React.FC<DogCustomizerProps> = ({ isOpen, onClose, onCustomize, initialCustomization }) => {
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

  const handleAccessoryChange = (accessory: string) => {
    setAccessories(prev =>
      prev.includes(accessory)
        ? prev.filter(acc => acc !== accessory) // Remove if already selected
        : [...prev, accessory] // Add if not selected
    );
  };

  const handleSave = () => {
    const customization: DogCustomization = {
      name,
      breed,
      color,
      accessories,
    };
    onCustomize(customization);
    onClose(); // Close the panel after saving
  };

  if (!isOpen) {
    return null;
  }

  // Refined input style for consistency
  const inputBaseStyle = "w-full p-2.5 border border-gray-300/80 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand_pink/50 focus:border-brand_pink bg-white/80 placeholder-gray-400 text-gray-700 transition duration-150 ease-in-out";

  return (
    // Use AnimatePresence to animate modal based on isOpen state
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          onClick={onClose} // Keep close on backdrop click
        >
          {/* Modal Panel - wrapped with motion.div */}
          <motion.div
            className="bg-pastel_card p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md relative"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()} // Keep prevent closing inside modal
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Customize 🎨</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none rounded-full p-1 -m-2">&times;</button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-5">
              {/* Dog Name */}
              <div>
                <label htmlFor="dogName" className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                <input type="text" id="dogName" value={name} onChange={(e) => setName(e.target.value)} placeholder="MoodPup's Name" className={inputBaseStyle} required />
              </div>

              {/* Breed Dropdown */}
              <div>
                <label htmlFor="breed" className="block text-sm font-medium text-gray-600 mb-1">Breed</label>
                <select id="breed" value={breed} onChange={(e) => setBreed(e.target.value as DogCustomization['breed'])} className={inputBaseStyle}>
                  {availableBreeds.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              {/* Color Theme (Using Radio Buttons for Visual Selection) */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Color Theme</label>
                <div className="flex space-x-3">
                  {availableColors.map(c => (
                    <label key={c} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="colorTheme" 
                        value={c} 
                        checked={color === c}
                        onChange={(e) => setColor(e.target.value as DogCustomization['color'])}
                        className="sr-only" // Hide default radio
                      />
                      <span 
                        className={`w-8 h-8 rounded-full border-2 transition-all ${color === c ? 'border-brand_pink scale-110' : 'border-transparent'} flex items-center justify-center`}
                      >
                        <span className={`w-6 h-6 rounded-full shadow-inner 
                          ${c === 'light' ? 'bg-gradient-to-br from-yellow-100 to-blue-100' : c === 'medium' ? 'bg-gradient-to-br from-purple-100 to-indigo-100' : 'bg-gray-800'}`}>
                        </span>
                      </span>
                      <span className={`text-sm capitalize ${color === c ? 'text-brand_pink font-medium' : 'text-gray-600'}`}>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Accessories Toggles */}
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Accessories</label>
                <div className="flex flex-wrap gap-3">
                  {availableAccessories.map(acc => {
                    const isActive = accessories.includes(acc);
                    const details = accessoryDetails[acc] || { icon: '?', label: acc };
                    return (
                      <motion.button
                        key={acc}
                        type="button"
                        onClick={() => handleAccessoryChange(acc)}
                        className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border-2 transition-all duration-150 
                                  ${isActive ? 'bg-brand_pink/80 border-brand_pink text-white shadow-md' : 'bg-white border-gray-300/80 text-gray-600 hover:bg-gray-50 hover:border-gray-400'}`}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span>{details.icon}</span>
                        <span className="text-sm font-medium">{details.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <motion.button
                  type="submit"
                  className="px-5 py-2 bg-brand_pink text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 focus:outline-none focus:ring-2 focus:ring-brand_pink focus:ring-offset-2 transition-all"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Save & Close
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DogCustomizer; 