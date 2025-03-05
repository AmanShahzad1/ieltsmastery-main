"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import Link from "next/link";

const WritingTest = () => {
  const [wordCount, setWordCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [time, setTime] = useState(0); // Timer for the writing test
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);

  // Start the timer when the test begins
  const startTest = () => {
    setIsTimerRunning(true);
  };

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  // Handle text change and word count update
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setInputText(text);
    const words = text.trim().split(/\s+/);
    setWordCount(words.filter((word) => word.length > 0).length);
  };

  // Handle test submission
  const submitTest = () => {
    setIsTimerRunning(false);
    setIsTestComplete(true);
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif flex flex-col">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0 sm:mr-4">
            <img
              src="/logo.png"
              alt="IELTS Mastery Solutions Logo"
              className="h-28 w-28"
            />
          </div>
          <h1 className="text-2xl font-bold sm:ml-4 text-center w-full">
            Writing Test
          </h1>
        </header>

        {/* Main Content - Two Equal Sections */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Side - Writing Task Instructions */}
          <div className="bg-white shadow-md rounded-md p-6 w-full md:w-1/2 h-full">
            <h2 className="text-xl font-bold mb-4">Writing Task</h2>
            <p className="text-gray-700">
              You should spend about 40 minutes on this task.
            </p>
            <p className="text-gray-700 mt-2">
              Write at least **250 words** on the following topic:
            </p>
            <div className="border-l-4 border-blue-500 pl-4 mt-4">
              <p className="text-lg font-semibold">
                Some people think that schools should teach students how to be
                good parents. Do you agree or disagree?
              </p>
            </div>
          </div>

          {/* Right Side - Writing Answer Section */}
          <div className="bg-white shadow-md rounded-md p-6 w-full md:w-1/2">
            <h3 className="text-xl font-bold mb-4">Your Response</h3>
            <textarea
              value={inputText}
              onChange={handleChange}
              rows={10}
              className="border border-gray-300 rounded-md p-2 w-full"
              placeholder="Start writing here..."
              disabled={!isTimerRunning || isTestComplete}
            ></textarea>
            <div className="mt-4 text-gray-600">
              Word Count: {wordCount}
            </div>
          </div>
        </div>

        {/* Timer and Buttons */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
          <button
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48 text-center"
            onClick={startTest}
            disabled={isTimerRunning}
          >
            Get Started
          </button>

          <div className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md text-center">
            Timer: {Math.floor(time / 60)}:
            {String(time % 60).padStart(2, "0")}
          </div>

          <button
            onClick={submitTest}
            className="px-6 py-3 text-white text-lg font-bold rounded-md"
            style={{ backgroundColor: "#03036D" }}
            disabled={isTestComplete}
          >
            Submit Test
          </button>
        </div>

        {/* Return to Dashboard Button */}
        {isTestComplete && (
          <div className="flex justify-center mt-8">
            <Link href="/pages/dashboard">
              <button className="px-6 py-3 text-white text-lg font-bold rounded-md bg-blue-500 hover:bg-blue-600">
                Return to Dashboard
              </button>
            </Link>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default WritingTest;
