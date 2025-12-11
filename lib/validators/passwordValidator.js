// lib/validators/passwordValidator.js

/**
 * Password validation configuration
 */
const PASSWORD_CONFIG = {
  minLength: 8,
  maxLength: 128,
  requireLetters: true,
  requireNumbers: true,
  requireUpperCase: false,
  requireLowerCase: false,
  requireSpecialChars: false,
};

/**
 * Validates password strength based on configuration
 * @param {string} password 
 * @param {object} config 
 * @returns {object} 
 */
export function validatePassword(password, config = PASSWORD_CONFIG) {
  // Merge custom config with defaults
  const settings = { ...PASSWORD_CONFIG, ...config };

  // Check if password exists
  if (password === null || password === undefined) {
    return {
      isValid: false,
      message: "Password is required",
    };
  }

  // Trim whitespace
  const trimmedPassword = password.trim();

  // Check for empty or whitespace-only password
  if (!trimmedPassword) {
    return {
      isValid: false,
      message: "Password cannot be empty or contain only whitespace",
    };
  }

  // Minimum length validation
  if (trimmedPassword.length < settings.minLength) {
    return {
      isValid: false,
      message: `Password must be at least ${settings.minLength} characters long`,
    };
  }

  // Maximum length validation
  if (trimmedPassword.length > settings.maxLength) {
    return {
      isValid: false,
      message: `Password must not exceed ${settings.maxLength} characters`,
    };
  }

  // Letters validation
  if (settings.requireLetters && !/[a-zA-Z]/.test(trimmedPassword)) {
    return {
      isValid: false,
      message: "Password must contain at least one letter",
    };
  }

  // Numbers validation
  if (settings.requireNumbers && !/[0-9]/.test(trimmedPassword)) {
    return {
      isValid: false,
      message: "Password must contain at least one number",
    };
  }

  // Uppercase validation
  if (settings.requireUpperCase && !/[A-Z]/.test(trimmedPassword)) {
    return {
      isValid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  // Lowercase validation
  if (settings.requireLowerCase && !/[a-z]/.test(trimmedPassword)) {
    return {
      isValid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  // Special characters validation
  if (settings.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmedPassword)) {
    return {
      isValid: false,
      message: "Password must contain at least one special character (!@#$%^&*...)",
    };
  }

  // All validations passed
  return {
    isValid: true,
    message: "Password is valid",
    trimmedPassword, // Return trimmed version for use in hashing
  };
}

/**
 * Validates password with custom regex pattern
 * @param {string} password 
 * @param {RegExp} pattern 
 * @param {string} errorMessage
 * @returns {object} 
 */
export function validatePasswordWithRegex(password, pattern, errorMessage) {
  const trimmedPassword = password?.trim();

  if (!trimmedPassword) {
    return {
      isValid: false,
      message: "Password cannot be empty",
    };
  }

  if (!pattern.test(trimmedPassword)) {
    return {
      isValid: false,
      message: errorMessage || "Password does not meet requirements",
    };
  }

  return {
    isValid: true,
    message: "Password is valid",
    trimmedPassword,
  };
}

/**
 * Get password requirements as a readable string
 * @param {object} config - Password configuration
 * @returns {string} Human-readable requirements
 */
export function getPasswordRequirements(config = PASSWORD_CONFIG) {
  const requirements = [];
  
  requirements.push(`At least ${config.minLength} characters`);
  
  if (config.requireLetters) requirements.push("letters");
  if (config.requireNumbers) requirements.push("numbers");
  if (config.requireUpperCase) requirements.push("uppercase letters");
  if (config.requireLowerCase) requirements.push("lowercase letters");
  if (config.requireSpecialChars) requirements.push("special characters");

  return `Password must contain: ${requirements.join(", ")}`;
}

// Export default configuration
export { PASSWORD_CONFIG };