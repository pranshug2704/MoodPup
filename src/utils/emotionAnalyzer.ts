import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export type Emotion = 'happy' | 'sad' | 'calm' | 'excited' | 'anxious' | 'neutral';

export function analyzeEmotion(input: string): Emotion {
  const result = sentiment.analyze(input);
  const score = result.score;

  // Simple mapping based on sentiment score
  // More sophisticated mapping could consider comparative score, keywords, etc.
  if (score > 3) {
    return 'excited';
  } else if (score > 0.5) {
    return 'happy';
  } else if (score < -3) {
    return 'sad';
  } else if (score < -0.5) {
    return 'anxious';
  } else if (score === 0 && input.trim().length > 0) {
      // Consider non-empty neutral inputs as potentially calm
      // You might refine this based on keyword analysis if needed
      return 'calm';
  }
  // Default to neutral if score is near zero or input is empty
  return 'neutral';
} 