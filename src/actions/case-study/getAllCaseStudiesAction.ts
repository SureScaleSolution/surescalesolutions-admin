import clientPromise from "@/lib/mongodb";
import { CaseStudyCardDocument } from "@/types/caseStudy";
import { unstable_cache } from "next/cache";

async function getAllCaseStudiesUncached(): Promise<CaseStudyCardDocument[]> {
  try {
    const client = await clientPromise;
    const db = client.db("scalesolutions");
    const collection = db.collection("caseStudies");

    const caseStudies = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const normalized = caseStudies.map((d) => ({
      _id: d._id.toString(),
      thumbnailImageUrl: d.thumbnailImageUrl,
      thumbnailTitle: d.thumbnailTitle,
      serviceType: d.serviceType,
      caseStudyTitle: d.caseStudyTitle,
      caseStudySubtitle: d.caseStudySubtitle,
      caseStudyDescription: d.caseStudyDescription,
      createdAt: d.createdAt,
    }));
    return normalized;
  } catch (error) {
    console.error("Error fetching case studies:", error);
    throw new Error("Failed to fetch case studies");
  }
}

// Cache the function with a tag for revalidation
const getAllCaseStudiesAction = unstable_cache(
  getAllCaseStudiesUncached,
  ["case-studies"],
  {
    tags: ["case-studies"],
    revalidate: false, // Cache indefinitely until manually revalidated
  }
);

export default getAllCaseStudiesAction;
