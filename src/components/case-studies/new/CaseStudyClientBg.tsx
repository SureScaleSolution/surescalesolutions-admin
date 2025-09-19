import React from "react";
import { CaseStudyFormData } from "@/types/caseStudy";

interface CaseStudyClientBgProps {
  formData: CaseStudyFormData;
  updateFormData: (updates: Partial<CaseStudyFormData>) => void;
  error?: string;
}

export const CaseStudyClientBg: React.FC<CaseStudyClientBgProps> = ({
  formData,
  updateFormData,
  error,
}) => {
  return (
    <div className="flex  flex-col w-full items-center justify-center ">
      <div className="flex w-full items-center justify-center  flex-col gap-y-8 py-4">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
          Case Study
        </h2>
        <div className="flex flex-col gap-y-3 w-full">
          <div className="w-full flex items-center justify-center">
            <input
              type="text"
              value={formData.caseStudyTitle}
              onChange={(e) =>
                updateFormData({ caseStudyTitle: e.target.value })
              }
              className="w-full max-w-[800px] px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
              placeholder="Title of Case Study"
              required
            />
          </div>
          <div className="w-full flex items-center justify-center ">
            <input
              type="text"
              value={formData.caseStudySubtitle}
              onChange={(e) =>
                updateFormData({ caseStudySubtitle: e.target.value })
              }
              className="w-full max-w-[800px] px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20   text-sm md:text-base"
              placeholder="Sub-Title of Case Study"
              required
            />
          </div>
        </div>
        {error && (
          <div className="w-full max-w-[800px] mt-2">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}
      </div>
      <div className="flex w-full items-center justify-center  flex-col gap-y-8 py-4">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
          Client Background
        </h2>
        <div className="w-full flex items-center justify-center">
          <input
            type="text"
            value={formData.clientBackground || ""}
            onChange={(e) =>
              updateFormData({ clientBackground: e.target.value })
            }
            className="w-full max-w-[800px] px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
            placeholder="Client Background"
          />
        </div>
      </div>
    </div>
  );
};
