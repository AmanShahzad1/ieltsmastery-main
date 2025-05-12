"use client";

import React, { useState, useEffect } from "react";
import { fetchStartingTest, submitStartingTestAnswer } from "../../../api/tests";
import { assignPlanToUser, getUserPlan } from "../../../api/plans";
import { jwtDecode } from "jwt-decode";
import Link from "next/link";

const StartTest = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [recommendedLevel, setRecommendedLevel] = useState<string | null>(null);
  const [isAssigningPlan, setIsAssigningPlan] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decoded = jwtDecode<{ userId: number }>(token);
          setUserId(decoded.userId);
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
          setQuestions(data.questions);
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

  const calculateLevel = () => {
    const answerValues = Object.values(answers);
    const advancedCount = answerValues.filter(a => a === "Advanced" || a === "Fluent/Native").length;
    const intermediateCount = answerValues.filter(a => a === "Intermediate").length;
    
    if (advancedCount >= answerValues.length * 0.7) return "Advanced";
    if (intermediateCount + advancedCount >= answerValues.length * 0.7) return "Intermediate";
    return "Beginner";
  };

  const handleTestCompletion = async () => {
    if (!userId) return;
    
    try {
      setIsAssigningPlan(true);
      const level = calculateLevel();
      setRecommendedLevel(level);
      
      const response = await assignPlanToUser(userId, level);
      console.log('Plan assigned:', response);
      
      // Optional: Fetch the assigned plan details
      const planDetails = await getUserPlan(userId);
      console.log('User plan details:', planDetails);
      
    } catch (error) {
      console.error('Failed to assign plan:', error);
    } finally {
      setIsAssigningPlan(false);
    }
  };

  const handleOptionClick = async (selectedOption: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    if (!userId || !currentQuestion) return;

    try {
      setIsSubmitting(true);
      
      // Save answer locally first
      const newAnswers = {
        ...answers,
        [currentQuestion.question_id]: selectedOption
      };
      setAnswers(newAnswers);

      // Submit to backend
      await submitStartingTestAnswer(
        userId,
        currentQuestion.question_id,
        selectedOption
      );

      // Move to next question or complete
      if (currentQuestionIndex + 1 < questions.length) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        setIsCompleted(true);
        await handleTestCompletion();
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
          {isAssigningPlan ? (
            <p className="text-xl text-blue-600 mb-6">Setting up your study plan...</p>
          ) : (
            <>
              <p className="text-2xl text-gray-700 mb-4">
                Recommended Study Plan: <span className="text-blue-600 font-bold">{recommendedLevel}</span>
              </p>
              <Link 
                href="/pages/dashboard" 
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition"
              >
                Continue to Dashboard
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }

  if (isStarted && questions[currentQuestionIndex]) {
    const currentQuestion = questions[currentQuestionIndex];
    const options = [
      currentQuestion.option1,
      currentQuestion.option2,
      currentQuestion.option3,
      currentQuestion.option4
    ];

    return (
      <div className="min-h-screen bg-blue-50 flex flex-col p-6">
        <div className="flex justify-start items-center mb-12">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
            <h1 className="text-2xl font-bold text-gray-800">IELTS Placement Test</h1>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1">
          <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
            <div className="mb-6">
              <span className="text-gray-500">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              {currentQuestion.question}
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  disabled={isSubmitting}
                  className={`w-full py-3 px-6 rounded-lg border text-left transition ${
                    isSubmitting
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-blue-50 border-gray-300"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col p-6">
      <div className="flex justify-start items-center mb-12">
        <div className="flex items-center space-x-2">
          <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
          <h1 className="text-2xl font-bold text-gray-800">IELTS Placement Test</h1>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center flex-1">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-3xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Placement Test Instructions
          </h2>

          <div className="space-y-4 text-gray-700 mb-8">
            <p className="text-lg">
              This test contains {questions.length} questions to assess your English proficiency level.
            </p>
            <p className="text-lg">
              Please answer honestly to get the most accurate recommendation for your study plan.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={handleStartTest}
              disabled={questions.length === 0}
              className={`bg-blue-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition ${
                questions.length === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
            >
              {questions.length === 0 ? "Loading Questions..." : "Begin Test"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartTest;