import React from "react";
import { FiAlertCircle, FiFileText } from "react-icons/fi";
import { RefreshButton } from "@/components/common/RefreshButton";
import getStatsAction from "@/actions/stats/getStatsAction";

type Props = {
  stats: {
    totalCaseStudies: number;
  };
};

function StatsErrorState({ error }: { error: string }) {
  return (
    <>
      {/* Main Content */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center row-span-2 sm:col-span-2">
        <div className="text-red-600 mb-4">
          <FiAlertCircle className="mx-auto h-12 w-12" />
        </div>
        <h3 className="text-lg font-medium text-red-800 mb-2">
          Error Loading Stats
        </h3>
        <p className="text-red-600 mb-6">{error}</p>
        <div className="space-y-4">
          <p className="text-sm text-red-700">
            This error occurred while loading your dashboard stats. Please try
            the following:
          </p>
          <ul className="text-sm text-red-700 space-y-2 max-w-md mx-auto">
            <li>• Refresh the page to try again</li>
          </ul>
          <RefreshButton>Refresh Dashboard</RefreshButton>
        </div>
      </div>
    </>
  );
}

function StatsCards({ stats }: Props) {
  return (
    <>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <FiFileText className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">
              Total Case Studies
            </p>
            <p className="text-2xl font-semibold text-gray-900">
              {stats.totalCaseStudies}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default async function StatsDisplay() {
  try {
    const stats = await getStatsAction();

    // Render dashboard with stats
    return <StatsCards stats={stats} />;
  } catch (error) {
    // Handle server-side errors
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unexpected error occurred while loading dashboard statistics";

    return <StatsErrorState error={errorMessage} />;
  }
}
