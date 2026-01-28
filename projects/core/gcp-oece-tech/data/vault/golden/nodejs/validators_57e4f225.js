/**
 * Common validation utilities
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format (alphanumeric, underscores, hyphens)
 * @param {string} username - Username to validate
 * @param {number} minLength - Minimum length (default: 3)
 * @param {number} maxLength - Maximum length (default: 30)
 * @returns {boolean} True if valid
 */
export function isValidUsername(username, minLength = 3, maxLength = 30) {
  if (!username || typeof username !== 'string') return false;
  if (username.length < minLength || username.length > maxLength) return false;
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  return usernameRegex.test(username);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @param {number} minLength - Minimum length (default: 8)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePassword(password, minLength = 8) {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { valid: false, errors };
  }
  
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Sanitize HTML input to prevent XSS
 * @param {string} input - Input to sanitize
 * @returns {string} Sanitized input
 */
export function sanitizeHtml(input) {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate object against schema
 * @param {Object} obj - Object to validate
 * @param {Object} schema - Schema definition
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateSchema(obj, schema) {
  const errors = [];
  
  for (const [key, rules] of Object.entries(schema)) {
    const value = obj[key];
    
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${key} is required`);
      continue;
    }
    
    if (value !== undefined && value !== null) {
      if (rules.type && typeof value !== rules.type) {
        errors.push(`${key} must be of type ${rules.type}`);
      }
      
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${key} must be at least ${rules.minLength} characters`);
      }
      
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${key} must be at most ${rules.maxLength} characters`);
      }
      
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${key} has invalid format`);
      }
      
      if (rules.custom && typeof rules.custom === 'function') {
        const customResult = rules.custom(value);
        if (customResult !== true) {
          errors.push(customResult || `${key} failed custom validation`);
        }
      }
    }
  }
  
  return { valid: errors.length === 0, errors };
}

export default {
  isValidEmail,
  isValidUsername,
  validatePassword,
  sanitizeHtml,
  validateSchema,
};
