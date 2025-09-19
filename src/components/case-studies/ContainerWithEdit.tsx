"use client";
import React from "react";
import { CaseStudyClientBg } from "./new/CaseStudyClientBg";
import { Challenge } from "./new/Challenge";
import { Approach } from "./new/Approach";
import { Impact } from "./new/Impact";
import { UploadResult } from "./new/UploadResult";
import { Testimonial } from "./new/Testimonial";
import { Button } from "@/components/common/Button";
import {
  useCaseStudyFormWithEdit,
  ImagePreview as NewImagePreview,
} from "@/hooks/useCaseStudyFormWithEdit";
import { ImageUpload } from "@/components/common/ImageUpload";
import { CaseStudyDocument } from "@/types/caseStudy";
import { ImagePreview as OriginalImagePreview } from "@/hooks/useCaseStudyForm";
import { useRouter } from "next/navigation";

interface ContainerWithEditProps {
  caseStudy?: CaseStudyDocument;
  isEditMode?: boolean;
}

export const ContainerWithEdit = ({
  caseStudy,
  isEditMode = false,
}: ContainerWithEditProps) => {
  const router = useRouter();
  const {
    formData,
    imagePreviews,
    isSubmitting,
    errors,
    handleImageChange,
    updateFormData,
    submitForm,
  } = useCaseStudyFormWithEdit({ caseStudy, isEditMode });

  // Helper function to convert ImagePreview types
  const convertImagePreview = (
    preview: NewImagePreview | undefined
  ): OriginalImagePreview | undefined => {
    if (!preview) return undefined;
    if (preview.isExisting) {
      // For existing images, create a dummy file object
      return {
        file: new File([""], "existing", { type: "image/jpeg" }),
        url: preview.url,
      };
    }
    return preview.file ? { file: preview.file, url: preview.url } : undefined;
  };

  const serviceOptions = [
    "Amazon FBM & Dropshipping",
    "Account Reinstatement",
    "Walmart Market Place",
    "TikTok Shop Growth",
    "eBay Store Optimization",
    "Shopify Store Services",
    "Amazon FBA Wholesale",
    "Amazon PL & MPL",
  ];

  const handleSubmit = async () => {
    const response = await submitForm();
    if (response) {
      router.push("/case-studies"); // Redirect to case studies list after successful submission
    }
  };

  return (
    <section className="w-full">
      <div className="max-w-[1660px] mx-auto w-full px-4 sm:px-8 md:px-12 lg:px-24 py-10 sm:py-14 md:py-16 lg:py-20">
        <div className="flex flex-col items-center justify-center gap-y-8">
          <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
            {isEditMode
              ? "Edit Case Study Thumbnail"
              : "Add Case Study Thumbnail"}
          </h2>

          <div className="w-full max-w-[800px] flex flex-col gap-y-6">
            {/* File Upload */}
            <ImageUpload
              preview={convertImagePreview(imagePreviews.thumbnail)}
              onImageChange={(file) => handleImageChange("thumbnail", file)}
            />

            {/* Thumbnail Title Input */}
            <div className="w-full">
              <input
                type="text"
                value={formData.thumbnailTitle}
                onChange={(e) =>
                  updateFormData({ thumbnailTitle: e.target.value })
                }
                className="w-full max-w-[800px] px-4 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
                placeholder="Enter main Thumbnail Title, i.e. 100% recovery"
                required
              />
            </div>

            {/* Service Dropdown */}
            <div className="w-full relative">
              <select
                value={formData.serviceType}
                onChange={(e) =>
                  updateFormData({ serviceType: e.target.value })
                }
                className="w-full max-w-[800px] px-4 pr-10 py-3 md:py-4 border border-primary rounded md:rounded-md text-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base bg-white appearance-none"
                required>
                <option value="" disabled className="text-darkGray">
                  Select Service Type
                </option>
                {serviceOptions.map((service, index) => (
                  <option key={index} value={service} className="text-darkGray">
                    {service}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                  className="w-5 h-5 text-darkGray"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
            {/* Thumbnail Fields Error */}
            {errors.thumbnail && (
              <div className="w-full max-w-[800px] mt-2">
                <p className="text-red-500 text-sm">{errors.thumbnail}</p>
              </div>
            )}
          </div>
        </div>
        <ul className="mt-10 md:mt-16 lg:mt-20 flex-col flex gap-y-8 md:gap-y-12 md:py-4 lg:py-8 md:px-4 xl:px-0 md:border-primary md:border rounded md:rounded-xl w-full">
          <CaseStudyClientBg
            formData={formData}
            updateFormData={updateFormData}
            error={errors.caseStudy}
          />
          <Challenge
            formData={formData}
            updateFormData={updateFormData}
            imagePreview={convertImagePreview(imagePreviews.challenge)}
            onImageChange={(file: File | null) =>
              handleImageChange("challenge", file)
            }
            error={errors.challenges}
          />
          <Approach
            formData={formData}
            updateFormData={updateFormData}
            error={errors.approach}
          />
          <Impact
            formData={formData}
            updateFormData={updateFormData}
            error={errors.impact}
          />
          <UploadResult
            formData={formData}
            updateFormData={updateFormData}
            imagePreview={convertImagePreview(imagePreviews.result)}
            onImageChange={(file: File | null) =>
              handleImageChange("result", file)
            }
          />
          <Testimonial formData={formData} updateFormData={updateFormData} />

          <div className="flex flex-col items-center gap-4">
            {/* General Error Message Above Save Button */}
            {(errors.thumbnail ||
              errors.caseStudy ||
              errors.challenges ||
              errors.approach ||
              errors.impact) && (
              <div className="flex justify-center">
                <div className="w-full max-w-[400px] text-center">
                  <p className="text-red-500 text-sm mb-2">
                    Please fix the errors above before saving.
                  </p>
                </div>
              </div>
            )}

            <Button
              text={
                isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Save"
              }
              onClick={handleSubmit}
              disabled={isSubmitting}
            />
          </div>
        </ul>
      </div>
    </section>
  );
};
