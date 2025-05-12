"use client";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { fetchWritingPartData, saveWritingAnswer, getFeedbackFromFlask, saveWritingLLMResponse} from "../../../../api/writing"; // Adjust the import path as needed
import { updateUserPerformance } from "../../../../api/performance";
import axios from "axios"; // For error handling
import { useParams } from "next/navigation";

const WritingTest = () => {
  const params = useParams();
  const [wordCount, setWordCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [questions, setQuestions] = useState<{ id: number; question: string }[]>([]); // Array of questions with IDs
  const [imageUrl, setImageUrl] = useState<string | null>(null); // Stores the image URL
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [fetchError, setFetchError] = useState<string | null>(null); // Error state
  const [taskType, setTaskType] = useState("Task 1"); // Track the current task (Task 1 or Task 2)
  const [hasStarted, setHasStarted] = useState(false); // Track if the test has started

  const searchParams = useSearchParams();
  const testId = params.id as string; // Fallback to "1" if testId is not provided

  // Fetch writing task and material based on testId and taskType
  useEffect(() => {
    const fetchWritingTask = async () => {
      if (!testId) {
        console.log("testId is missing");
        setFetchError("Test ID is missing. Please try again later.");
        return;
      }

      setIsLoading(true); // Start loading
      setFetchError(null); // Reset error state
      console.log("Fetching writing task data...");

      try {
        const data = await fetchWritingPartData(testId, taskType);
        console.log("Fetched writing task data:", data);

        if (data.questions && data.questions.length > 0) {
          setQuestions(data.questions); // Set the array of questions
        } else {
          console.log("No questions found in the fetched data");
          setFetchError("No writing task found. Please try again later.");
        }

        if (data.material) {
          setImageUrl(data.material); // Set the image URL from the material field
        } else {
          setImageUrl(null); // Reset image URL if no material is available
          console.log("No image found in the fetched data");
        }
      } catch (error) {
        console.error("⚠️ Failed to fetch writing task:", error);
        setFetchError("Failed to load the writing task. Please try again later."); // Set error message
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    fetchWritingTask();
  }, [testId, taskType]); // Fetch data when testId or taskType changes

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
      setIsTestComplete(true);
      alert("Time's up for the Writing Test!");
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeRemaining]);

  // Start the test
  const startTest = () => {
    setHasStarted(true); // Hide the "Start Listening" button
    setIsTimerRunning(true); // Start the timer
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
  
  // Save the user's response to the database
  const saveResponse = async () => {
    try {
      const partId = taskType === "Task 1" ? 1 : 2; // Part ID for Task 1 or Task 2
  
      // Send the user's answer to the Flask backend and get feedback
      const feedback = await getFeedbackFromFlask(inputText);
      if (!feedback) {
        throw new Error("No feedback received from Flask backend");
      }
  
      // Extract the band score from the feedback (assuming the feedback contains "Overall Band Score: X")
      const bandScoreMatch = feedback.match(/Overall Band Score: (\d)/);
      const score = bandScoreMatch ? parseInt(bandScoreMatch[1], 10) : 0; // Default to 0 if no score is found
  

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return false;
      }

      const decoded = jwtDecode<{ userId: number }>(token);
      const userId = decoded.userId;
      
      // Save the response to your backend
      for (const question of questions) {
        await saveWritingAnswer({
          testId,
          questionId: question.id, // Dynamic questionId from the questions array
          userAnswer: inputText,
          partId,
          score, // Use the extracted band score
          userId
        });
        
        // Save the complete feedback and score using saveWritingLLMResponse
        await saveWritingLLMResponse({
          testId,
          questionId: question.id, // Dynamic questionId from the questions array
          feedback, // Complete feedback from the Flask backend
          partId,
          score, // Extracted band score
        });
      }
      
      console.log("Response saved successfully!");
    } catch (error) {
      console.error("Error saving response:", error);
      alert("An error occurred while saving your response. Please try again.");
    }
  };
  // Load the next part of the test
  const loadNextPart = async () => {
    await saveResponse(); // Save the current response before moving to the next part

    if (taskType === "Task 1") {
      setTaskType("Task 2"); // Move to Task 2
      setInputText(""); // Reset the input text
      setWordCount(0); // Reset the word count
    } else {
      setIsTestComplete(true); // End the test if Task 2 is completed
      await updateTestPerformance();
    }
  };

  // End the test manually
  const endTest = async () => {
    const isConfirmed = confirm("Are you sure you want to end the test? Your progress will be saved, but you won't be able to resume.");
    if (isConfirmed) {
      await saveResponse(); // Save the current response before ending the test
      setIsTimerRunning(false); // Stop the timer
      setIsTestComplete(true); // Mark the test as complete
    }
  };

  // Format time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
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
            Writing Test - {taskType}
          </h1>
        </header>

        {!isTestComplete ? (
          <>
            {/* Timer Display */}
            <div className="text-center mb-4">
              <p className="text-lg font-bold">
                Time Remaining: {formatTime(timeRemaining)}
              </p>
            </div>

            {/* Start Test Button (only visible if the test hasn't started) */}
            {!hasStarted && (
              <button
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48"
                onClick={startTest}
              >
                Get Started
              </button>
            )}

            {/* Main Content - Two Equal Sections */}
            <div className="flex flex-col md:flex-row gap-6 mt-6">
              {/* Left Side - Writing Task Instructions */}
              <div className="bg-white shadow-md rounded-md p-6 w-full md:w-1/2 h-full">
                <h2 className="text-xl font-bold mb-4">Writing Task</h2>
                <p className="text-gray-700">
                  You should spend about 60 minutes on this task.
                </p>
                <p className="text-gray-700 mt-2">
                  Write at least <strong>250 words</strong> on the following topic:
                </p>
                <div className="border-l-4 border-blue-500 pl-4 mt-4">
                  {isLoading ? (
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                    </div>
                  ) : fetchError ? (
                    <p className="text-red-500">{fetchError}</p>
                  ) : (
                    <p className="text-lg font-semibold">
                      {questions[0]?.question || "No writing task available."}
                    </p>
                  )}
                </div>

                {/* Display Image (if available) */}
                {imageUrl && (
                  <div className="mt-4 flex justify-center">
                    <img
                      src={imageUrl}
                      alt="Writing Task Image"
                      className="max-w-full h-auto rounded-md"
                    />
                  </div>
                )}
              </div>

              {/* Right Side - Writing Answer Section */}
              <div className="bg-white shadow-md rounded-md p-6 w-full md:w-1/2">
                <h3 className="text-xl font-bold mb-4">Your Response</h3>
                <textarea
                  value={inputText}
                  onChange={(e) => {
                    const text = e.target.value;
                    setInputText(text);
                    const words = text.trim().split(/\s+/);
                    setWordCount(words.filter((word) => word.length > 0).length);
                  }}
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

            {/* End Test and Next Part/Submit Test Buttons */}
            <div className="flex justify-end mt-6 gap-4">
              {/* End Test Button (only visible after starting the test) */}
              {hasStarted && (
                <button
                  className="bg-red-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-red-600 w-full sm:w-48"
                  onClick={endTest}
                >
                  End Test
                </button>
              )}

              {/* Next Part/Submit Test Button (only visible after starting the test) */}
              {hasStarted && (
                <button
                  className="bg-green-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-600 w-full sm:w-48"
                  onClick={loadNextPart}
                >
                  {taskType === "Task 1" ? "Next Part" : "Submit Test"}
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold">Test Complete!</h2>
            <p className="text-lg mt-4">You have completed all parts of the Writing Test.</p>
            <Link href="/pages/dashboard">
              <button className="mt-4 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600">
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