"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPartData, savePartData } from "../../../../../api/tests";
import Link from "next/link";

export default function AdminWritingPage() {
  const [questions, setQuestions] = useState<{ question: string }[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("Task 1");
  const [image, setImage] = useState<File | null>(null);
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (testId && selectedPart) {
      fetchPartData(testId, selectedPart)
        .then((data) => {
          setQuestions(data.questions || []);
        })
        .catch((error) => {
          console.error("Failed to fetch part data:", error);
          setQuestions([]);
        });
    }
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      setSelectedPart(part);
      setQuestions([]);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "" }]);
  };

  const handleSave = async () => {
    try {
      const response = await savePartData(testId as string, selectedPart, questions, image);
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
        <h1 className="text-2xl font-bold text-center w-full">Admin Writing Page</h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Select Task</h3>
        <div className="flex justify-center space-x-4">
          {["Task 1", "Task 2"].map((task) => (
            <button
              key={task}
              className={`px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100 ${selectedPart === task ? "bg-blue-100" : ""}`}
              onClick={() => handlePartSelection(task)}
            >
              {task}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-lg font-bold mb-4">Questions</h3>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <input
              key={index}
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={question.question}
              onChange={(e) => {
                const updatedQuestions = questions.map((q, i) =>
                  i === index ? { question: e.target.value } : q
                );
                setQuestions(updatedQuestions);
              }}
              placeholder={`Question ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleAddQuestion}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Question
        </button>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">Upload Image</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-3 text-white text-lg font-bold rounded-md bg-blue-600 hover:bg-blue-700"
        >
          Save Test
        </button>
        <Link
          href="/admin/tests/writing/main"
          className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}
