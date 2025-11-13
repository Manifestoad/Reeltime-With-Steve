import React from 'react';
import SpeakerIcon from './common/SpeakerIcon.jsx';
import Card from './common/Card.jsx';

const WeatherCard = ({ weather, onSpeak, isSpeaking }) => {
  const { temperature, condition, windSpeed, humidity, icon, barometer } = weather;

  const handleSpeak = () => {
    const text = `The current weather is ${condition} with a temperature of ${Math.round(temperature)} degrees Fahrenheit. Wind speed is ${windSpeed} kilometers per hour, and humidity is at ${humidity} percent. The barometric pressure is ${barometer.pressure} millibars and is ${barometer.trend.toLowerCase()}.`;
    onSpeak(text);
  };

  const getBarometerIcon = (trend) => {
    switch (trend.toLowerCase()) {
        case 'rising': return '📈';
        case 'falling': return '📉';
        default: return '📊';
    }
  }

  return (
    <Card>
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-cyan-200">Current Weather</h3>
        <SpeakerIcon onClick={handleSpeak} isSpeaking={isSpeaking} />
      </div>
      <div className="flex items-center justify-around text-center mt-4">
        <div>
          <span className="text-6xl">{icon}</span>
          <p className="text-xl font-semibold text-cyan-100">{condition}</p>
        </div>
        <div className="text-5xl font-bold text-white">
          {Math.round(temperature)}°<span className="text-3xl text-cyan-300">F</span>
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center space-x-2">
            <span className="text-cyan-400">💨</span>
            <p className="text-cyan-100">Wind: {windSpeed} km/h</p>
        </div>
        <div className="flex items-center space-x-2">
            <span className="text-cyan-400">💧</span>
            <p className="text-cyan-100">Humidity: {humidity}%</p>
        </div>
        <div className="flex items-center space-x-2 col-span-2">
            <span className="text-cyan-400">{getBarometerIcon(barometer.trend)}</span>
            <p className="text-cyan-100">Pressure: {barometer.pressure}mb ({barometer.trend})</p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;
