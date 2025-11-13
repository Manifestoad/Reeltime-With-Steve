import React, { useState, useEffect, useCallback } from 'react';
import type { FishingData, Location } from './types';
import { getFishingForecast, getTextToSpeechAudio } from './services/geminiService';
import { playAudio } from './services/audioService';
import Dashboard from './components/Dashboard';
import Spinner from './components/common/Spinner';
import Logo from './components/common/Logo';

const App: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null);
  const [fishingData, setFishingData] = useState<FishingData | null>(null);
  const [loading, setLoading] = useState<string>('Waiting for location permission...');
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const requestLocation = useCallback(() => {
    setLoading('Getting your location...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(`Error getting location: ${err.message}. Please enable location services and refresh.`);
        setLoading('');
      }
    );
  }, []);

  useEffect(() => {
    // A one-time check for the API key to provide an immediate, clear error.
    if (!process.env.API_KEY) {
      setError('Configuration Error: Your Gemini API Key is missing. Please add the API_KEY to your Vercel project\'s Environment Variables and then redeploy the app from the Vercel dashboard.');
      setLoading('');
      return;
    }
    requestLocation();
  }, [requestLocation]);

  useEffect(() => {
    if (location) {
      const fetchForecast = async () => {
        setLoading('Generating your fishing forecast...');
        setError(null);
        try {
          const data = await getFishingForecast(location);
          setFishingData(data);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
          if (errorMessage.includes('api key') || errorMessage.includes('api_key')) {
             setError('Configuration Error: Your Gemini API Key is missing or invalid. Please double-check the API_KEY in your Vercel project\'s Environment Variables and then redeploy the app.');
          } else {
            setError('Could not fetch fishing forecast. The AI might be busy, please try again later.');
          }
          console.error(err);
        } finally {
          setLoading('');
        }
      };
      fetchForecast();
    }
  }, [location]);

  const handleSpeak = useCallback(async (text: string) => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const audioData = await getTextToSpeechAudio(text);
      if (audioData) {
        await playAudio(audioData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message.toLowerCase() : '';
      if (errorMessage.includes('api key') || errorMessage.includes('api_key')) {
        setError('Configuration Error: Your Gemini API Key is missing or invalid. Please check your Vercel Environment Variables.');
      } else {
        console.error('Error with text-to-speech:', err);
        setError('Sorry, could not play audio.');
      }
    } finally {
      setIsSpeaking(false);
    }
  }, [isSpeaking]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center text-center">
          <Spinner />
          <p className="mt-4 text-lg text-cyan-200">{loading}</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg max-w-2xl">
          <p className="font-bold text-xl mb-2">An Error Occurred</p>
          <p className="text-left whitespace-pre-wrap">{error}</p>
          {error.includes("location") && (
             <button
              onClick={requestLocation}
              className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors"
            >
              Try Again
            </button>
          )}
        </div>
      );
    }

    if (fishingData) {
      return <Dashboard fishingData={fishingData} onSpeak={handleSpeak} isSpeaking={isSpeaking} location={location} />;
    }

    return null;
  };
  

  return (
    <div 
      className="bg-steve min-h-screen bg-slate-900 text-white p-4 sm:p-6 lg:p-8 bg-cover bg-fixed bg-center animated-bg"
    >
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm"></div>
      <main className="relative z-10 container mx-auto">
        <header className="text-center mb-8 flex flex-col items-center">
          <Logo />
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-cyan-300 tracking-wider mt-2" style={{ textShadow: '0 0 10px rgba(0,255,255,0.7)' }}>
            Reel Time with Steve
          </h1>
          <p className="text-cyan-100/80 mt-2 text-lg">Your AI-Powered Fishing Forecast</p>
        </header>
        <div className="flex items-center justify-center">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;