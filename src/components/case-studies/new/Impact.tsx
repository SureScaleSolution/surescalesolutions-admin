import React from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { CaseStudyFormData } from "@/types/caseStudy";

interface ImpactProps {
  formData: CaseStudyFormData;
  updateFormData: (updates: Partial<CaseStudyFormData>) => void;
  error?: string;
}

export const Impact: React.FC<ImpactProps> = ({
  formData,
  updateFormData,
  error
}) => {
  const impactPairs = formData.impact?.impactList || [{ title: "", description: "" }];

  const addNewPair = () => {
    const newPairs = [
      ...impactPairs,
      { title: "", description: "" },
    ];
    updateFormData({
      impact: {
        ...formData.impact,
        impactList: newPairs
      }
    });
  };

  const removePair = (indexToRemove: number) => {
    if (impactPairs.length > 1) {
      const newPairs = impactPairs.filter((_, index) => index !== indexToRemove);
      updateFormData({
        impact: {
          ...formData.impact,
          impactList: newPairs
        }
      });
    }
  };

  const updatePair = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    const newPairs = impactPairs.map((pair, i) =>
      i === index ? { ...pair, [field]: value } : pair
    );
    updateFormData({
      impact: {
        ...formData.impact,
        impactList: newPairs
      }
    });
  };

  const handleImpactTitleChange = (value: string) => {
    updateFormData({
      impact: {
        ...formData.impact,
        impactTitle: value,
        impactList: impactPairs
      }
    });
  };

  return (
    <div className="flex w-full items-center justify-center flex-col gap-y-8 py-4">
      <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
        The Impact
      </h2>

      {/* Title of our impact */}
      <div className="w-full max-w-[800px] mx-auto">
        <input
          type="text"
          value={formData.impact?.impactTitle || ''}
          onChange={(e) => handleImpactTitleChange(e.target.value)}
          className="w-full  px-4 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
          placeholder="Title of the Impact"
        />
      </div>
      <div className="flex flex-col gap-y-4 max-w-[800px] w-full">
        {impactPairs.map((pair, index) => (
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
                index === impactPairs.length - 1
                  ? addNewPair()
                  : removePair(index)
              }
              className="px-3 py-2 bg-white text-primary hover:bg-primary/20 rounded  transition-colors duration-300  text-md"
            >
              {index === impactPairs.length - 1 ? <FaPlus /> : <FaMinus />}
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
