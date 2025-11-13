export interface Location {
  latitude: number;
  longitude: number;
}

export interface CatchLog {
  fishName: string;
  date: string; // ISO string
  location: Location;
}

export interface Weather {
  temperature: number;
  condition: string;
  windSpeed: number;
  humidity: number;
  icon: string;
  barometer: {
    pressure: number;
    trend: string;
  };
}

export interface Fish {
  name: string;
  description: string;
  baitSuggestion: {
    lures: string[];
    liveBait: string[];
  };
}

export interface Solunar {
  majorTimes: string[];
  minorTimes: string[];
  moonPhase: string;
}

export interface DepthSuggestion {
  recommendation: string;
  reasoning: string;
}

export interface FishingData {
  weather: Weather;
  fish: Fish[];
  solunar: Solunar;
  depthSuggestion: DepthSuggestion;
}