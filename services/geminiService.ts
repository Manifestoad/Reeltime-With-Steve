import { GoogleGenAI, Type, Modality } from '@google/genai';
import type { Location, FishingData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fishingForecastSchema = {
  type: Type.OBJECT,
  properties: {
    weather: {
      type: Type.OBJECT,
      properties: {
        temperature: { type: Type.NUMBER, description: 'Temperature in Fahrenheit' },
        condition: { type: Type.STRING, description: 'A short description of weather conditions, e.g., "Sunny", "Partly Cloudy"' },
        windSpeed: { type: Type.NUMBER, description: 'Wind speed in km/h' },
        humidity: { type: Type.NUMBER, description: 'Humidity in percentage' },
        icon: { type: Type.STRING, description: 'A single emoji representing the weather, e.g., "☀️", "☁️", "🌧️"' },
        barometer: {
            type: Type.OBJECT,
            description: 'Barometric pressure details.',
            properties: {
                pressure: { type: Type.NUMBER, description: 'Barometric pressure in millibars (mb), e.g., 1012' },
                trend: { type: Type.STRING, description: 'The trend of the barometer, e.g., "Rising", "Falling", "Steady"' }
            },
            required: ['pressure', 'trend']
        }
      },
      required: ['temperature', 'condition', 'windSpeed', 'humidity', 'icon', 'barometer']
    },
    fish: {
      type: Type.ARRAY,
      description: 'A list of the top 3 fish species likely to be active.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Common name of the fish' },
          description: { type: Type.STRING, description: 'A brief, engaging description of the fish and its habits.' },
          baitSuggestion: { 
            type: Type.OBJECT,
            description: 'Specific suggestions for lures and live bait.',
            properties: {
                lures: { type: Type.ARRAY, description: 'An array of suggested lures, e.g., ["Spinnerbaits", "Crankbaits"]', items: { type: Type.STRING } },
                liveBait: { type: Type.ARRAY, description: 'An array of suggested live bait, e.g., ["Minnows", "Worms"]', items: { type: Type.STRING } }
            },
            required: ['lures', 'liveBait']
          }
        },
        required: ['name', 'description', 'baitSuggestion']
      }
    },
    solunar: {
      type: Type.OBJECT,
      properties: {
        majorTimes: {
          type: Type.ARRAY,
          description: 'The two major fishing times for today, e.g., ["5:30 AM", "6:00 PM"]',
          items: { type: Type.STRING }
        },
        minorTimes: {
          type: Type.ARRAY,
          description: 'The two minor fishing times for today, e.g., ["11:15 AM", "11:45 PM"]',
          items: { type: Type.STRING }
        },
        moonPhase: { type: Type.STRING, description: 'The current moon phase, e.g., "Waxing Crescent", "Full Moon"' }
      },
      required: ['majorTimes', 'minorTimes', 'moonPhase']
    },
    depthSuggestion: {
        type: Type.OBJECT,
        description: 'Recommendation for the best depth to fish at.',
        properties: {
            recommendation: { type: Type.STRING, description: 'A concise recommendation for the best depth to fish at, e.g., "Shallow Waters (5-10 ft)"' },
            reasoning: { type: Type.STRING, description: 'A brief explanation for the depth recommendation, linking it to weather, date, and fish behavior.' }
        },
        required: ['recommendation', 'reasoning']
    }
  },
  required: ['weather', 'fish', 'solunar', 'depthSuggestion']
};

export const getFishingForecast = async (location: Location): Promise<FishingData> => {
  const prompt = `
    You are an expert fishing and weather forecasting AI. Based on the provided geographical coordinates and today's date, generate a detailed fishing forecast in JSON format.

    The location is:
    Latitude: ${location.latitude}
    Longitude: ${location.longitude}

    Provide the following information:
    1.  **Weather**: The current, real-time weather conditions at this location, with temperature in Fahrenheit. Also include barometric pressure and its trend.
    2.  **Fish**: A list of the top 3 fish species that are most likely to be active and catchable right now at this location. For each fish, provide specific lure and live bait recommendations.
    3.  **Solunar**: The solunar forecast for today.
    4.  **Depth Suggestion**: Recommend the best depth range to fish at and provide a brief reasoning based on conditions.

    Please adhere strictly to the provided JSON schema for your response.
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-pro',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: fishingForecastSchema,
    },
  });

  const jsonText = response.text.trim();
  return JSON.parse(jsonText);
};

export const getTextToSpeechAudio = async (text: string): Promise<string | undefined> => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
};