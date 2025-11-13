import React from 'react';
import SpeakerIcon from './common/SpeakerIcon.jsx';
import Card from './common/Card.jsx';

const SolunarCard = ({ solunar, onSpeak, isSpeaking }) => {
  const { majorTimes, minorTimes, moonPhase } = solunar;
  
  const handleSpeak = () => {
    const text = `Today's solunar forecast. The moon phase is ${moonPhase}. Major fishing times are ${majorTimes.join(' and ')}. Minor fishing times are ${minorTimes.join(' and ')}. Good luck!`;
    onSpeak(text);
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-cyan-200">Solunar Forecast</h3>
        <SpeakerIcon onClick={handleSpeak} isSpeaking={isSpeaking} />
      </div>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-bold text-cyan-400">Major Times</p>
          {majorTimes.map(time => <p key={time} className="text-lg text-white font-semibold">{time}</p>)}
        </div>
        <div>
          <p className="font-bold text-cyan-400">Minor Times</p>
          {minorTimes.map(time => <p key={time} className="text-lg text-white font-semibold">{time}</p>)}
        </div>
        <div>
          <p className="font-bold text-cyan-400">Moon Phase</p>
          <p className="text-lg text-white font-semibold">{moonPhase}</p>
        </div>
      </div>
    </Card>
  );
};

export default SolunarCard;
