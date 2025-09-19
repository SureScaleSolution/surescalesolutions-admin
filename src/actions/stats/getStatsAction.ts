import clientPromise from "@/lib/mongodb";
import { Stats } from "@/types/stats";

export default async function getStatsAction(): Promise<Stats> {
  try {
    const client = await clientPromise;
    const db = client.db("scalesolutions");
    const collection = db.collection("caseStudies");
    const stats = await collection.countDocuments();
    return { totalCaseStudies: stats };
  } catch (error) {
    console.error("Error fetching stats:", error);
    throw new Error("Failed to fetch stats");
  }
}
