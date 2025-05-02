"use client";

import React, { useState, useEffect } from "react";
import { fetchStartingTest, submitStartingTestAnswer } from "../../../api/tests";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

const StartTest = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState<number>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<{ userId: number }>(token);
          setUserId(decoded.userId || 16);
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
    }
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchStartingTest();
        if (data?.questions?.length > 0) {
          const formattedQuestions = data.questions.map((q: any) => ({
            question: q.question,
            options: [q.option1, q.option2, q.option3, q.option4],
            question_id: q.question_id,
          }));
          setQuestions(formattedQuestions);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    loadQuestions();
  }, []);

  const handleStartTest = () => {
    if (questions.length > 0) {
      setIsStarted(true);
    }
  };

  const handleOptionClick = async (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!userId || !currentQuestion) return;

    try {
      setIsSubmitting(true);
      await submitStartingTestAnswer(userId, currentQuestion.question_id, selectedOption);

      // After submission, move to next question
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex((prev) => prev + 1);
      } else {
        setIsCompleted(true);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-xl p-8 w-full max-w-2xl text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">Test Completed!</h1>
          <p className="text-2xl text-green-600 font-semibold">Well done! 🎉</p>
          <p className="text-2xl text-green-600 ">
            Move TO Dashboard :<Link href="../pages/dashboard" className="text-blue-600" font-extralight	>Click Here</Link>
          </p>
        </div>
      </div>
    );
  }

  if (isStarted) {
    const currentQuestion = questions[currentQuestionIndex];

    return (
      <div className="min-h-screen bg-blue-50 flex flex-col relative p-6">
        {/* Top Header Section */}
        <div className="flex justify-start items-center mb-12">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
            <h1 className="text-2xl font-bold text-gray-800">IELTS Mastery Solutions</h1>
          </div>
        </div>

        {/* MCQ Questions */}
        <div className="flex flex-col items-center justify-center flex-1">
          <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-3xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              {currentQuestion?.question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion?.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-lg border border-gray-300 hover:bg-blue-100 text-gray-700 text-lg transition disabled:opacity-50"
                >
                  {option}
                </button>
              ))}
            </div>

            {isSubmitting && (
              <div className="mt-4 text-center text-blue-500 text-lg font-semibold">
                Submitting answer...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col relative p-6">
      {/* Top Header Section */}
      <div className="flex justify-start items-center mb-12">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">IELTS Mastery Solutions</h1>
        </div>
      </div>

      {/* Instructions Card */}
      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-10 rounded-xl shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">INSTRUCTIONS</h2>

          <div className="space-y-6 text-lg text-gray-700">
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-2xl">📋</span>
              <p>The test is divided into several parts. Each part is designed to assess specific skills.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-blue-500 text-2xl">📝</span>
              <p>Make sure to follow the instructions for each part carefully.</p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={handleStartTest}
              disabled={questions.length === 0}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-lg shadow-md transition disabled:opacity-50"
            >
              {questions.length === 0 ? "Loading..." : "Start Test ▶▶"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTest;
