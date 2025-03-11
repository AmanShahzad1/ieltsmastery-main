"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchSpeakingData, saveSpeakingData } from "../../../../api/speaking";
import Link from "next/link";

export default function AdminSpeakingPage() {
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>(
    Array.from({ length: 20 }, () => ({ question: "", answer: "" })) // Initialize with 20 empty questions
  );

  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (testId) {
      fetchSpeakingData(testId)
        .then((data) => {
          console.log("Fetched Data:", data);
          // Ensure data.questions is an array and has at least one element
          if (Array.isArray(data.questions) && data.questions.length > 0) {
            const nestedQuestions = data.questions[0]; // Extract the nested array
            // Map the nested array into the expected format
            const paddedQuestions = Array.from({ length: 20 }, (_, index) => ({
              question: nestedQuestions[index]?.question || "", // Use the fetched question or an empty string
              answer: "", // Initialize answer as an empty string
            }));
            setQuestions(paddedQuestions);
          } else {
            console.error("Invalid questions data:", data.questions);
            setQuestions(Array.from({ length: 20 }, () => ({ question: "", answer: "" })));
          }
        })
        .catch((error) => {
          console.error("Failed to fetch test data:", error);
          setQuestions(Array.from({ length: 20 }, () => ({ question: "", answer: "" })));
        });
    }
  }, [testId]);

  const handleSave = async () => {
    try {
      // Convert the questions state into the same JSON format as fetched
      const formattedQuestions = [questions.map((q) => ({ question: q.question }))];

      // Save the formatted questions
      const response = await saveSpeakingData(testId as string, formattedQuestions);
      if (response.success) {
        alert("Speaking Test Data Saved!");
      } else {
        alert("Error saving data: " + response.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold text-center w-full">Admin Speaking Test</h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-lg font-bold mb-4">Questions</h3>
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="grid grid-cols-1 gap-4">
              <input
                type="text"
                className="border border-gray-300 rounded-md p-2 w-full"
                placeholder={`Question ${index + 1}`}
                value={q.question} // Ensure this is never undefined
                onChange={(e) => {
                  const updatedQuestions = [...questions];
                  updatedQuestions[index] = {
                    ...updatedQuestions[index],
                    question: e.target.value,
                  };
                  setQuestions(updatedQuestions);
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-3 text-white text-lg font-bold rounded-md bg-blue-600 hover:bg-blue-700"
        >
          Save Speaking Test
        </button>
        <Link
          href="/admin/tests/speaking/main"
          className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}