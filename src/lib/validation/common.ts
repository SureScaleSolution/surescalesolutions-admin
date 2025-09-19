import { FileValidationOptions, ValidationResult } from './types';

/**
 * Validates if a string field is not empty after trimming
 */
export const validateRequiredString = (value: string | null | undefined, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return {
      isValid: false,
      errors: [`${fieldName} is required and cannot be empty`]
    };
  }
  return {
    isValid: true,
    errors: []
  };
};

/**
 * Validates file upload (size and type)
 */
export const validateFile = (
  file: File | null | undefined, 
  fieldName: string, 
  options: FileValidationOptions = {}
): ValidationResult => {
  const maxSize = options.maxSize || 5 * 1024 * 1024; // 5MB default
  const allowedTypes = options.allowedTypes || ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];
  
  const errors: string[] = [];

  if (!file) {
    return {
      isValid: false,
      errors: [`${fieldName} is required`]
    };
  }

  if (file.size > maxSize) {
    errors.push(`${fieldName} must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    const allowedExtensions = allowedTypes.map(type => type.split('/')[1]).join(', ');
    errors.push(`${fieldName} must be in ${allowedExtensions} format`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates optional file upload (size and type) - allows null/undefined
 */
export const validateOptionalFile = (
  file: File | null | undefined, 
  fieldName: string, 
  options: FileValidationOptions = {}
): ValidationResult => {
  if (!file) {
    return {
      isValid: true,
      errors: []
    };
  }

  return validateFile(file, fieldName, options);
};

/**
 * Validates JSON string
 */
export const validateJsonString = (jsonString: string | null | undefined, fieldName: string): ValidationResult => {
  if (!jsonString) {
    return {
      isValid: true,
      errors: []
    };
  }

  try {
    JSON.parse(jsonString);
    return {
      isValid: true,
      errors: []
    };
  } catch {
    return {
      isValid: false,
      errors: [`${fieldName} contains invalid JSON format`]
    };
  }
};
