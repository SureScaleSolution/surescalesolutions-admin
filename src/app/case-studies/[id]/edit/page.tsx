import { ContainerWithEdit } from "@/components/case-studies/ContainerWithEdit";
import getCaseStudyByIdAction from "@/actions/case-study/getCaseStudyByIdAction";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCaseStudyPage({ params }: PageProps) {
  const { id } = await params;
  let caseStudy = null;
  try {
    caseStudy = await getCaseStudyByIdAction(id);
  } catch (err) {
    console.error("Error fetching case study:", err);
  }

  if (!caseStudy) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-[400px]">
        <div className="text-lg">An error occurred</div>
        <Link
          href="/case-studies"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Go back to Case Studies
        </Link>
      </div>
    );
  }

  return <ContainerWithEdit caseStudy={caseStudy} isEditMode={true} />;
}
