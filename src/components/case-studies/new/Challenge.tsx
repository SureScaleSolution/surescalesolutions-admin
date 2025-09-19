import React from "react";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { CaseStudyFormData } from "@/types/caseStudy";
import { ImagePreview } from "@/hooks/useCaseStudyForm";
import { ImageUpload } from "@/components/common/ImageUpload";

interface ChallengeProps {
  formData: CaseStudyFormData;
  updateFormData: (updates: Partial<CaseStudyFormData>) => void;
  imagePreview?: ImagePreview;
  onImageChange: (file: File | null) => void;
  error?: string;
}

export const Challenge: React.FC<ChallengeProps> = ({
  formData,
  updateFormData,
  imagePreview,
  onImageChange,
  error,
}) => {
  const challengePairs = formData.challenges?.challengesList || [
    { title: "", description: "" },
  ];

  const addNewPair = () => {
    const newPairs = [...challengePairs, { title: "", description: "" }];
    updateFormData({
      challenges: {
        ...formData.challenges,
        challengesList: newPairs,
      },
    });
  };

  const removePair = (indexToRemove: number) => {
    if (challengePairs.length > 1) {
      const newPairs = challengePairs.filter(
        (_, index) => index !== indexToRemove
      );
      updateFormData({
        challenges: {
          ...formData.challenges,
          challengesList: newPairs,
        },
      });
    }
  };

  const updatePair = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newPairs = challengePairs.map((pair, i) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    updateFormData({
      challenges: {
        ...formData.challenges,
        challengesList: newPairs,
      },
    });
  };

  return (
    <div className="flex w-full items-center justify-center flex-col gap-y-8 py-4">
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
        Challenges
      </h2>

      {/* Challenges  */}
      <div className="flex flex-col gap-y-4 max-w-[800px] w-full">
        {challengePairs.map((pair, index) => (
          <div key={index} className="flex gap-x-1.5 md:gap-x-3 w-full">
            <div className="w-1/2 flex items-center justify-center">
              <input
                type="text"
                value={pair.title}
                onChange={(e) => updatePair(index, "title", e.target.value)}
                className="w-full px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
                placeholder="Title"
              />
            </div>
            <div className="w-1/2 flex items-center justify-center">
              <input
                type="text"
                value={pair.description}
                onChange={(e) =>
                  updatePair(index, "description", e.target.value)
                }
                className="w-full px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
                placeholder="Description"
              />
            </div>
            <button
              type="button"
              onClick={() =>
                index === challengePairs.length - 1
                  ? addNewPair()
                  : removePair(index)
              }
              className="px-3 py-2 bg-white text-primary hover:bg-primary/20 rounded  transition-colors duration-300  text-md">
              {index === challengePairs.length - 1 ? <FaPlus /> : <FaMinus />}
            </button>
          </div>
        ))}
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="w-full max-w-[800px]">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}
      
      {/* File Upload */}
      <ImageUpload preview={imagePreview} onImageChange={onImageChange} />
    </div>
  );
};
