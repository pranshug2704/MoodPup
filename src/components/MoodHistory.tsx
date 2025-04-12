import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { MoodEntry } from '../hooks/useMoodHistory';
import { Emotion } from '../utils/emotionAnalyzer';

interface MoodHistoryProps {
  moodHistory: MoodEntry[];
}

// Map emotions to numerical scores for plotting
const emotionScores: Record<Emotion, number> = {
  excited: 3,
  happy: 2,
  calm: 1,
  neutral: 0,
  anxious: -1,
  sad: -2,
};

const MoodHistoryGraph: React.FC<MoodHistoryProps> = ({ moodHistory }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // We need to reverse the history so oldest is first for plotting left-to-right
  const plottedHistory = [...moodHistory].reverse();

  const padding = 10; // Define padding first
  // Increase width significantly for horizontal scrolling
  // Keep height relatively small
  const pointSpacing = 50; // Adjust spacing between points
  const calculatedWidth = Math.max(300, padding * 2 + (plottedHistory.length -1) * pointSpacing); // Ensure minimum width
  const width = calculatedWidth;
  const height = 80;
  const maxScore = 3;
  const minScore = -2;
  const scoreRange = maxScore - minScore;

  // Recalculate points with new width and point spacing
  const points = plottedHistory.map((entry, index) => {
    const score = emotionScores[entry.emotion] ?? 0;
    // const x = padding + (index / Math.max(1, plottedHistory.length - 1)) * (width - 2 * padding);
    const x = padding + index * pointSpacing; // Use fixed spacing
    const pointHeight = (height - 2 * padding);
    const y = height - padding - ((score - minScore) / scoreRange) * pointHeight;
    const clampedY = Math.max(padding, Math.min(height - padding, y));
    return { x, y: clampedY, score, emotion: entry.emotion };
  });

  const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    // Outer container takes full width, remove ref if not used
    <div style={{ width: '100%', height: '100%' /* Occupy full height of parent */ }}>
      {/* Removed H2 title */}
      {plottedHistory.length < 2 ? (
        // Keep placeholder centered vertically+horizontally if possible
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#9ca3af', fontSize: '0.875rem' }}>
          <p>Mood trend appears here...</p>
        </div>
      ) : (
        // Scrollable container for the SVG, full height, less obvious styling
        <div style={{
          overflowX: 'auto',
          height: '100%', // Take full height of parent
          background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.05), rgba(254, 249, 195, 0.05), rgba(239, 68, 68, 0.05))', // Subtler gradient
          // Remove border/shadow/padding for seamless look
        }}>
          {/* SVG container div */}
          <div style={{ width: `${width}px`, height: '100%', padding: `0 ${padding}px`, boxSizing: 'border-box' }}>
            <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', width: '100%', height: '100%' }}>
              {/* Horizontal line */}
              <line x1={padding} y1={height - padding - ((-minScore / scoreRange) * (height - 2 * padding))} x2={width - padding} y2={height - padding - ((-minScore / scoreRange) * (height - 2 * padding))} stroke="#9ca3af" strokeWidth="1" strokeDasharray="2,3" /> 
              
              {/* Mood line path */}
              {pathData && (
                <motion.path
                  d={pathData}
                  fill="none"
                  stroke="#4b5563" // Darker gray line
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}

              {/* Data points and Text Labels */}
              {points.map((point, index) => {
                const color = point.score > 0 ? '#10b981' : point.score < 0 ? '#ef4444' : '#6b7280';
                const isPositive = point.score > 0;
                const textYOffset = isPositive ? -8 : 14; // Adjusted offset for smaller size
                
                return (
                  <g key={index}>
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="4" // Slightly smaller points
                      fill="white"
                      stroke={color}
                      strokeWidth="1.5"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 300 }}
                    />
                    <motion.text
                      x={point.x}
                      y={point.y + textYOffset}
                      fill={color}
                      fontSize="8" // Smaller font size
                      textAnchor="middle"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      {point.emotion}
                    </motion.text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodHistoryGraph; 