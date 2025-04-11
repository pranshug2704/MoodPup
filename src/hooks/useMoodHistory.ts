import { useState } from 'react';
import { Emotion } from '../utils/emotionAnalyzer';

export interface MoodEntry {
  text: string;
  emotion: Emotion;
  timestamp: Date;
}

const MAX_HISTORY_LENGTH = 10;

export function useMoodHistory() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);

  const addMoodEntry = (entry: Omit<MoodEntry, 'timestamp'>) => {
    setMoodHistory(prevHistory => {
      const newEntry = { ...entry, timestamp: new Date() };
      const updatedHistory = [newEntry, ...prevHistory];

      // Keep only the last MAX_HISTORY_LENGTH entries
      if (updatedHistory.length > MAX_HISTORY_LENGTH) {
        return updatedHistory.slice(0, MAX_HISTORY_LENGTH);
      }
      return updatedHistory;
    });
  };

  return { moodHistory, addMoodEntry };
} 