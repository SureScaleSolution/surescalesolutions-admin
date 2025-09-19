import React from "react";
import Link from "next/link";
import { FiPlus, FiAlertCircle } from "react-icons/fi";
import getAllCaseStudiesAction from "@/actions/case-study/getAllCaseStudiesAction";
import { CaseStudyCardDocument } from "@/types/caseStudy";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";

export default async function CaseStudies() {
  try {
    const caseStudies = await getAllCaseStudiesAction();
    if (caseStudies.length === 0) {
      return <EmptyState />;
    }
    return <CaseStudiesList caseStudies={caseStudies} />;
  } catch (error) {
    let errorMessage = "An unknown error occurred";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return <ErrorState error={errorMessage} />;
  }
}

// Error component for client-side errors
function ErrorState({ error }: { error: string }) {
  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <div className="text-red-600 mb-4">
            <FiAlertCircle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-red-800 mb-2">
            Error Loading Case Studies
          </h3>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="space-y-4">
            <p className="text-sm text-red-700">Please try the following:</p>
            <ul className="text-sm text-red-700 space-y-2 max-w-md mx-auto">
              <li>• Check your internet connection</li>
              <li>• Verify the server is running</li>
              <li>• Try refreshing the page</li>
            </ul>
            <button
              // onClick={onRetry}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors">
              Try Again
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// Empty state component
function EmptyState() {
  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All Case Studies (0)
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              No case studies found. Create your first case study to get
              started.
            </p>
          </div>
          <Link
            href="/case-studies/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FiPlus className="h-4 w-4" />
            New Case Study
          </Link>
        </div>

        {/* Empty State */}
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg
              className="mx-auto h-24 w-24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No case studies yet
          </h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Get started by creating your first case study to showcase your work
            and attract potential clients.
          </p>
          <Link
            href="/case-studies/new"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
            <FiPlus className="h-4 w-4" />
            Create Your First Case Study
          </Link>
        </div>
      </main>
    </>
  );
}

// Case studies list component
function CaseStudiesList({
  caseStudies,
}: {
  caseStudies: CaseStudyCardDocument[];
}) {
  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              All Case Studies ({caseStudies.length})
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {caseStudies.length} case studies
            </p>
          </div>
          <Link
            href="/case-studies/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <FiPlus className="h-4 w-4" />
            New Case Study
          </Link>
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {caseStudies.map((caseStudy) => (
            <CaseStudyCard key={caseStudy._id} caseStudy={caseStudy} />
          ))}
        </div>
      </main>
    </>
  );
}
