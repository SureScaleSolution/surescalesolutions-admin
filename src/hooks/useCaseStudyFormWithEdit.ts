import { useState, useCallback, useEffect } from "react";
import { CaseStudyFormData, CaseStudyDocument } from "@/types/caseStudy";

export interface ImagePreview {
  file?: File;
  url: string;
  isExisting?: boolean;
}

interface UseCaseStudyFormProps {
  caseStudy?: CaseStudyDocument;
  isEditMode?: boolean;
}

export const useCaseStudyFormWithEdit = ({ 
  caseStudy, 
  isEditMode = false 
}: UseCaseStudyFormProps = {}) => {
  const [formData, setFormData] = useState<CaseStudyFormData>({
    thumbnailImage: null,
    thumbnailTitle: "",
    serviceType: "",
    caseStudyTitle: "",
    caseStudySubtitle: "",
    clientBackground: "",
    challenges: {
      challengeImage: null,
      challengesList: [{ title: "", description: "" }],
    },
    approach: {
      approachTitle: "",
      approachList: [{ title: "", description: "" }],
    },
    impact: {
      impactTitle: "",
      impactList: [{ title: "", description: "" }],
    },
    result: {
      resultText: "",
      resultImage: null,
    },
    testimonial: {
      testimonialTitle: "",
      testimonialText: "",
    },
  });

  const [imagePreviews, setImagePreviews] = useState<{
    thumbnail?: ImagePreview;
    challenge?: ImagePreview;
    result?: ImagePreview;
  }>({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<{
    challenges?: string;
    approach?: string;
    impact?: string;
    thumbnail?: string;
    caseStudy?: string;
  }>({});

  // Populate form data when editing
  useEffect(() => {
    if (isEditMode && caseStudy) {
      setFormData({
        thumbnailImage: null, // Will be handled separately for existing images
        thumbnailTitle: caseStudy.thumbnailTitle || "",
        serviceType: caseStudy.serviceType || "",
        caseStudyTitle: caseStudy.caseStudyTitle || "",
        caseStudySubtitle: caseStudy.caseStudySubtitle || "",
        clientBackground: caseStudy.clientBackground || "",
        challenges: {
          challengeImage: null, // Will be handled separately for existing images
          challengesList: caseStudy.challenges?.challengesList || [{ title: "", description: "" }],
        },
        approach: {
          approachTitle: caseStudy.approach?.approachTitle || "",
          approachList: caseStudy.approach?.approachList || [{ title: "", description: "" }],
        },
        impact: {
          impactTitle: caseStudy.impact?.impactTitle || "",
          impactList: caseStudy.impact?.impactList || [{ title: "", description: "" }],
        },
        result: {
          resultText: caseStudy.result?.resultText || "",
          resultImage: null, // Will be handled separately for existing images
        },
        testimonial: {
          testimonialTitle: caseStudy.testimonial?.testimonialTitle || "",
          testimonialText: caseStudy.testimonial?.testimonialText || "",
        },
      });

      // Set up image previews for existing images
      const existingPreviews: {
        thumbnail?: ImagePreview;
        challenge?: ImagePreview;
        result?: ImagePreview;
      } = {};
      if (caseStudy.thumbnailImageUrl) {
        existingPreviews.thumbnail = {
          url: caseStudy.thumbnailImageUrl,
          isExisting: true
        };
      }
      if (caseStudy.challenges?.challengeImageUrl) {
        existingPreviews.challenge = {
          url: caseStudy.challenges.challengeImageUrl,
          isExisting: true
        };
      }
      if (caseStudy.result?.resultImageUrl) {
        existingPreviews.result = {
          url: caseStudy.result.resultImageUrl,
          isExisting: true
        };
      }
      setImagePreviews(existingPreviews);
    }
  }, [isEditMode, caseStudy]);

  const handleImageChange = useCallback(
    (type: "thumbnail" | "challenge" | "result", file: File | null) => {
      if (file) {
        // Validate file size
        if (file.size > 5 * 1024 * 1024) {
          alert("Image must be less than 5MB");
          return;
        }

        // Validate file type
        if (!file.type.match(/^image\/(jpeg|jpg|webp|png)$/)) {
          alert("Image must be in webp, jpg, or png format");
          return;
        }

        const url = URL.createObjectURL(file);
        setImagePreviews((prev) => ({
          ...prev,
          [type]: { file, url, isExisting: false },
        }));

        // Update form data
        if (type === "thumbnail") {
          setFormData((prev) => ({ ...prev, thumbnailImage: file }));
        } else if (type === "challenge") {
          setFormData((prev) => ({
            ...prev,
            challenges: { ...prev.challenges!, challengeImage: file },
          }));
        } else if (type === "result") {
          setFormData((prev) => ({
            ...prev,
            result: { ...prev.result!, resultImage: file },
          }));
        }
      } else {
        // Remove image
        setImagePreviews((prev) => {
          const newPreviews = { ...prev };
          if (newPreviews[type] && !newPreviews[type]?.isExisting) {
            URL.revokeObjectURL(newPreviews[type]!.url);
          }
          delete newPreviews[type];
          return newPreviews;
        });

        // Update form data
        if (type === "thumbnail") {
          setFormData((prev) => ({ ...prev, thumbnailImage: null }));
        } else if (type === "challenge") {
          setFormData((prev) => ({
            ...prev,
            challenges: { ...prev.challenges!, challengeImage: null },
          }));
        } else if (type === "result") {
          setFormData((prev) => ({
            ...prev,
            result: { ...prev.result!, resultImage: null },
          }));
        }
      }
    },
    []
  );

  const updateFormData = useCallback((updates: Partial<CaseStudyFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Clear errors when user starts editing
    setErrors({});
  }, []);

  const submitForm = useCallback(async () => {
    // Clear previous errors
    setErrors({});

    const newErrors: {
      challenges?: string;
      approach?: string;
      impact?: string;
      thumbnail?: string;
      caseStudy?: string;
    } = {};

    // Validate mandatory fields
    if (
      (!formData.thumbnailImage && !isEditMode) ||
      !formData.thumbnailTitle ||
      !formData.serviceType
    ) {
      newErrors.thumbnail =
        "Please fill in all mandatory fields: Thumbnail Image, Thumbnail Title and Service Type.";
    }

    // For edit mode, allow existing thumbnail image
    if (isEditMode && !formData.thumbnailImage && !imagePreviews.thumbnail?.isExisting) {
      newErrors.thumbnail =
        "Please fill in all mandatory fields: Thumbnail Image, Thumbnail Title and Service Type.";
    }

    if (!formData.caseStudyTitle || !formData.caseStudySubtitle) {
      newErrors.caseStudy =
        "Please fill in Case Study Title and Case Study Subtitle";
    }

    // Helper function to validate and filter title-description pairs
    const validateAndFilterPairs = (
      pairs: Array<{ title: string; description: string }>,
      sectionName: string
    ) => {
      const filteredPairs: Array<{ title: string; description: string }> = [];
      let hasError = false;

      for (const pair of pairs) {
        const hasTitle = pair.title.trim().length > 0;
        const hasDescription = pair.description.trim().length > 0;

        // If title is provided, description should be mandatory
        if (hasTitle && !hasDescription) {
          newErrors[sectionName as keyof typeof newErrors] =
            "If you provide a title, description is mandatory. Please fill in all descriptions or remove empty titles.";
          hasError = true;
          break;
        }

        // Only include pairs where both title and description are provided
        if (hasTitle && hasDescription) {
          filteredPairs.push({
            title: pair.title.trim(),
            description: pair.description.trim(),
          });
        }
      }

      return hasError ? null : filteredPairs;
    };

    // Validate all sections
    let validChallenges: Array<{ title: string; description: string }> | null =
      [];
    let validApproach: Array<{ title: string; description: string }> | null =
      [];
    let validImpact: Array<{ title: string; description: string }> | null = [];

    // Validate challenges
    if (formData.challenges?.challengesList) {
      validChallenges = validateAndFilterPairs(
        formData.challenges.challengesList,
        "challenges"
      );
    }

    // Validate approach
    if (formData.approach?.approachList) {
      validApproach = validateAndFilterPairs(
        formData.approach.approachList,
        "approach"
      );
    }

    // Validate impact
    if (formData.impact?.impactList) {
      validImpact = validateAndFilterPairs(
        formData.impact.impactList,
        "impact"
      );
    }

    // If there are any errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }

    setIsSubmitting(true);

    try {
      const submitFormData = new FormData();

      // Add mandatory fields
      if (formData.thumbnailImage) {
        submitFormData.append("thumbnailImage", formData.thumbnailImage);
      }
      submitFormData.append("thumbnailTitle", formData.thumbnailTitle);
      submitFormData.append("serviceType", formData.serviceType);
      submitFormData.append("caseStudyTitle", formData.caseStudyTitle);
      submitFormData.append("caseStudySubtitle", formData.caseStudySubtitle);

      // Add optional fields
      if (formData.clientBackground) {
        submitFormData.append("clientBackground", formData.clientBackground);
      }

      // Add challenges
      if (validChallenges && validChallenges.length > 0) {
        submitFormData.append(
          "challengesList",
          JSON.stringify(validChallenges)
        );
        if (formData.challenges?.challengeImage) {
          submitFormData.append(
            "challengeImage",
            formData.challenges.challengeImage
          );
        }
      }

      // Add approach
      if (validApproach && validApproach.length > 0) {
        submitFormData.append("approachList", JSON.stringify(validApproach));
        if (formData.approach?.approachTitle) {
          submitFormData.append(
            "approachTitle",
            formData.approach.approachTitle
          );
        }
      }

      // Add impact
      if (validImpact && validImpact.length > 0) {
        submitFormData.append("impactList", JSON.stringify(validImpact));
        if (formData.impact?.impactTitle) {
          submitFormData.append("impactTitle", formData.impact.impactTitle);
        }
      }

      // Add result
      if (formData.result?.resultText || formData.result?.resultImage) {
        if (formData.result.resultText) {
          submitFormData.append("resultText", formData.result.resultText);
        }
        if (formData.result.resultImage) {
          submitFormData.append("resultImage", formData.result.resultImage);
        }
      }

      // Add testimonial
      if (
        formData.testimonial?.testimonialTitle ||
        formData.testimonial?.testimonialText
      ) {
        if (formData.testimonial.testimonialTitle) {
          submitFormData.append(
            "testimonialTitle",
            formData.testimonial.testimonialTitle
          );
        }
        if (formData.testimonial.testimonialText) {
          submitFormData.append(
            "testimonialText",
            formData.testimonial.testimonialText
          );
        }
      }

      const url = isEditMode ? `/api/case-study/${caseStudy?._id}` : "/api/case-study";
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: submitFormData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`Case study ${isEditMode ? 'updated' : 'created'} successfully!`);
        // Clear errors on success
        setErrors({});
        
        if (!isEditMode) {
          // Reset form only for create mode
          setFormData({
            thumbnailImage: null,
            thumbnailTitle: "",
            serviceType: "",
            caseStudyTitle: "",
            caseStudySubtitle: "",
            clientBackground: "",
            challenges: {
              challengeImage: null,
              challengesList: [{ title: "", description: "" }],
            },
            approach: {
              approachTitle: "",
              approachList: [{ title: "", description: "" }],
            },
            impact: {
              impactTitle: "",
              impactList: [{ title: "", description: "" }],
            },
            result: {
              resultText: "",
              resultImage: null,
            },
            testimonial: {
              testimonialTitle: "",
              testimonialText: "",
            },
          });

          // Clear image previews
          Object.values(imagePreviews).forEach((preview) => {
            if (preview && !preview.isExisting) URL.revokeObjectURL(preview.url);
          });
          setImagePreviews({});
        }

        return true;
      } else {
        alert(`Error: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, imagePreviews, isEditMode, caseStudy?._id]);

  return {
    formData,
    imagePreviews,
    isSubmitting,
    errors,
    handleImageChange,
    updateFormData,
    submitForm,
    isEditMode,
  };
};
