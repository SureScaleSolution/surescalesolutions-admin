"use client";

import { FiRefreshCw } from "react-icons/fi";

interface RefreshButtonProps {
  children: React.ReactNode;
}

export function RefreshButton({ children }: RefreshButtonProps) {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <button
      onClick={handleRefresh}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors inline-flex items-center gap-2">
      <FiRefreshCw className="h-4 w-4" />
      {children}
    </button>
  );
}
