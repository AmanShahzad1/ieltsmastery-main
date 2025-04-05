"use client"; // Mark the component as a client component

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation"; // Import useSearchParams to get query parameters
import { fetchPartData, savePartData } from "../../../../api/tests"; // Import API functions
import Link from "next/link"; // Use next/link for navigation
import Image from "next/image";

export default function AdminReadingPage() {
  const [readingMaterial, setReadingMaterial] = useState<string>("");
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>(Array(10).fill({ question: "", answer: "" }));
  const [selectedPart, setSelectedPart] = useState<string>("Part 1"); // Default to Part 1
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (testId && selectedPart) {
      fetchPartData(testId, selectedPart).then(data => {
        const filledQuestions = data.questions.length > 0 
          ? data.questions.concat(Array(10 - data.questions.length).fill({ question: "", answer: "" }))
          : Array(10).fill({ question: "", answer: "" });
        setQuestions(filledQuestions);
        setReadingMaterial(data.readingMaterial || "");
      }).catch(error => {
        console.error("Failed to fetch part data:", error);
        setQuestions(Array(10).fill({ question: "", answer: "" }));
        setReadingMaterial("");
      });
    }
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      setSelectedPart(part);
      setQuestions(Array(10).fill({ question: "", answer: "" }));
      setReadingMaterial("");
    }
  };

  const handleSave = async () => {
    try {
      const response = await savePartData(testId as string, selectedPart, questions, readingMaterial);
      if (response.success) {
        alert("Data saved successfully");
      } else {
        alert("Error saving data");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center mr-6 sm:mr-4">
        <Image
          src="/logo.png"
          alt="IELTS Mastery Solutions Logo"
          width={112}
          height={112}
          className="h-28 w-28"
          priority
        />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">Admin Reading Page</h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Select Part</h3>
        <div className="flex justify-center space-x-4">
          {["Part 1", "Part 2", "Part 3", "Part 4"].map((part) => (
            <button
              key={part}
              className={`px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100 ${selectedPart === part ? "bg-blue-100" : ""}`}
              onClick={() => handlePartSelection(part)}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center">
        <div className="w-full sm:w-1/2 flex flex-col space-y-6 pr-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-bold mb-4">Questions (1 to 10)</h3>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={`${selectedPart}-question-${index}`} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={question.question || ""}
                    onChange={(e) => {
                      const updatedQuestions = questions.map((q, i) => 
                        i === index ? {...q, question: e.target.value} : q
                      );
                      setQuestions(updatedQuestions);
                    }}
                    placeholder={`Question ${index + 1}`}
                  />
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    value={question.answer || ""}
                    onChange={(e) => {
                      const updatedQuestions = questions.map((q, i) => 
                        i === index ? {...q, answer: e.target.value} : q
                      );
                      setQuestions(updatedQuestions);
                    }}
                    placeholder={`Answer ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 space-y-6">
          <div className="bg-white shadow-md rounded-md p-6 h-full flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Reading Material</h3>
            <textarea
              className="border border-gray-300 rounded-md p-4 w-full h-60 resize-none"
              value={readingMaterial}
              onChange={(e) => setReadingMaterial(e.target.value)}
              placeholder="Enter the reading material here..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-3 text-white text-lg font-bold rounded-md"
          style={{ backgroundColor: "#03036D" }} // Change button color to #03036D
        >
          Save Part (Test No: {testId})
        </button>
        <Link href="/admin/tests/reading/main" className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600">
          Go Back
        </Link>
      </div>
    </div>
  );
}
