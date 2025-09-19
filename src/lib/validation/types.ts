export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface TitleDescriptionPair {
  title: string;
  description: string;
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes, default 5MB
  allowedTypes?: string[]; // MIME types
}
