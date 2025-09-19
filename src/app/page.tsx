import Link from "next/link";
import { FiPlus, FiFileText } from "react-icons/fi";
import StatsDisplay from "@/components/dashboard/StatsCards";

export default function Dashboard() {
  return (
    <>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h2>
          <p className="text-gray-600">
            Manage your case studies and track your business growth.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <StatsDisplay />

          {/* Create New Case Study Card */}
          <div className="bg-white rounded-lg shadow sm:col-span-2 md:row-span-2">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-4">
                <Link
                  href="/case-studies/new"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors group">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <FiPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Create New Case Study
                      </p>
                      <p className="text-sm text-gray-500">
                        Add a new case study to showcase your work
                      </p>
                    </div>
                  </div>
                  <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </Link>
                <Link
                  href="/case-studies"
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors group">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 mr-4">
                      <FiFileText className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        View Case Studies
                      </p>
                    </div>
                  </div>
                  <div className="text-green-600 group-hover:translate-x-1 transition-transform">
                    →
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
