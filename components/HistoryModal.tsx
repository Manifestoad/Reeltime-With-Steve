import React, { useState, useEffect } from 'react';
import { getCatchHistory, calculateSuccessStats } from '../services/catchLogService';
import type { Location, CatchLog } from '../types';
import Card from './common/Card';
import Spinner from './common/Spinner';

interface HistoryModalProps {
  fishName: string;
  location: Location | null;
  onClose: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ fishName, location, onClose }) => {
  const [history, setHistory] = useState<CatchLog[]>([]);
  const [stats, setStats] = useState<{ totalCatches: number; uniqueTripDays: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location) {
      const fetchHistory = () => {
        setLoading(true);
        const catchHistory = getCatchHistory(fishName, location);
        const successStats = calculateSuccessStats(catchHistory);
        setHistory(catchHistory.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        setStats(successStats);
        setLoading(false);
      };
      fetchHistory();
    } else {
        setLoading(false);
    }
  }, [fishName, location]);
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);


  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="history-modal-title"
    >
      <div 
        className="w-full max-w-lg"
        onClick={e => e.stopPropagation()}
      >
        <Card className="relative">
          <button 
            onClick={onClose} 
            className="absolute top-3 right-3 p-2 rounded-full bg-slate-700/80 hover:bg-slate-600 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 id="history-modal-title" className="text-2xl font-bold text-cyan-200 mb-4">
            Catch History: {fishName}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Spinner />
            </div>
          ) : !location ? (
             <p className="text-center text-orange-300">Location data is not available to fetch history.</p>
          ) : stats && stats.totalCatches > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-4 text-center mb-6">
                <div>
                  <p className="text-4xl font-bold text-white">{stats.totalCatches}</p>
                  <p className="text-cyan-400">Total Catches</p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">{stats.uniqueTripDays}</p>
                  <p className="text-cyan-400">Unique Fishing Days</p>
                </div>
              </div>

              <h3 className="font-bold text-cyan-300 mb-2">Recent Logs:</h3>
              <div className="max-h-60 overflow-y-auto bg-slate-900/50 p-3 rounded-lg">
                {history.map((log, index) => (
                  <div key={index} className="flex justify-between items-center text-sm p-2 border-b border-slate-700 last:border-b-0">
                    <span className="text-cyan-100">Caught on:</span>
                    <span className="font-semibold text-white">{new Date(log.date).toLocaleDateString()} at {new Date(log.date).toLocaleTimeString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-center text-cyan-100/80 py-12">
              You haven't logged any catches for {fishName} in this area yet. Go catch one!
            </p>
          )}
        </Card>
      </div>
    </div>
  );
};

export default HistoryModal;