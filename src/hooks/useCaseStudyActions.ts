"use client";

import { useState } from "react";
import { caseStudyService } from "@/services";

interface UseCaseStudyActionsReturn {
  deleting: boolean;
  deleteCaseStudy: (id: string) => Promise<{ message: string }>;
}

export function useCaseStudyActions(): UseCaseStudyActionsReturn {
  const [deleting, setDeleting] = useState(false);

  const deleteCaseStudy = async (id: string) => {
    try {
      setDeleting(true);
      const result = await caseStudyService.deleteCaseStudy(id);
      return result;
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.message || "Failed to delete case study");
      } else {
        throw new Error("Failed to delete case study");
      }
    } finally {
      setDeleting(false);
    }
  };

  return {
    deleting,
    deleteCaseStudy,
  };
}
