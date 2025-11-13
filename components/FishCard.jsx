import React, { useState, useEffect, useCallback } from 'react';
import SpeakerIcon from './common/SpeakerIcon.jsx';
import Card from './common/Card.jsx';
import { getCatchLimit, setCatchLimit } from '../services/catchLimitService.js';
import { getTodaysCatches } from '../services/catchLogService.js';

const FishCard = ({ fish, onSpeak, isSpeaking, onLogCatch, onViewHistory, location }) => {
  const { name, description, baitSuggestion } = fish;
  
  const [limit, setLimit] = useState(null);
  const [limitInput, setLimitInput] = useState('');
  const [todaysCatches, setTodaysCatches] = useState(0);

  const isLimitReached = limit !== null && todaysCatches >= limit;

  const fetchData = useCallback(() => {
    if (location) {
      setLimit(getCatchLimit(name));
      setTodaysCatches(getTodaysCatches(name, location).length);
    }
  }, [name, location]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSetLimit = () => {
    const newLimit = parseInt(limitInput, 10);
    if (!isNaN(newLimit) && newLimit >= 0) {
      setCatchLimit(name, newLimit);
      setLimit(newLimit > 0 ? newLimit : null);
      setLimitInput('');
    }
  };

  const handleLogCatchClick = () => {
    if (isLimitReached) {
      alert(`You've reached your daily catch limit for ${name}.`);
      return;
    }
    onLogCatch(name);
    setTodaysCatches(prev => prev + 1); // Optimistic update
    if (limit !== null && todaysCatches + 1 >= limit) {
      alert(`Congratulations! You've reached your daily limit for ${name}.`);
    }
  };

  const handleSpeak = () => {
    let baitText = '';
    if (baitSuggestion.lures?.length > 0) {
      baitText += ` Recommended lures are ${baitSuggestion.lures.join(', ')}.`;
    }
    if (baitSuggestion.liveBait?.length > 0) {
      baitText += ` For live bait, try ${baitSuggestion.liveBait.join(', ')}.`;
    }
    if (baitText === '') {
      baitText = ' No specific bait suggestions are available right now.';
    }
    const text = `${name}. ${description}.${baitText}`;
    onSpeak(text);
  };
  
  const imageUrl = `https://source.unsplash.com/400x200/?${name.replace(/\s/g, '+')}+fish,fishing`;

  return (
    <Card className="flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-bold text-cyan-200">{name}</h3>
        <SpeakerIcon onClick={handleSpeak} isSpeaking={isSpeaking} />
      </div>
      <img src={imageUrl} alt={name} className="w-full h-32 object-cover rounded-lg mb-4 bg-slate-700" />
      <p className="text-cyan-100/90 text-sm mb-4 flex-grow">{description}</p>
      <div className="space-y-3">
        {baitSuggestion.lures?.length > 0 && (
          <div>
            <p className="font-bold text-cyan-400 text-sm">Lures:</p>
            <p className="text-white font-medium text-sm">{baitSuggestion.lures.join(', ')}</p>
          </div>
        )}
        {baitSuggestion.liveBait?.length > 0 && (
           <div>
            <p className="font-bold text-cyan-400 text-sm">Live Bait:</p>
            <p className="text-white font-medium text-sm">{baitSuggestion.liveBait.join(', ')}</p>
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700 space-y-3">
        <div className="flex justify-between items-center text-sm">
          <label htmlFor={`limit-input-${name}`} className="font-bold text-cyan-400">Daily Limit:</label>
          <div className="flex items-center gap-2">
            <input 
              id={`limit-input-${name}`}
              type="number"
              min="0"
              placeholder="None"
              value={limitInput}
              onChange={(e) => setLimitInput(e.target.value)}
              className="w-20 bg-slate-900/80 text-white p-1 rounded-md text-center border border-slate-600 focus:ring-2 focus:ring-cyan-500 focus:outline-none"
            />
            <button
              onClick={handleSetLimit}
              className="px-3 py-1 text-xs font-semibold text-white bg-cyan-700 rounded-md hover:bg-cyan-600 transition-colors active:scale-95"
            >
              Set
            </button>
          </div>
        </div>
        <p className="text-sm text-cyan-100/90 text-right">
          Today's Catch: <span className="font-bold text-white">{todaysCatches} / {limit !== null ? limit : '∞'}</span>
        </p>
      </div>

      <div className="mt-auto pt-4 border-t border-slate-700 flex items-center justify-end gap-3">
        <button 
          onClick={() => onViewHistory(name)}
          className="px-4 py-2 text-sm font-semibold text-cyan-200 bg-slate-700/80 rounded-md hover:bg-slate-700 transition-colors active:scale-95"
          aria-label={`View catch history for ${name}`}
        >
          View History
        </button>
        <button 
          onClick={handleLogCatchClick}
          disabled={isLimitReached}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-md transition-colors active:scale-95 ${
            isLimitReached 
              ? 'bg-red-600/70 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-500'
          }`}
          aria-label={isLimitReached ? `Catch limit reached for ${name}` : `Log a catch for ${name}`}
        >
          {isLimitReached ? 'Limit Reached' : 'Log Catch'}
        </button>
      </div>
    </Card>
  );
};

export default FishCard;
