import React from 'react';
import { MoodEntry } from '../hooks/useMoodHistory';

interface MoodHistoryProps {
  moodHistory: MoodEntry[];
}

// Helper function to get an emoji for each emotion
const getEmotionEmoji = (emotion: string): string => {
  switch (emotion.toLowerCase()) {
    case 'happy': return '😊';
    case 'sad': return '😢';
    case 'excited': return '🤩';
    case 'calm': return '😌';
    case 'anxious': return '😟';
    default: return '😐'; // Neutral
  }
};

const MoodHistory: React.FC<MoodHistoryProps> = ({ moodHistory }) => {
  return (
    <div className="w-full max-w-md p-4 bg-white rounded-lg shadow dark:bg-gray-800 mt-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Mood History</h2>
      {moodHistory.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No mood entries yet.</p>
      ) : (
        <ul className="max-h-60 overflow-y-auto space-y-3">
          {moodHistory.map((entry, index) => (
            <li key={index} className="p-3 bg-gray-50 rounded-md dark:bg-gray-700">
              <div className="flex justify-between items-center mb-1">
                <span className="text-2xl">{getEmotionEmoji(entry.emotion)}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {entry.timestamp.toLocaleTimeString()} - {entry.timestamp.toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 italic">"{entry.text}"</p>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 capitalize">Detected: {entry.emotion}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoodHistory; 