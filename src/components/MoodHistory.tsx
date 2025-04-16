/** @jsxImportSource @emotion/react */
import { useRef } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
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

// Styled Components
const GraphOuterContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const PlaceholderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: #9ca3af; // gray-400
  font-size: 0.875rem;
`;

const ScrollContainer = styled.div`
  overflow-x: auto;
  height: 100%;
  background: linear-gradient(to bottom, rgba(16, 185, 129, 0.05), rgba(254, 249, 195, 0.05), rgba(239, 68, 68, 0.05));
  /* Remove other styles like border, padding, etc., if needed for seamless */
  /* Custom scrollbar styling (optional, browser-specific) */
  &::-webkit-scrollbar {
    height: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.15);
    border-radius: 6px;
  }
`;

const SVGWrapper = styled.div<{ width: number; padding: number }>`
  width: ${props => props.width}px;
  height: 100%;
  padding: 0 ${props => props.padding}px;
  box-sizing: border-box;
`;

const StyledSVG = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
`;

const MoodPath = styled(motion.path)`
  fill: none;
  stroke: #4b5563; // gray-600
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const PointCircle = styled(motion.circle)<{ pointColor: string }>`
  fill: white;
  stroke: ${props => props.pointColor};
  stroke-width: 1.5;
`;

const PointText = styled(motion.text)<{ pointColor: string }>`
  fill: ${props => props.pointColor};
  font-size: 8px;
  text-anchor: middle;
`;

const MoodHistoryGraph: React.FC<MoodHistoryProps> = ({ moodHistory }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  const plottedHistory = [...moodHistory].reverse();
  const padding = 10;
  const pointSpacing = 50;
  const calculatedWidth = Math.max(300, padding * 2 + (plottedHistory.length - 1) * pointSpacing);
  const width = calculatedWidth;
  const height = 80;
  const maxScore = 3;
  const minScore = -2;
  const scoreRange = maxScore - minScore;
  const points = plottedHistory.map((entry, index) => {
    const score = emotionScores[entry.emotion] ?? 0;
    const x = padding + index * pointSpacing;
    const pointHeight = (height - 2 * padding);
    const y = height - padding - ((score - minScore) / scoreRange) * pointHeight;
    const clampedY = Math.max(padding, Math.min(height - padding, y));
    return { x, y: clampedY, score, emotion: entry.emotion };
  });
  const pathData = points.map((p, i) => (i === 0 ? 'M' : 'L') + `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  return (
    <GraphOuterContainer>
      {plottedHistory.length < 2 ? (
        <PlaceholderContainer>
          <p>Mood trend appears here...</p>
        </PlaceholderContainer>
      ) : (
        <ScrollContainer>
          <SVGWrapper width={width} padding={padding}>
            <StyledSVG ref={svgRef} viewBox={`0 0 ${width} ${height}`}>
              {pathData && (
                <MoodPath
                  d={pathData}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                />
              )}
              {points.map((point, index) => {
                const color = point.score > 0 ? '#10b981' : point.score < 0 ? '#ef4444' : '#6b7280';
                const isPositive = point.score > 0;
                const textYOffset = isPositive ? -8 : 14;
                return (
                  <g key={index}>
                    <PointCircle
                      pointColor={color}
                      cx={point.x}
                      cy={point.y}
                      r="4"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1, type: 'spring', stiffness: 300 }}
                    />
                    <PointText
                      pointColor={color}
                      x={point.x}
                      y={point.y + textYOffset}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.15 }}
                    >
                      {point.emotion}
                    </PointText>
                  </g>
                );
              })}
            </StyledSVG>
          </SVGWrapper>
        </ScrollContainer>
      )}
    </GraphOuterContainer>
  );
};

export default MoodHistoryGraph; 