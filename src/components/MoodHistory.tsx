import React from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Import framer-motion
import { MoodEntry } from '../hooks/useMoodHistory';
import { Emotion } from '../utils/emotionAnalyzer'; // Import Emotion type

interface MoodHistoryProps {
  moodHistory: MoodEntry[];
}

// Helper function to get an emoji for each emotion
const getEmotionEmoji = (emotion: Emotion): string => {
  switch (emotion) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'excited': return '🤩';
    case 'calm': return '😌';
    case 'anxious': return '😟';
    default: return '😐'; // Neutral
  }
};

// Helper for emotion badge styling
const getEmotionBadgeStyle = (emotion: Emotion): string => {
  switch (emotion) {
    case 'happy': return 'bg-yellow-100 text-yellow-800';
    case 'sad': return 'bg-blue-100 text-blue-800';
    case 'excited': return 'bg-orange-100 text-orange-800';
    case 'calm': return 'bg-green-100 text-green-800';
    case 'anxious': return 'bg-purple-100 text-purple-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const MoodHistory: React.FC<MoodHistoryProps> = ({ moodHistory }) => {
  return (
    // Main container for the history section
    <div className="w-full max-w-md">
      <h2 className="text-lg font-semibold mb-3 text-gray-700 text-center">Mood History 📜</h2>
      {moodHistory.length === 0 ? (
        <p className="text-gray-500 text-center py-4 text-sm">Tell MoodPup how you feel first!</p>
      ) : (
        // Timeline container with left border
        <div className="relative pl-8 border-l-2 border-gray-300/70 ml-4">
          <AnimatePresence initial={false}>
            {moodHistory.map((entry) => (
              <motion.div
                key={entry.timestamp.toISOString()} // Use a unique & stable key
                className="relative mb-6" // Spacing between items
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
              >
                {/* Emoji Icon positioned on the timeline */}
                <div className="absolute -left-[34px] top-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow border border-gray-200">
                  <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                </div>
                {/* Text Card */}
                <div className="ml-6 p-3 bg-white rounded-lg shadow-sm border border-gray-100">
                  {/* User Input Text */}
                  <p className="text-gray-600 italic text-sm mb-2">"{entry.text}"</p>
                  {/* Footer: Emotion Badge + Timestamp */}
                  <div className="flex justify-between items-center text-xs">
                    <span className={`px-2 py-0.5 rounded-full font-medium capitalize ${getEmotionBadgeStyle(entry.emotion)}`}>
                      {entry.emotion}
                    </span>
                    <span className="text-gray-400">
                      {entry.timestamp.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} | {entry.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default MoodHistory; 