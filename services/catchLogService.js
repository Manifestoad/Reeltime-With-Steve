const CATCH_LOG_KEY = 'reelTimeCatchLog';

// Helper to get all logs
const getAllLogs = () => {
  try {
    const logs = localStorage.getItem(CATCH_LOG_KEY);
    return logs ? JSON.parse(logs) : [];
  } catch (error) {
    console.error("Error reading catch logs from localStorage", error);
    return [];
  }
};

// Helper to save all logs
const saveAllLogs = (logs) => {
  try {
    localStorage.setItem(CATCH_LOG_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving catch logs to localStorage", error);
  }
};

export const logCatch = (fishName, location) => {
  if (!location) return;
  const allLogs = getAllLogs();
  const newLog = {
    fishName,
    date: new Date().toISOString(),
    location,
  };
  allLogs.push(newLog);
  saveAllLogs(allLogs);
};

// Returns logs for a specific fish within a certain radius of a location
export const getCatchHistory = (fishName, currentLocation) => {
  const allLogs = getAllLogs();
  // A radius of 0.1 degrees is roughly 11km, a reasonable area for "current location".
  const locationRadius = 0.1; 
  return allLogs.filter(log => 
    log.fishName === fishName &&
    Math.abs(log.location.latitude - currentLocation.latitude) < locationRadius &&
    Math.abs(log.location.longitude - currentLocation.longitude) < locationRadius
  );
};

export const getTodaysCatches = (fishName, currentLocation) => {
  const todaysDate = new Date().toISOString().split('T')[0];
  const history = getCatchHistory(fishName, currentLocation);

  return history.filter(log => log.date.startsWith(todaysDate));
};


export const calculateSuccessStats = (history) => {
  if (history.length === 0) {
    return { totalCatches: 0, uniqueTripDays: 0 };
  }

  const uniqueDays = new Set();
  history.forEach(log => {
    uniqueDays.add(new Date(log.date).toISOString().split('T')[0]);
  });

  return {
    totalCatches: history.length,
    uniqueTripDays: uniqueDays.size,
  };
};
