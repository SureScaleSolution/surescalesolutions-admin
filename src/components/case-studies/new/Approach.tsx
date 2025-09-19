import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CaseStudyFormData } from "@/types/caseStudy";

interface ApproachProps {
  formData: CaseStudyFormData;
  updateFormData: (updates: Partial<CaseStudyFormData>) => void;
  error?: string;
}

export const Approach: React.FC<ApproachProps> = ({
  formData,
  updateFormData,
  error
}) => {
  const approachPairs = formData.approach?.approachList || [{ title: "", description: "" }];

  const addNewPair = () => {
    const newPairs = [
      ...approachPairs,
      { title: "", description: "" },
    ];
    updateFormData({
      approach: {
        ...formData.approach,
        approachList: newPairs
      }
    });
  };

  const removePair = (indexToRemove: number) => {
    if (approachPairs.length > 1) {
      const newPairs = approachPairs.filter((_, index) => index !== indexToRemove);
      updateFormData({
        approach: {
          ...formData.approach,
          approachList: newPairs
        }
      });
    }
  };

  const updatePair = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newPairs = approachPairs.map((pair, i) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    updateFormData({
      approach: {
        ...formData.approach,
        approachList: newPairs
      }
    });
  };

  const handleApproachTitleChange = (value: string) => {
    updateFormData({
      approach: {
        ...formData.approach,
        approachTitle: value,
        approachList: approachPairs
      }
    });
  };

  return (
    <div className="flex w-full items-center justify-center flex-col gap-y-8 py-4">
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
        Our Approach
      </h2>

      {/* Title of our approach */}
      <div className="w-full max-w-[800px] mx-auto">
        <input
          type="text"
          value={formData.approach?.approachTitle || ''}
          onChange={(e) => handleApproachTitleChange(e.target.value)}
          className="w-full  px-4 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
          placeholder="Title of Our Approach"
        />
      </div>
      <div className="flex flex-col gap-y-4 max-w-[800px] w-full">
        {approachPairs.map((pair, index) => (
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
                index === approachPairs.length - 1
                  ? addNewPair()
                  : removePair(index)
              }
              className="px-3 py-2 bg-white text-primary hover:bg-primary/20 rounded  transition-colors duration-300 text-md"
            >
              {index === approachPairs.length - 1 ? <FaPlus /> : <FaMinus />}
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
    </div>
  );
};
