const CATCH_LIMIT_KEY = 'reelTimeCatchLimits';

// Helper to get all limits from localStorage
const getAllLimits = () => {
  try {
    const limits = localStorage.getItem(CATCH_LIMIT_KEY);
    return limits ? JSON.parse(limits) : {};
  } catch (error) {
    console.error("Error reading catch limits from localStorage", error);
    return {};
  }
};

// Helper to save all limits to localStorage
const saveAllLimits = (limits) => {
  try {
    localStorage.setItem(CATCH_LIMIT_KEY, JSON.stringify(limits));
  } catch (error) {
    console.error("Error saving catch limits to localStorage", error);
  }
};

/**
 * Sets the daily catch limit for a specific fish.
 * @param {string} fishName The name of the fish.
 * @param {number} limit The catch limit. A value of 0 or less removes the limit.
 */
export const setCatchLimit = (fishName, limit) => {
  const allLimits = getAllLimits();
  if (limit > 0) {
    allLimits[fishName] = limit;
  } else {
    // A limit of 0 or less means no limit, so we remove the key.
    delete allLimits[fishName];
  }
  saveAllLimits(allLimits);
};

/**
 * Retrieves the daily catch limit for a specific fish.
 * @param {string} fishName The name of the fish.
 * @returns {number | null} The limit as a number, or null if no limit is set.
 */
export const getCatchLimit = (fishName) => {
  const allLimits = getAllLimits();
  return allLimits[fishName] ?? null;
}
