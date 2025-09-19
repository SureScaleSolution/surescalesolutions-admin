import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { CaseStudyDocument } from "@/types/caseStudy";
import { uploadToS3 } from "@/lib/cloudinary";
import { validateCaseStudyData } from "@/lib/validation";
import { verifyToken } from "@/lib/jwt";
import { AUTH_CONSTANTS } from "@/constants/auth";
import { revalidatePath, revalidateTag } from "next/cache";

// Helper function to verify authentication
async function verifyAuth(request: NextRequest): Promise<boolean> {
  // Try to get token from cookie first, then from Authorization header
  let token = request.cookies.get(AUTH_CONSTANTS.AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const authHeader = request.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    return false;
  }

  // Verify the token
  const payload = await verifyToken(token);
  return !!payload;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    if (!(await verifyAuth(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await request.formData();

    // Extract all form data
    const thumbnailImage = formData.get("thumbnailImage") as File;
    const thumbnailTitle = formData.get("thumbnailTitle") as string;
    const serviceType = formData.get("serviceType") as string;
    const caseStudyTitle = formData.get("caseStudyTitle") as string;
    const caseStudySubtitle = formData.get("caseStudySubtitle") as string;
    const clientBackground =
      (formData.get("clientBackground") as string) || undefined;
    const challengesListStr = formData.get("challengesList") as string;
    const challengeImage = formData.get("challengeImage") as File;
    const approachListStr = formData.get("approachList") as string;
    const approachTitle =
      (formData.get("approachTitle") as string) || undefined;
    const impactListStr = formData.get("impactList") as string;
    const impactTitle = (formData.get("impactTitle") as string) || undefined;
    const resultText = (formData.get("resultText") as string) || undefined;
    const resultImage = formData.get("resultImage") as File;
    const testimonialTitle =
      (formData.get("testimonialTitle") as string) || undefined;
    const testimonialText =
      (formData.get("testimonialText") as string) || undefined;

    // Validate all data using the validation system
    const validationResult = validateCaseStudyData({
      thumbnailImage,
      thumbnailTitle,
      serviceType,
      caseStudyTitle,
      caseStudySubtitle,
      challengesListStr,
      challengeImage,
      approachListStr,
      impactListStr,
      resultImage,
    });

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.errors.join(". ") },
        { status: 400 }
      );
    }

    // Upload thumbnail image to Cloudinary
    const thumbnailBuffer = Buffer.from(await thumbnailImage.arrayBuffer());
    const thumbnailImageUrl = await uploadToS3(
      thumbnailBuffer,
      thumbnailImage.name
    );

    // Handle challenges
    let challenges:
      | {
          challengesList: Array<{ title: string; description: string }>;
          challengeImageUrl?: string;
        }
      | undefined;

    if (challengesListStr) {
      const challengesList = JSON.parse(challengesListStr);
      challenges = { challengesList };

      if (challengeImage && challengeImage.size > 0) {
        const challengeBuffer = Buffer.from(await challengeImage.arrayBuffer());
        const challengeImageUrl = await uploadToS3(
          challengeBuffer,
          challengeImage.name
        );
        challenges.challengeImageUrl = challengeImageUrl;
      }
    }

    // Handle approach
    let approach;
    if (approachListStr) {
      const approachList = JSON.parse(approachListStr);
      approach = { approachTitle, approachList };
    }

    // Handle impact
    let impact;
    if (impactListStr) {
      const impactList = JSON.parse(impactListStr);
      impact = { impactTitle, impactList };
    }

    // Handle result
    let result: { resultText?: string; resultImageUrl?: string } | undefined;
    if (resultText || (resultImage && resultImage.size > 0)) {
      result = { resultText };

      if (resultImage && resultImage.size > 0) {
        const resultBuffer = Buffer.from(await resultImage.arrayBuffer());
        const resultImageUrl = await uploadToS3(
          resultBuffer,
          resultImage.name
        );
        result.resultImageUrl = resultImageUrl;
      }
    }

    // Handle testimonial
    let testimonial;
    if (testimonialTitle || testimonialText) {
      testimonial = { testimonialTitle, testimonialText };
    }

    // Create case study document
    const caseStudyDoc: Omit<CaseStudyDocument, "_id"> = {
      thumbnailImageUrl,
      thumbnailTitle,
      serviceType,
      caseStudyTitle,
      caseStudySubtitle,
      clientBackground,
      challenges,
      approach,
      impact,
      result,
      testimonial,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db("surescalesolutions");
    const collection = db.collection("case-studies");

    const insertResult = await collection.insertOne(caseStudyDoc);

    // Revalidate the case studies page and cache to reflect the new case study
    revalidatePath("/case-studies", "page");
    revalidateTag("case-studies");

    return NextResponse.json({
      success: true,
      id: insertResult.insertedId,
      message: "Case study created successfully",
    });
  } catch (error) {
    console.error("Error creating case study:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
