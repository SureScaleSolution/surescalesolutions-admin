import { ApiResponse } from "@/types/api";

class CaseStudyService {
  /**
   * Delete a case study
   */
  async deleteCaseStudy(id: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`/api/case-study/${id}`, {
        method: "DELETE",
        credentials: "include", // Include cookies for authentication
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<null> = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to delete case study");
      }
      return { message: data.message || "Case study deleted successfully" };
    } catch (error) {
      console.error("Error deleting case study:", error);
      throw new Error("Failed to delete case study");
    }
  }
}

// Export a singleton instance
export const caseStudyService = new CaseStudyService();
