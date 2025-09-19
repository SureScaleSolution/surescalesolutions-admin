import clientPromise from "@/lib/mongodb";
import { CaseStudyDocument } from "@/types/caseStudy";
import { ObjectId } from "mongodb";

export default async function getCaseStudyByIdAction(
  id: string
): Promise<CaseStudyDocument | null> {
  try {
    const client = await clientPromise;
    const db = client.db("scalesolutions");
    const collection = db.collection("caseStudies");

    const caseStudy = await collection.findOne({ _id: new ObjectId(id) });

    if (!caseStudy) {
      return null;
    }

    const normalized: CaseStudyDocument = {
      _id: caseStudy._id.toString(),
      thumbnailImageUrl: caseStudy.thumbnailImageUrl,
      thumbnailTitle: caseStudy.thumbnailTitle,
      serviceType: caseStudy.serviceType,
      caseStudyTitle: caseStudy.caseStudyTitle,
      caseStudySubtitle: caseStudy.caseStudySubtitle,
      clientBackground: caseStudy.clientBackground,
      challenges: caseStudy.challenges,
      approach: caseStudy.approach,
      impact: caseStudy.impact,
      result: caseStudy.result,
      testimonial: caseStudy.testimonial,
      createdAt: caseStudy.createdAt,
      updatedAt: caseStudy.updatedAt,
    };

    return normalized;
  } catch (error) {
    console.error("Error fetching case study:", error);
    throw new Error("Failed to fetch case study");
  }
}
