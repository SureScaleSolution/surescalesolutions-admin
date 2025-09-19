"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiCalendar, FiEdit3, FiTrash2 } from "react-icons/fi";
import { CaseStudyCardDocument } from "@/types/caseStudy";
import { useCaseStudyActions } from "@/hooks/useCaseStudyActions";

type Props = {
  caseStudy: CaseStudyCardDocument;
};

export default function CaseStudyCard({ caseStudy }: Props) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { deleting, deleteCaseStudy } = useCaseStudyActions();
  const router = useRouter();

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteCaseStudy(caseStudy._id!);
      setShowDeleteModal(false);
      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      if (error instanceof Error) {
        alert(`${error.message}`);
      } else {
        alert("Failed to delete case study. Please try again.");
      }
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  return (
    <>
      <div
        key={caseStudy._id}
        className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200">
        {/* Thumbnail Image */}
        <div className="relative h-48 w-full">
          <Image
            src={caseStudy.thumbnailImageUrl}
            alt={caseStudy.thumbnailTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            className="object-cover rounded-t-lg"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
              {caseStudy.serviceType}
            </span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
              {caseStudy.caseStudyTitle}
            </h3>
            <p className="text-gray-600 text-sm line-clamp-2">
              {caseStudy.caseStudySubtitle}
            </p>
          </div>

          <div className="flex items-center text-xs text-gray-500 mb-4">
            <FiCalendar className="h-3 w-3 mr-1" />
            Created {formatDate(caseStudy.createdAt)}
          </div>

          {/* Card Actions */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <Link
                href={`/case-studies/${caseStudy._id}/edit`}
                className="cursor-pointer text-gray-500 hover:text-green-600 transition-colors p-1">
                <FiEdit3 className="h-4 w-4" />
              </Link>
              <button
                onClick={handleDeleteClick}
                disabled={deleting}
                className="cursor-pointer text-gray-500 hover:text-red-600 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed">
                <FiTrash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="text-xs text-gray-500">
              {caseStudy.thumbnailTitle}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Delete Case Study
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &ldquo;{caseStudy.caseStudyTitle}
              &rdquo;? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleDeleteCancel}
                disabled={deleting}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50">
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
