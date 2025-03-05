"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPartData, savePartData } from "../../../../../api/tests";
import Link from "next/link";

export default function AdminWritingPage() {
  const [writingTask, setWritingTask] = useState<string>("");
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>(Array(2).fill({ question: "", answer: "" }));
  const [selectedPart, setSelectedPart] = useState<string>("Task 1");
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (testId && selectedPart) {
      fetchPartData(testId, selectedPart).then(data => {
        const filledQuestions = data.questions.length > 0 
          ? data.questions.concat(Array(2 - data.questions.length).fill({ question: "", answer: "" }))
          : Array(2).fill({ question: "", answer: "" });
        setQuestions(filledQuestions);
        setWritingTask(data.writingTask || "");
      }).catch(error => {
        console.error("Failed to fetch part data:", error);
        setQuestions(Array(2).fill({ question: "", answer: "" }));
        setWritingTask("");
      });
    }
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      setSelectedPart(part);
      setQuestions(Array(2).fill({ question: "", answer: "" }));
      setWritingTask("");
    }
  };

  const handleSave = async () => {
    try {
      const response = await savePartData(testId as string, selectedPart, questions, writingTask);
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
          <img src="/logo.png" alt="IELTS Mastery Solutions Logo" className="h-28 w-28" />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">Admin Writing Page</h1>
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

      <div className="flex flex-col sm:flex-row justify-center">
        <div className="w-full sm:w-1/2 flex flex-col space-y-6 pr-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-bold mb-4">Questions (1 to 2)</h3>
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
            <h3 className="text-lg font-bold">Writing Task</h3>
            <textarea
              className="border border-gray-300 rounded-md p-4 w-full h-60 resize-none"
              value={writingTask}
              onChange={(e) => setWritingTask(e.target.value)}
              placeholder="Enter the writing task here..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          className="px-6 py-3 text-white text-lg font-bold rounded-md"
          style={{ backgroundColor: "#03036D" }}
        >
          Save Task (Test No: {testId})
        </button>
        <Link href="/admin/tests/writing/main" className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600">
          Go Back
        </Link>
      </div>
    </div>
  );
}