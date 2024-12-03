"use client"; // Mark the component as a client component

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function ReadingTestsPage() {
  const [tests, setTests] = useState(["Reading Test 1", "Reading Test 2"]);
  const router = useRouter(); // Initialize the router instance

  const handleCreateTest = () => {
    const nextTestNumber = tests.length + 1;
    setTests([...tests, `Reading Test ${nextTestNumber}`]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      {/* Header */}
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center mr-6 sm:mr-4">
          <img
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            className="h-28 w-28"
          />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">
          Reading Tests
        </h1>
      </header>

      {/* Main Content */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-bold mb-6">All Reading Tests</h2>

        {/* List of Reading Tests */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50"
            >
              <span className="text-lg">{test}</span>
              <button
                onClick={() => router.push("/admin/tests/reading/readingTest")} // Navigate to the static page
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Test
              </button>
            </div>
          ))}
        </div>

        {/* Create Test Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleCreateTest}
            className="px-6 py-3 bg-purple-600 text-white text-lg font-bold rounded-md hover:bg-purple-700"
          >
            Create Test
          </button>
        </div>
      </div>
    </div>
  );
}
