import React from 'react';

interface DogDisplayProps {
  emotion: string;
}

const DogDisplay: React.FC<DogDisplayProps> = ({ emotion }) => {
  const getDogEmoji = () => {
    switch (emotion.toLowerCase()) {
      case 'happy':
        return '🐶🙂'; // Happy dog
      case 'sad':
        return '🐶😢'; // Sad dog
      case 'excited':
        return '🐶🤩'; // Excited dog
      case 'calm':
        return '🐶😌'; // Calm dog
      case 'anxious':
        return '🐶😟'; // Anxious dog
      default:
        return '🐶'; // Neutral dog
    }
  };

  return (
    <div className="text-6xl p-4">
      {getDogEmoji()}
    </div>
  );
};

export default DogDisplay; 