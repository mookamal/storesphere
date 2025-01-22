/**
 * Safely converts a description to a JSON string
 * @param {string|object|null} description - The description to convert
 * @returns {string} A JSON stringified description
 */
export const processDescription = (description) => {
  // If description is already a JSON object
  if (typeof description === 'object' && description !== null) {
    return JSON.stringify(description);
  }
  
  // If description is a string
  if (typeof description === 'string') {
    try {
      // Attempt to convert text to JSON object
      return JSON.stringify(JSON.parse(description));
    } catch {
      // If conversion fails, return an empty JSON object or the original string
      return description.trim() ? JSON.stringify({ text: description }) : JSON.stringify({});
    }
  }
  
  // In case no description exists or is invalid
  return JSON.stringify({});
};

/**
 * Safely converts a value to a number
 * @param {string|number|null} value - The value to convert
 * @param {number} defaultValue - The default value if conversion fails
 * @returns {number} A numeric value
 */
export const safeParseNumber = (value, defaultValue = 0) => {
  if (value === null || value === undefined) return defaultValue;
  
  const parsedValue = Number(value);
  return isNaN(parsedValue) ? defaultValue : parsedValue;
};

/**
 * Cleans and transforms array of options
 * @param {Array} options - The options to clean
 * @returns {Array} Cleaned options
 */
export const cleanOptionsData = (options) => {
  if (!options) return [];
  return options.map((option) => ({
    name: option.name,
    id: option.id,
    values: option.values.map((value) => ({
      name: value.name,
      id: value.id,
    })),
  }));
};

/**
 * Cleans and transforms array of collections
 * @param {Array} collections - The collections to clean
 * @returns {Array} Cleaned collections
 */
export const cleanCollections = (collections) => {
  if (!collections) return [];
  return collections.map((collection) => ({
    collectionId: collection.collectionId,
    title: collection.title,
  }));
};
