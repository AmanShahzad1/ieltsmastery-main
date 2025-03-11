"use client";

import React, { useEffect, useState } from "react";
import { fetchWritingTests, createWritingTest } from "../../../../../api/writing"; // Use functions from api/writing.js
import Link from "next/link";

interface Test {
  id: number;
  name: string;
}
// const getTests = async () => {
  //   try {
  //     const fetchedTests = await fetchWritingTests();
  //     setTests(fetchedTests); // Set the tests (could be an empty array)
  //   } catch (error) {
  //     console.error("Error fetching tests:", error);
  //     setTests([]); // Set tests to an empty array in case of error
  //   }
  // };
export default function WritingTestsPage() {
  const [tests, setTests] = useState<Test[]>([]);

  
const getTests = async () => {
    try {
      const fetchedTests = await fetchWritingTests(); // Fetch tests from the API
      setTests(fetchedTests); // Store fetched tests in the state
    } catch (error) {
      console.error("Error fetching tests:", error);
    }
  };

  useEffect(() => {
    getTests();
  }, []);

  // const handleCreateTest = async () => {
  //   try {
  //     const newTest = await createWritingTest(`Writing Test ${tests.length + 1}`);
  //     if (newTest && newTest.id && newTest.name) {
  //       setTests((prevTests) => [...prevTests, newTest]);
  //     } else {
  //       console.error("Invalid test structure returned", newTest);
  //     }
  //   } catch (error) {
  //     console.error("Error creating test:", error);
  //   }
  // };
  const handleCreateTest = async () => {
    try {
      const newTest = await createWritingTest(`Writing Test ${tests.length + 1}`); // Create new test
      if (newTest && newTest.id && newTest.name) {
        setTests((prevTests) => [...prevTests, newTest]); // Add the newly created test to the state
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

        {/* Display a message if no tests are created */}
        {tests.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No tests created yet.</p>
            <p>Click the "Create Test" button to add a new test.</p>
          </div>
        ) : (
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
        )}

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