import { ValidationResult } from './types';
import { validateRequiredString, validateFile, validateOptionalFile } from './common';
import { validateChallenges, validateApproach, validateImpact } from './caseStudy';

export interface CaseStudyValidationData {
  thumbnailImage: File | null;
  thumbnailTitle: string;
  serviceType: string;
  caseStudyTitle: string;
  caseStudySubtitle: string;
  challengesListStr?: string | null;
  challengeImage?: File | null;
  approachListStr?: string | null;
  impactListStr?: string | null;
  resultImage?: File | null;
  isEdit?: boolean;
  hasExistingThumbnail?: boolean;
}

/**
 * Validates all case study data
 */
export const validateCaseStudyData = (data: CaseStudyValidationData): ValidationResult => {
  const allErrors: string[] = [];

  // Validate mandatory fields
  // For edit mode, thumbnail image is optional if there's an existing one
  if (!data.isEdit || !data.hasExistingThumbnail) {
    const thumbnailImageValidation = validateFile(data.thumbnailImage, 'Thumbnail image');
    if (!thumbnailImageValidation.isValid) {
      allErrors.push(...thumbnailImageValidation.errors);
    }
  }

  const thumbnailTitleValidation = validateRequiredString(data.thumbnailTitle, 'Thumbnail title');
  if (!thumbnailTitleValidation.isValid) {
    allErrors.push(...thumbnailTitleValidation.errors);
  }

  const serviceTypeValidation = validateRequiredString(data.serviceType, 'Service type');
  if (!serviceTypeValidation.isValid) {
    allErrors.push(...serviceTypeValidation.errors);
  }

  const caseStudyTitleValidation = validateRequiredString(data.caseStudyTitle, 'Case study title');
  if (!caseStudyTitleValidation.isValid) {
    allErrors.push(...caseStudyTitleValidation.errors);
  }

  const caseStudySubtitleValidation = validateRequiredString(data.caseStudySubtitle, 'Case study subtitle');
  if (!caseStudySubtitleValidation.isValid) {
    allErrors.push(...caseStudySubtitleValidation.errors);
  }

  // Validate optional sections
  const challengesValidation = validateChallenges(data.challengesListStr || null);
  if (!challengesValidation.isValid) {
    allErrors.push(...challengesValidation.errors);
  }

  const challengeImageValidation = validateOptionalFile(data.challengeImage || null, 'Challenge image');
  if (!challengeImageValidation.isValid) {
    allErrors.push(...challengeImageValidation.errors);
  }

  const approachValidation = validateApproach(data.approachListStr || null);
  if (!approachValidation.isValid) {
    allErrors.push(...approachValidation.errors);
  }

  const impactValidation = validateImpact(data.impactListStr || null);
  if (!impactValidation.isValid) {
    allErrors.push(...impactValidation.errors);
  }

  const resultImageValidation = validateOptionalFile(data.resultImage || null, 'Result image');
  if (!resultImageValidation.isValid) {
    allErrors.push(...resultImageValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors
  };
};
