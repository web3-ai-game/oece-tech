import crypto from 'crypto';

/**
 * General utility functions
 */

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} Random string
 */
export function generateRandomString(length = 32) {
  return crypto.randomBytes(length).toString('hex').slice(0, length);
}

/**
 * Generate UUID v4
 * @returns {string} UUID
 */
export function generateUUID() {
  return crypto.randomUUID();
}

/**
 * Hash string using SHA256
 * @param {string} str - String to hash
 * @returns {string} Hashed string
 */
export function hashString(str) {
  return crypto.createHash('sha256').update(str).digest('hex');
}

/**
 * Sleep for specified milliseconds
 * @param {number} ms - Milliseconds to sleep
 * @returns {Promise<void>}
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Retry function with exponential backoff
 * @param {Function} fn - Function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in ms
 * @returns {Promise<any>} Function result
 */
export async function retry(fn, maxRetries = 3, delay = 1000) {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await sleep(delay * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}

/**
 * Debounce function
 * @param {Function} fn - Function to debounce
 * @param {number} delay - Delay in ms
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 * @param {Function} fn - Function to throttle
 * @param {number} delay - Delay in ms
 * @returns {Function} Throttled function
 */
export function throttle(fn, delay = 300) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      return fn.apply(this, args);
    }
  };
}

/**
 * Deep clone object
 * @param {Object} obj - Object to clone
 * @returns {Object} Cloned object
 */
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Deep merge objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
export function deepMerge(target, source) {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
}

/**
 * Check if value is plain object
 * @param {any} item - Value to check
 * @returns {boolean} True if plain object
 */
function isObject(item) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

/**
 * Paginate array
 * @param {Array} array - Array to paginate
 * @param {number} page - Page number (1-based)
 * @param {number} pageSize - Items per page
 * @returns {Object} Paginated result
 */
export function paginate(array, page = 1, pageSize = 10) {
  const offset = (page - 1) * pageSize;
  const items = array.slice(offset, offset + pageSize);
  const totalPages = Math.ceil(array.length / pageSize);
  
  return {
    items,
    pagination: {
      page,
      pageSize,
      total: array.length,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * Format bytes to human readable
 * @param {number} bytes - Bytes to format
 * @param {number} decimals - Decimal places
 * @returns {string} Formatted string
 */
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Format date to ISO string
 * @param {Date|string|number} date - Date to format
 * @returns {string} ISO string
 */
export function formatDate(date) {
  return new Date(date).toISOString();
}

/**
 * Parse query string to object
 * @param {string} queryString - Query string
 * @returns {Object} Parsed object
 */
export function parseQueryString(queryString) {
  const params = new URLSearchParams(queryString);
  const result = {};
  
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  
  return result;
}

/**
 * Build query string from object
 * @param {Object} obj - Object to convert
 * @returns {string} Query string
 */
export function buildQueryString(obj) {
  const params = new URLSearchParams();
  
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined && value !== null) {
      params.append(key, value.toString());
    }
  }
  
  return params.toString();
}

/**
 * Truncate string with ellipsis
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 100) {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + '...';
}

/**
 * Capitalize first letter
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert to camelCase
 * @param {string} str - String to convert
 * @returns {string} camelCase string
 */
export function toCamelCase(str) {
  return str.replace(/[-_](.)/g, (_, c) => c.toUpperCase());
}

/**
 * Convert to snake_case
 * @param {string} str - String to convert
 * @returns {string} snake_case string
 */
export function toSnakeCase(str) {
  return str.replace(/([A-Z])/g, '_$1').toLowerCase();
}

/**
 * Remove duplicates from array
 * @param {Array} array - Array with duplicates
 * @returns {Array} Array without duplicates
 */
export function removeDuplicates(array) {
  return [...new Set(array)];
}

/**
 * Chunk array into smaller arrays
 * @param {Array} array - Array to chunk
 * @param {number} size - Chunk size
 * @returns {Array<Array>} Chunked arrays
 */
export function chunk(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Pick keys from object
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to pick
 * @returns {Object} Object with picked keys
 */
export function pick(obj, keys) {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
    return result;
  }, {});
}

/**
 * Omit keys from object
 * @param {Object} obj - Source object
 * @param {Array<string>} keys - Keys to omit
 * @returns {Object} Object without omitted keys
 */
export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export default {
  generateRandomString,
  generateUUID,
  hashString,
  sleep,
  retry,
  debounce,
  throttle,
  deepClone,
  deepMerge,
  paginate,
  formatBytes,
  formatDate,
  parseQueryString,
  buildQueryString,
  truncate,
  capitalize,
  toCamelCase,
  toSnakeCase,
  removeDuplicates,
  chunk,
  pick,
  omit,
};
