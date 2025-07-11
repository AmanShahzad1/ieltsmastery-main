"use client";
import { useState, useEffect ,useCallback} from "react";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import { fetchPartData } from "../../../../api/tests";
import { updateUserPerformance } from "../../../../api/performance";
import Link from "next/link";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Image from 'next/image';

/* eslint-disable react/no-unescaped-entities */
export default function Home() {
  const params = useParams();
  const [isBlurred, setIsBlurred] = useState(true);
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<string>("");
  const [questions, setQuestions] = useState<
    { id: number; question: string; answer: string }[]
  >([]);
  const [part, setPart] = useState(1);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({});
  const [hasStartedTest, setHasStartedTest] = useState(false);
  const [showSubmitConfirmation, setShowSubmitConfirmation] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const testId = params.id as string;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };
  
  // Fetch Part Data
  const loadPartData = useCallback(async (part: number) => {
    setIsLoading(true);
    try {
      const partName = `Part ${part}`;
      const data = await fetchPartData(testId, partName);
      setReadingMaterial(data.readingMaterial || "");
      setQuestions(data.questions || []);
      setImageUrl(data.readingimage || "");
      setUserAnswers({});
    } catch (error) {
      console.error("Error fetching part data:", error);
    } finally {
      setIsLoading(false);
    }
  },[testId]);

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
  const startTest = () => {
    if (!audioPlayed) {
      const audioInstance = new Audio("/audio/Reading_Start.wav");
      setAudio(audioInstance);
      audioInstance.play();
      audioInstance.addEventListener("ended", () => {
        setIsBlurred(false);
        setIsTimerRunning(true);
        setAudioPlayed(true);
        setHasStartedTest(true);
      });
    } else {
      setIsBlurred(false);
      setIsTimerRunning(true);
      setHasStartedTest(true);
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
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return false;
      }

      const decoded = jwtDecode<{ userId: number }>(token);
      const userId = decoded.userId;
      for (const question of questions) {
        if (userAnswers[question.id]) {
          await axios.post("http://localhost:5000/api/tests/saveUserAnswer", {
            testId: testId,
            questionId: question.id,
            userAnswer: userAnswers[question.id],
            partId: part,
            correctAnswer: question.answer,
            userId: userId
          });
        }
      }
      return true;
    } catch (error) {
      console.error("Error saving answers:", error);
      return false;
    }
  };

  const updateTestPerformance = async () => {
    try {
      console.log("Attempting to update performance...");
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return false;
      }

      const decoded = jwtDecode<{ userId: number }>(token);
      const testType = window.location.pathname.split("/")[2];
      console.log(
        `Updating performance for user ${decoded.userId}, test ${testId}, type ${testType}`
      );

      await updateUserPerformance(decoded.userId, testId, testType);
      console.log("Performance updated successfully");
      return true;
    } catch (error) {
      console.error("Error updating performance:", error);
      return false;
    }
  };

  // Handle Test Submission
  const handleTestSubmission = async () => {
    console.log("Starting test submission...");
    const success = await submitPart();
    if (success) {
      await updateTestPerformance();
      setIsTestComplete(true);
      setIsTimerRunning(false);
      setShowSubmitConfirmation(false);
    }
    if (!success) {
      console.error("Failed to submit part");
      return;
    }

    await updateTestPerformance();
    setIsTestComplete(true);
    setIsTimerRunning(false);
    setShowSubmitConfirmation(false);
    console.log("Test submission completed");
  };

  // End Test Early
  const endTest = async () => {
    const isConfirmed = confirm(
      "Are you sure you want to end the test? Your progress will be saved, but you won't be able to resume."
    );
    if (isConfirmed) {
      const success = await submitPart();
      if (success) {
        try {
          const token = localStorage.getItem("token");
          if (token) {
            const decoded = jwtDecode<{ userId: number }>(token);
            // Determine test type based on current page
            const testType = window.location.pathname.split("/")[2]; // gets 'reading', 'writing', etc.
            await updateUserPerformance(decoded.userId, testId, testType);
          }
        } catch (error) {
          console.error("Error updating performance:", error);
        }

        setIsTestComplete(true);
        setIsTimerRunning(false);
        setShowSubmitConfirmation(false);
      }
    }
  };

  // Load initial part data
  useEffect(() => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadPartData(part);
  }, [part,loadPartData]);

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
          <Image
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            className="h-28 w-28"
          />
          <h1 className="text-2xl font-bold sm:ml-4 text-center w-full">
            Reading Test - Part {part}
          </h1>
        </header>

        {/* Timer and Start Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          {/* Timer */}
          <div className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md text-center">
            Time: {formatTime(time)}
          </div>

          {/* Start Button (only shown if part hasn't started) */}
          {!hasStartedTest && (
            <button
              className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48"
              onClick={startTest}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Get Started"}
            </button>
          )}
        </div>

        {/* Part Navigation */}
        <div className="bg-white shadow-md rounded-md p-4 mb-6">
          <h3 className="text-lg font-bold mb-4 text-center">Test Parts</h3>
          <div className="flex justify-center space-x-4">
            {[1, 2, 3].map((partNumber) => (
              <button
                key={partNumber}
                className={`px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100 ${
                  part === partNumber ? "bg-blue-100" : ""
                } ${!hasStartedTest ? "cursor-not-allowed opacity-50" : ""}`}
                onClick={() => {
                  if (hasStartedTest && part !== partNumber) {
                    setPart(partNumber);
                  }
                }}
                disabled={!hasStartedTest}
              >
                Part {partNumber}
              </button>
            ))}
          </div>
        </div>

        {/* Content Section */}
        {!isTestComplete && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Reading Material Section */}
            <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2 h-full">
              <h3 className="text-xl font-bold mb-4">Reading Material</h3>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <>
                  {/* Display image above reading material if available */}
                  {imageUrl && (
                    <div className={`mb-6 ${isBlurred ? "blur-sm" : ""}`}>
                      <Image
                        src={imageUrl}
                        alt="Reading Material Visual"
                        className="max-w-full h-auto rounded-lg border border-gray-200 mx-auto"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  {/* Reading text content */}
                  <div className={`prose max-w-none ${isBlurred ? "blur-sm" : ""}`}>
                    {readingMaterial ? (
                      <pre className="font-sans whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                        {readingMaterial}
                      </pre>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No reading material available</p>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Questions Section */}
            <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
              <h3 className="text-xl font-bold mb-4">Questions</h3>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {questions.length > 0 ? (
                    questions.map((question, index) => {
                      // Extract question number from the question text
                      const questionNumberMatch = question.question.match(/Question (\d+)/);
                      const questionNumber = questionNumberMatch ? questionNumberMatch[1] : index + 1;
                      const questionText = question.question.replace(/^Question \d+:\s*/, '');
                      
                      return (
                        <div
                          key={question.id}
                          className={`${isBlurred ? "blur-sm" : ""}`}
                        >
                          <p className="font-medium mb-2">
                            {questionNumber}. {questionText}
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
                      );
                    })
                  ) : (
                    <p className="text-gray-500 text-center py-8">No questions available</p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        {hasStartedTest && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            {part < 3 && (
              <button
                onClick={async () => {
                  const success = await submitPart();
                  if (success) {
                    setPart(part + 1);
                  }
                }}
                className="px-6 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 w-full sm:w-auto"
              >
                Submit & Continue to Part {part + 1}
              </button>
            )}

            {part === 3 && (
              <button
                onClick={() => setShowSubmitConfirmation(true)}
                className="px-6 py-3 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 w-full sm:w-auto"
              >
                Submit Test
              </button>
            )}

            <button
              onClick={endTest}
              className="px-6 py-3 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600 w-full sm:w-auto"
            >
              End Test & Return
            </button>
          </div>
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
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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