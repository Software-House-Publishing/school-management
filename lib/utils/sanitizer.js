// lib/utils/sanitizer.js

/**
 * Sanitizes an object to only include whitelisted fields
 * @param {object} data - Raw data object
 * @param {string[]} allowedFields - Array of allowed field names
 * @param {object} options - Optional configuration
 * @returns {object} Sanitized object
 */
export function sanitizeFields(data, allowedFields, options = {}) {
  const {
    strict = true,           // If true, throw error when no valid fields found
    allowNested = false,     // If true, allow nested object updates
    logRejected = false,     // If true, log rejected fields
  } = options;

  if (!data || typeof data !== 'object') {
    return {};
  }

  const sanitized = {};
  const rejected = [];

  for (const key of Object.keys(data)) {
    if (allowedFields.includes(key)) {
      sanitized[key] = data[key];
    } else {
      rejected.push(key);
    }
  }

  // Log rejected fields if enabled
  if (logRejected && rejected.length > 0) {
    console.warn('Rejected fields:', rejected);
  }

  // Strict mode: throw error if no valid fields
  if (strict && Object.keys(sanitized).length === 0) {
    const error = new Error('No valid fields provided for update');
    error.statusCode = 400;
    throw error;
  }

  return sanitized;
}

/**
 * Picks specific fields from an object
 * @param {object} data - Source object
 * @param {string[]} fields - Fields to pick
 * @returns {object} Object with only specified fields
 */
export function pick(data, fields) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const result = {};
  
  for (const field of fields) {
    if (field in data) {
      result[field] = data[field];
    }
  }

  return result;
}

/**
 * Omits specific fields from an object
 * @param {object} data - Source object
 * @param {string[]} fields - Fields to omit
 * @returns {object} Object without specified fields
 */
export function omit(data, fields) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const result = { ...data };
  
  for (const field of fields) {
    delete result[field];
  }

  return result;
}

/**
 * Validates and sanitizes nested object updates
 * @param {object} data - Raw data
 * @param {object} schema - Schema defining allowed fields and nested structures
 * @returns {object} Sanitized data
 */
export function sanitizeNested(data, schema) {
  if (!data || typeof data !== 'object') {
    return {};
  }

  const sanitized = {};

  for (const [key, value] of Object.entries(data)) {
    // Check if field is in schema
    if (!schema[key]) {
      continue;
    }

    const fieldSchema = schema[key];

    // If field schema is an object, recursively sanitize
    if (typeof fieldSchema === 'object' && !Array.isArray(fieldSchema)) {
      if (typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = sanitizeNested(value, fieldSchema);
      }
    } else {
      // Direct field assignment
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Common field whitelists for different entities
 */
export const FIELD_WHITELISTS = {
  student: [
    'firstName',
    'lastName',
    'gender',
    'dateOfBirth',
    'photoUrl',
    'address',
    'phone',
    'email',
    'language',
    'guardians',
    'enrollment',
    'academics',
    'attendance',
    'activities',
    'health',
    'finance',
    'documents',
  ],
  
  user: [
    'name',
    'email',
    'phone',
    'photoUrl',
  ],
  
  // Add more entity whitelists as needed
};

/**
 * Common field blacklists (fields that should never be updated via API)
 */
export const PROTECTED_FIELDS = [
  '_id',
  'id',
  'createdAt',
  'updatedAt',
  '__v',
  'passwordHash',
  'password',
  'role', // Should be updated via separate endpoint with extra validation
  'createdBy',
  'isDeleted',
  'deletedAt',
];

/**
 * Ensures protected fields are not in the update object
 * @param {object} data - Update data
 * @throws {Error} If protected fields are present
 */
export function ensureNoProtectedFields(data) {
  const foundProtected = [];

  for (const key of Object.keys(data)) {
    if (PROTECTED_FIELDS.includes(key)) {
      foundProtected.push(key);
    }
  }

  if (foundProtected.length > 0) {
    const error = new Error(
      `Cannot update protected fields: ${foundProtected.join(', ')}`
    );
    error.statusCode = 403;
    throw error;
  }
}