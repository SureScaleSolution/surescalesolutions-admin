import { ValidationResult, TitleDescriptionPair } from './types';

/**
 * Validates an array of title-description pairs
 */
export const validateTitleDescriptionArray = (
  items: TitleDescriptionPair[],
  sectionName: string
): ValidationResult => {
  const errors: string[] = [];

  if (!Array.isArray(items)) {
    return {
      isValid: false,
      errors: [`${sectionName} list must be an array`]
    };
  }

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    // Check if item has required properties
    if (!item.title || !item.description) {
      errors.push(`Each ${sectionName.toLowerCase()} item must have both title and description`);
      break;
    }

    // Check if properties are strings
    if (typeof item.title !== 'string' || typeof item.description !== 'string') {
      errors.push(`${sectionName} title and description must be strings`);
      break;
    }

    // Check if properties are not empty after trimming
    if (item.title.trim().length === 0 || item.description.trim().length === 0) {
      errors.push(`${sectionName} title and description cannot be empty`);
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates challenges section
 */
export const validateChallenges = (
  challengesListStr: string | null
): ValidationResult => {
  if (!challengesListStr) {
    return { isValid: true, errors: [] };
  }

  try {
    const challengesList = JSON.parse(challengesListStr);
    return validateTitleDescriptionArray(challengesList, 'Challenge');
  } catch {
    return {
      isValid: false,
      errors: ['Invalid challenges list format']
    };
  }
};

/**
 * Validates approach section
 */
export const validateApproach = (
  approachListStr: string | null
): ValidationResult => {
  if (!approachListStr) {
    return { isValid: true, errors: [] };
  }

  try {
    const approachList = JSON.parse(approachListStr);
    return validateTitleDescriptionArray(approachList, 'Approach');
  } catch {
    return {
      isValid: false,
      errors: ['Invalid approach list format']
    };
  }
};

/**
 * Validates impact section
 */
export const validateImpact = (
  impactListStr: string | null
): ValidationResult => {
  if (!impactListStr) {
    return { isValid: true, errors: [] };
  }

  try {
    const impactList = JSON.parse(impactListStr);
    return validateTitleDescriptionArray(impactList, 'Impact');
  } catch {
    return {
      isValid: false,
      errors: ['Invalid impact list format']
    };
  }
};
