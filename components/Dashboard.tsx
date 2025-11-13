import React, { useState } from 'react';
import type { FishingData, Location } from '../types';
import WeatherCard from './WeatherCard';
import FishCard from './FishCard';
import SolunarCard from './SolunarCard';
import DepthCard from './DepthCard';
import HistoryModal from './HistoryModal';
import { logCatch } from '../services/catchLogService';


interface DashboardProps {
  fishingData: FishingData;
  onSpeak: (text: string) => void;
  isSpeaking: boolean;
  location: Location | null;
}

const Dashboard: React.FC<DashboardProps> = ({ fishingData, onSpeak, isSpeaking, location }) => {
  const { weather, fish, solunar, depthSuggestion } = fishingData;
  const [historyModalFish, setHistoryModalFish] = useState<string | null>(null);

  const handleLogCatch = (fishName: string) => {
    if (location) {
      logCatch(fishName, location);
    }
  };

  const handleViewHistory = (fishName: string) => {
    setHistoryModalFish(fishName);
  };


  return (
    <div className="w-full max-w-7xl mx-auto">
      {historyModalFish && (
        <HistoryModal 
          fishName={historyModalFish}
          location={location}
          onClose={() => setHistoryModalFish(null)}
        />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <WeatherCard weather={weather} onSpeak={onSpeak} isSpeaking={isSpeaking} />
        </div>
        <div className="lg:col-span-2">
          <SolunarCard solunar={solunar} onSpeak={onSpeak} isSpeaking={isSpeaking} />
        </div>
      </div>

      <div className="mb-6">
        <DepthCard depthSuggestion={depthSuggestion} onSpeak={onSpeak} isSpeaking={isSpeaking} />
      </div>

      <div>
        <h2 className="text-3xl font-bold text-cyan-200 mb-4 ml-2">Likely Catches Today</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {fish.map((f, index) => (
            <FishCard 
              key={index} 
              fish={f} 
              onSpeak={onSpeak} 
              isSpeaking={isSpeaking}
              onLogCatch={handleLogCatch}
              onViewHistory={handleViewHistory}
              location={location}
             />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;