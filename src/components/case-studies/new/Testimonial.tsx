import React from "react";
import { CaseStudyFormData } from "@/types/caseStudy";

interface TestimonialProps {
  formData: CaseStudyFormData;
  updateFormData: (updates: Partial<CaseStudyFormData>) => void;
}

export const Testimonial: React.FC<TestimonialProps> = ({
  formData,
  updateFormData
}) => {
  const handleTestimonialTitleChange = (value: string) => {
    updateFormData({
      testimonial: {
        ...formData.testimonial,
        testimonialTitle: value
      }
    });
  };

  const handleTestimonialTextChange = (value: string) => {
    updateFormData({
      testimonial: {
        ...formData.testimonial,
        testimonialText: value
      }
    });
  };

  return (
    <div className="flex  flex-col w-full items-center justify-center ">
      <div className="flex w-full items-center justify-center  flex-col gap-y-8 py-4">
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-center">
          Testimonial
        </h2>
        <div className="flex flex-col gap-y-3 w-full">
          <div className="w-full flex items-center justify-center">
            <input
              type="text"
              value={formData.testimonial?.testimonialTitle || ''}
              onChange={(e) => handleTestimonialTitleChange(e.target.value)}
              className="w-full max-w-[800px] px-6 py-3 md:py-4 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base"
              placeholder="Testimonial Title"
            />
          </div>
          <div className="w-full flex items-center  justify-center ">
            <textarea
              value={formData.testimonial?.testimonialText || ''}
              onChange={(e) => handleTestimonialTextChange(e.target.value)}
              className="w-full max-w-[800px] px-6 py-3 md:py-4 h-32 md:h-40 border border-primary rounded md:rounded-md text-black placeholder-darkGray focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm md:text-base resize-none"
              placeholder="Testimonial Text"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
