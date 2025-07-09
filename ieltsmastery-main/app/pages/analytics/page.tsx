"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ActivityCard from "../../../components/dashboard/ActivityCard";
import OverviewCard from "../../../components/dashboard/OverviewCard";

const AnalyticsPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600">Track your learning progress and performance</p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overview Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <OverviewCard />
          </div>

          {/* Activity Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <ActivityCard />
          </div>
        </div>

        {/* Additional Analytics Sections can be added below */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Detailed Statistics</h2>
          <p className="text-gray-500">More analytics coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;