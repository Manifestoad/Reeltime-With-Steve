import React from 'react';
import type { DepthSuggestion } from '../types';
import SpeakerIcon from './common/SpeakerIcon';
import Card from './common/Card';

interface DepthCardProps {
  depthSuggestion: DepthSuggestion;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
}

const DepthCard: React.FC<DepthCardProps> = ({ depthSuggestion, onSpeak, isSpeaking }) => {
  const { recommendation, reasoning } = depthSuggestion;

  const handleSpeak = () => {
    const text = `Depth recommendation: ${recommendation}. Here's why: ${reasoning}`;
    onSpeak(text);
  };

  return (
    <Card>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-cyan-200">Depth Suggestion</h3>
        <SpeakerIcon onClick={handleSpeak} isSpeaking={isSpeaking} />
      </div>
      <div className="text-center my-4">
          <p className="text-4xl font-bold text-white">{recommendation}</p>
      </div>
      <div className="flex items-start space-x-3">
        <span className="text-cyan-400 mt-1">💡</span>
        <p className="text-cyan-100/90 text-sm">
          <span className="font-bold text-cyan-300">Reasoning: </span> 
          {reasoning}
        </p>
      </div>
    </Card>
  );
};

export default DepthCard;