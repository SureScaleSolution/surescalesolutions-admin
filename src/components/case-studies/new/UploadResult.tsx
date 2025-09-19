import React from "react";
import { CaseStudyFormData } from "@/types/caseStudy";
import { ImagePreview } from "@/hooks/useCaseStudyForm";
import { ImageUpload } from "@/components/common/ImageUpload";

interface UploadResultProps {
  formData: CaseStudyFormData;
  updateFormData: (updates: Partial<CaseStudyFormData>) => void;
  imagePreview?: ImagePreview;
  onImageChange: (file: File | null) => void;
}

export const UploadResult: React.FC<UploadResultProps> = ({
  formData,
  updateFormData,
  imagePreview,
  onImageChange,
}) => {
  const handleResultTextChange = (value: string) => {
    updateFormData({
      result: {
        ...formData.result,
        resultText: value,
      },
    });
  };

  return (
    <div className="flex  flex-col w-full items-center justify-center ">
      <div className="flex w-full items-center justify-center  flex-col gap-y-8 py-4">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
          Upload Result{" "}
        </h2>
        <div className="w-full flex items-center justify-center">
          <input
            type="text"
            value={formData.result?.resultText || ""}
            onChange={(e) => handleResultTextChange(e.target.value)}
            className="w-full max-w-[800px] px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
            placeholder="Text about what you have achieved"
          />
        </div>
      </div>

      {/* File Upload */}
      <ImageUpload preview={imagePreview} onImageChange={onImageChange} />
    </div>
  );
};
