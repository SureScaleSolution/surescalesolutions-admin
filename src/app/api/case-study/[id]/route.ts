import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { CaseStudyDocument } from "@/types/caseStudy";
import { uploadToCloudinary, deleteFromCloudinary } from "@/lib/cloudinary";
import { ObjectId } from "mongodb";
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

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    if (!(await verifyAuth(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid case study ID format" },
        { status: 400 }
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

    // Get existing case study
    const client = await clientPromise;
    const db = client.db("surescalesolutions");
    const collection = db.collection("case-studies");

    const existingCaseStudy = (await collection.findOne({
      _id: new ObjectId(id),
    })) as CaseStudyDocument | null;

    if (!existingCaseStudy) {
      return NextResponse.json(
        { success: false, error: "Case study not found" },
        { status: 404 }
      );
    }

    // Validate data (for edit mode, thumbnail image is optional if it already exists)
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
      isEdit: true,
      hasExistingThumbnail: !!existingCaseStudy.thumbnailImageUrl,
    });

    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: validationResult.errors.join(". ") },
        { status: 400 }
      );
    }

    // Start building the update document
    const updateDoc: Partial<CaseStudyDocument> = {
      thumbnailTitle,
      serviceType,
      caseStudyTitle,
      caseStudySubtitle,
      clientBackground,
      updatedAt: new Date(),
    };

    // Handle thumbnail image update
    let thumbnailImageUrl = existingCaseStudy.thumbnailImageUrl;
    if (thumbnailImage && thumbnailImage.size > 0) {
      // Delete old thumbnail image from S3
      if (existingCaseStudy.thumbnailImageUrl) {
        try {
          await deleteFromCloudinary(existingCaseStudy.thumbnailImageUrl);
        } catch (error) {
          console.warn("Failed to delete old thumbnail image from S3:", error);
        }
      }

      // Upload new thumbnail image
      const thumbnailBuffer = Buffer.from(await thumbnailImage.arrayBuffer());
      thumbnailImageUrl = await uploadToCloudinary(
        thumbnailBuffer,
        thumbnailImage.name
      );
    }
    updateDoc.thumbnailImageUrl = thumbnailImageUrl;

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

      // Handle challenge image
      let challengeImageUrl = existingCaseStudy.challenges?.challengeImageUrl;
      if (challengeImage && challengeImage.size > 0) {
        // Delete old challenge image if it exists
        if (existingCaseStudy.challenges?.challengeImageUrl) {
          try {
            await deleteFromCloudinary(existingCaseStudy.challenges.challengeImageUrl);
          } catch (error) {
            console.warn(
              "Failed to delete old challenge image from S3:",
              error
            );
          }
        }

        // Upload new challenge image
        const challengeBuffer = Buffer.from(await challengeImage.arrayBuffer());
        challengeImageUrl = await uploadToCloudinary(
          challengeBuffer,
          challengeImage.name
        );
      }

      if (challengeImageUrl) {
        challenges.challengeImageUrl = challengeImageUrl;
      }
    }
    updateDoc.challenges = challenges;

    // Handle approach
    let approach;
    if (approachListStr) {
      const approachList = JSON.parse(approachListStr);
      approach = { approachTitle, approachList };
    }
    updateDoc.approach = approach;

    // Handle impact
    let impact;
    if (impactListStr) {
      const impactList = JSON.parse(impactListStr);
      impact = { impactTitle, impactList };
    }
    updateDoc.impact = impact;

    // Handle result
    let result: { resultText?: string; resultImageUrl?: string } | undefined;
    if (resultText || (resultImage && resultImage.size > 0)) {
      result = { resultText };

      // Handle result image
      let resultImageUrl = existingCaseStudy.result?.resultImageUrl;
      if (resultImage && resultImage.size > 0) {
        // Delete old result image if it exists
        if (existingCaseStudy.result?.resultImageUrl) {
          try {
            await deleteFromCloudinary(existingCaseStudy.result.resultImageUrl);
          } catch (error) {
            console.warn("Failed to delete old result image from S3:", error);
          }
        }

        // Upload new result image
        const resultBuffer = Buffer.from(await resultImage.arrayBuffer());
        resultImageUrl = await uploadToCloudinary(
          resultBuffer,
          resultImage.name
        );
      }

      if (resultImageUrl) {
        result.resultImageUrl = resultImageUrl;
      }
    }
    updateDoc.result = result;

    // Handle testimonial
    let testimonial;
    if (testimonialTitle || testimonialText) {
      testimonial = { testimonialTitle, testimonialText };
    }
    updateDoc.testimonial = testimonial;

    // Update the case study in MongoDB
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateDoc }
    );

    if (updateResult.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Case study not found" },
        { status: 404 }
      );
    }

    // Revalidate the case studies page and cache to reflect the changes
    revalidatePath("/case-studies", "page");
    revalidateTag("case-studies");

    return NextResponse.json({
      success: true,
      message: "Case study updated successfully",
    });
  } catch (error) {
    console.error("Error updating case study:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Verify authentication
    if (!(await verifyAuth(request))) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await context.params;

    // Validate ObjectId format
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Invalid case study ID format" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("surescalesolutions");
    const collection = db.collection("case-studies");

    // Check if case study exists and get the document to extract image URLs
    const existingCaseStudy = (await collection.findOne({
      _id: new ObjectId(id),
    })) as CaseStudyDocument | null;
    if (!existingCaseStudy) {
      return NextResponse.json(
        { success: false, error: "Case study not found" },
        { status: 404 }
      );
    }

    // Collect all image URLs that need to be deleted from S3
    const imageUrls: string[] = [];

    // Add thumbnail image URL
    if (existingCaseStudy.thumbnailImageUrl) {
      imageUrls.push(existingCaseStudy.thumbnailImageUrl);
    }

    // Add challenge image URL
    if (existingCaseStudy.challenges?.challengeImageUrl) {
      imageUrls.push(existingCaseStudy.challenges.challengeImageUrl);
    }

    // Add result image URL
    if (existingCaseStudy.result?.resultImageUrl) {
      imageUrls.push(existingCaseStudy.result.resultImageUrl);
    }

    // Delete the case study from MongoDB first
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(id) });

    if (deleteResult.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Failed to delete case study" },
        { status: 500 }
      );
    }

    // Delete associated images from S3 (non-blocking - we log errors but don't fail the request)
    if (imageUrls.length > 0) {
      try {
        await Promise.all(
          imageUrls.map(async (url) => {
            try {
              await deleteFromCloudinary(url);
            } catch (error) {
              console.warn(`Failed to delete image ${url} from S3:`, error);
            }
          })
        );
      } catch (error) {
        console.error(`Error during S3 cleanup for case study ${id}:`, error);
        // Continue with success response - the case study was deleted from DB
      }
    }

    // Revalidate the case studies page and cache to reflect the changes
    revalidatePath("/case-studies", "page");
    revalidateTag("case-studies");

    return NextResponse.json({
      success: true,
      message: "Case study deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting case study:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
