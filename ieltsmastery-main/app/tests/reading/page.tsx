"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import { fetchPartData } from "../../../api/tests";
import Link from "next/link";
import axios from "axios";

export default function Home() {
  const [isBlurred, setIsBlurred] = useState(true);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<string>("");
  const [questions, setQuestions] = useState<
    { id: number; question: string; answer: string }[]
  >([]);
  const [part, setPart] = useState(1);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [hasStartedPart, setHasStartedPart] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);

  const testId = "1";

  // Fetch Part Data
  const loadPartData = async (part: number) => {
    try {
      const partName = `Part ${part}`;
      const data = await fetchPartData(testId, partName);
      setReadingMaterial(data.readingMaterial || "");
      setQuestions(data.questions || []);
      setHasStartedPart(false);
      setIsBlurred(true); // Always blur new parts until started
    } catch (error) {
      console.error("Error fetching part data:", error);
    }
  };

  // Timer logic (total time only)
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

  // Start Test/Part
  const startPart = () => {
    if (part === 1 && !audioPlayed) {
      const audioInstance = new Audio("/audio/Reading_Start.wav");
      setAudio(audioInstance);
      audioInstance.play();
      audioInstance.addEventListener("ended", () => {
        setIsBlurred(false);
        setIsTimerRunning(true);
        setAudioPlayed(true);
        setHasStartedPart(true);
      });
    } else {
      setIsBlurred(false);
      setIsTimerRunning(true);
      setHasStartedPart(true);
    }
  };

  // Handle Answer Change
  const handleAnswerChange = (questionId: number, userAnswer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: userAnswer,
    }));
  };

  // Submit Answers for Current Part
  const submitPart = async () => {
    try {
      for (const question of questions) {
        if (userAnswers[question.id]) {
          await axios.post("http://localhost:5000/api/tests/saveUserAnswer", {
            testId: testId,
            questionId: question.id,
            userAnswer: userAnswers[question.id],
            partId: part,
            correctAnswer: question.answer,
          });
        }
      }
      return true;
    } catch (error) {
      console.error("Error saving answers:", error);
      return false;
    }
  };

  // Handle Test Submission
  const handleTestSubmission = async () => {
    const success = await submitPart();
    if (success) {
      setIsTestComplete(true);
      setIsTimerRunning(false);
      setShowSubmitConfirmation(false);
    }
  };

  // End Test Early
  const endTest = async () => {
    const isConfirmed = confirm(
      "Are you sure you want to end the test? Your progress will be saved, but you won't be able to resume."
    );
    if (isConfirmed) {
      await submitPart();
      setIsTestComplete(true);
      setIsTimerRunning(false);
    }
  };

  // Load initial part data
  useEffect(() => {
    loadPartData(part);
  }, [part]);

  // Clear everything when test is complete
  if (isTestComplete) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-[#e8f1ff] flex flex-col items-center justify-center p-8 font-serif">
          <h2 className="text-2xl font-bold mb-4">
            Test Submitted Successfully!
          </h2>
          <Link href="/pages/dashboard">
            <button className="px-6 py-3 bg-blue-500 text-white text-lg font-bold rounded-md hover:bg-blue-600">
              Return to Dashboard
            </button>
          </Link>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
          <img
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            className="h-28 w-28"
          />
          <h1 className="text-2xl font-bold sm:ml-4 text-center w-full">
            Reading Test
          </h1>
        </header>

        {/* Timer and Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          {/* Timer */}
          <div className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md">
            Time: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
          </div>

          {/* Start Button (only shown if part hasn't started) */}
          {!hasStartedPart && (
            <button
              className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48"
              onClick={startPart}
            >
              {part === 1 ? "Get Started" : `Start Part ${part}`}
            </button>
          )}
        </div>

        {/* Content Section */}
        {!isTestComplete && (
          <>
            <div className="flex flex-col lg:flex-row justify-center gap-6">
              {/* Reading Material */}
              <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
                <h3 className="text-lg font-bold mb-4">Reading Material</h3>
                <div
                  className={`space-y-4 ${
                    isBlurred ? "blur-sm" : "blur-none"
                  } transition duration-300`}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {readingMaterial}
                  </p>
                </div>
              </div>

              {/* Questions */}
              <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
                <h3 className="text-lg font-bold mb-4">
                  Questions (Part {part})
                </h3>
                <div className="space-y-6">
                  {questions.map((question, index) => (
                    <div
                      key={index}
                      className={`${
                        isBlurred ? "blur-sm" : "blur-none"
                      } transition duration-300`}
                    >
                      <p className="text-sm font-medium mb-2">
                        {index + 1}. {question.question}
                      </p>
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        placeholder="Your answer..."
                        disabled={isBlurred}
                        value={userAnswers[question.id] || ""}
                        onChange={(e) =>
                          handleAnswerChange(question.id, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col items-center mt-8 gap-4">
              {hasStartedPart && (
                <>
                  {part < 4 ? (
                    <button
                      onClick={async () => {
                        const success = await submitPart();
                        if (success) {
                          setPart(part + 1);
                        }
                      }}
                      className="px-6 py-3 bg-green-500 text-white text-lg font-bold rounded-md hover:bg-green-600 w-full sm:w-64"
                    >
                      Submit & Continue to Part {part + 1}
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowSubmitConfirmation(true)}
                      className="px-6 py-3 bg-red-500 text-white text-lg font-bold rounded-md hover:bg-red-600 w-full sm:w-64"
                    >
                      Submit Test
                    </button>
                  )}
                </>
              )}

              {/* Return to Dashboard Button with warning prompt */}
              <button
                onClick={async () => {
                  const isConfirmed = confirm(
                    "Are you sure you want to end the test? Your progress will be saved, but you won't be able to resume."
                  );
                  if (isConfirmed) {
                    await submitPart();
                    setIsTestComplete(true);
                    setIsTimerRunning(false);
                  }
                }}
                className="px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600 w-full sm:w-64"
              >
                End Test & Return
              </button>
            </div>
          </>
        )}

        {/* Submit Confirmation Modal */}
        {showSubmitConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Confirm Submission</h3>
              <p className="mb-6">
                Are you sure you want to submit your test? You won't be able to
                make changes after submission.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowSubmitConfirmation(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleTestSubmission}
                  className="px-4 py-2 bg-red-500 text-white rounded-md"
                >
                  Submit Test
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
