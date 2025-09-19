export interface CaseStudyFormData {
  // Mandatory fields
  thumbnailImage: File | null;
  thumbnailTitle: string;
  serviceType: string;
  caseStudyTitle: string;
  caseStudySubtitle: string;

  // Optional fields
  clientBackground?: string;

  challenges?: {
    challengeImage?: File | null;
    challengesList: Array<{
      title: string;
      description: string;
    }>;
  };

  approach?: {
    approachTitle?: string;
    approachList: Array<{
      title: string;
      description: string;
    }>;
  };

  impact?: {
    impactTitle?: string;
    impactList: Array<{
      title: string;
      description: string;
    }>;
  };

  result?: {
    resultText?: string;
    resultImage?: File | null;
  };

  testimonial?: {
    testimonialTitle?: string;
    testimonialText?: string;
  };
}

export interface CaseStudyDocument {
  _id?: string;
  thumbnailImageUrl: string;
  thumbnailTitle: string;
  serviceType: string;
  caseStudyTitle: string;
  caseStudySubtitle: string;
  clientBackground?: string;
  challenges?: {
    challengeImageUrl?: string;
    challengesList: Array<{
      title: string;
      description: string;
    }>;
  };
  approach?: {
    approachTitle?: string;
    approachList: Array<{
      title: string;
      description: string;
    }>;
  };
  impact?: {
    impactTitle?: string;
    impactList: Array<{
      title: string;
      description: string;
    }>;
  };
  result?: {
    resultText?: string;
    resultImageUrl?: string;
  };
  testimonial?: {
    testimonialTitle?: string;
    testimonialText?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CaseStudyCardDocument {
  _id: string;
  thumbnailImageUrl: string;
  thumbnailTitle: string;
  serviceType: string;
  caseStudyTitle: string;
  caseStudySubtitle: string;
  createdAt: Date;
}
