"use client";

import React, { useEffect, useState } from "react";
import { fetchTests, createTest } from "../../../../../api/tests";
import Link from "next/link";

interface Test {
  id: number;
  name: string;
}

export default function WritingTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);

  const getTests = async () => {
    try {
      const fetchedTests = await fetchTests();
      setTests(fetchedTests);
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  const handleCreateTest = async () => {
    try {
      const newTest = await createTest(`Writing Test ${tests.length + 1}`);
      if (newTest && newTest.id && newTest.name) {
        setTests((prevTests) => [...prevTests, newTest]);
      } else {
        console.error("Invalid test structure returned", newTest);
      }
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center mr-6 sm:mr-4">
          <img src="/logo.png" alt="IELTS Mastery Solutions Logo" className="h-28 w-28" />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">Writing Tests</h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-bold mb-6">All Writing Tests</h2>

        <div className="space-y-4">
          {tests.map((test) => (
            <div key={test.id} className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50">
              <span className="text-lg">{test.name}</span>
              <Link href={{ pathname: "/admin/tests/writing/writingTest", query: { testId: test.id.toString() } }}>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">View Test</button>
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <button onClick={handleCreateTest} className="px-6 py-3 bg-[#03036D] text-white text-lg font-bold rounded-md hover:bg-[#020258]">
            Create Test
          </button>
        </div>

        <div className="flex justify-center mt-8">
          <Link href="/admin/home" className="px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600">
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}