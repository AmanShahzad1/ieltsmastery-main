"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import Image from 'next/image';
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import { fetchListeningData } from "../../../../api/listening"; // Use the same API function as the admin side
import { updateUserPerformance } from "../../../../api/performance";
import axios from "axios"; // Import axios for API calls
import Link from "next/link";
/* eslint-disable react/no-unescaped-entities */
export default function ListeningTest() {
  const params = useParams();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeUsed, setTimeUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes total for all parts
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questions, setQuestions] = useState<
    { type: string; question: string; answer: string; id: string }[]
  >([]); // Added `id` for question identification
  const [part, setPart] = useState(1);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null); // For fetched audio URL
  const [imageUrl, setImageUrl] = useState<string | null>(null); // For fetched image URL
  const [hasStarted, setHasStarted] = useState(false); // Track if the test has started
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({}); // Track user answers by question ID
  const audioRef = useRef<HTMLAudioElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [time, setTime] = useState(0);
  const testId = params.id as string;

  // Fetch listening test data (audio, image, and questions) for the selected part
  useEffect(() => {
    const fetchData = async () => {
      try {
        const partName = `Part ${part}`;
        const data = await fetchListeningData(testId, partName);
        setQuestions(data.questions || []);
        setAudioUrl(data.audioUrl || null);
        setImageUrl(data.imageUrl || null);
      } catch (error) {
        console.error("Error fetching part data:", error);
      }
    };

    fetchData();
  }, [part, testId]);

  // Timer logic
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeUsed((prev) => prev + 1);
        setTimeRemaining((prev) => prev - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      setIsTimerRunning(false);
      alert("Time's up for the Listening Test!");
      setIsTestComplete(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning, timeRemaining]);

  // Start the test
  const startTest = () => {
    setHasStarted(true); // Hide the "Start Listening" button
    setIsTimerRunning(true); // Start the timer
    setTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  // Handle play/pause for audio
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handlePlayPause = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play();
        setIsTimerRunning(true);
      } else {
        audioRef.current.pause();
        setIsTimerRunning(false);
      }
    }
  };

  // Update time as audio plays
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setTime(audioRef.current.currentTime);
    }
  };

  // Handle user answers
  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  // Save user answers to the backend
  const saveAnswers = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return false;
    }

    const decoded = jwtDecode<{ userId: number }>(token);
    const userId = decoded.userId;
    try {
      // Loop through all questions and save answers
      for (const question of questions) {
        const userAnswer = userAnswers[question.id] || ""; // Get the user's answer (default to empty string if not answered)
        await axios.post(
          "http://localhost:5000/api/tests/saveListeningAnswer",
          {
            testId: testId,
            questionId: question.id,
            userAnswer: userAnswer,
            partId: part,
            correctAnswer: question.answer, // Assuming the correct answer is stored in the question object
            userId: userId,
          }
        );
      }
      console.log("Answers saved successfully!");
    } catch (error) {
      console.error("Error saving answers:", error);
      alert("An error occurred while saving your answers. Please try again.");
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

  // Load the next part of the test
  const loadNextPart = async () => {
    // Save answers before moving to the next part
// eslint-disable-next-line @typescript-eslint/no-unused-vars
    const success = await saveAnswers();
    



    if (part < 4) {
      setPart(part + 1);
      setTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setIsTestComplete(true);
      await updateTestPerformance();
    }
  };

  // End the test manually
  const endTest = async () => {
    // Show confirmation prompt
    const isConfirmed = confirm(
      "Are you sure you want to end the test? Your progress will be saved, but you won't be able to resume."
    );
    if (isConfirmed) {
      // Save answers before ending the test
// eslint-disable-next-line @typescript-eslint/no-unused-vars
      const success = await saveAnswers();
      

      await updateTestPerformance();

      setIsTimerRunning(false); // Stop the timer
      setIsTestComplete(true); // Mark the test as complete
      if (audioRef.current) {
        audioRef.current.pause(); // Pause the audio
      }
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
      <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
          <Image
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            className="h-28 w-28"
          />
          <h1 className="text-2xl font-bold sm:ml-4 text-center w-full">
            Listening Test
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

            {/* Start Listening Button (only visible if the test hasn't started) */}
            {!hasStarted && (
              <button
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48"
                onClick={startTest}
              >
                Start Listening
              </button>
            )}

            {/* End Test Button (only visible if the test has started) */}
            {hasStarted && (
              <button
                className="bg-red-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-red-600 w-full sm:w-48 mt-4"
                onClick={endTest}
              >
                End Test
              </button>
            )}

            {/* Audio Player and Image Display */}
            <div className="mt-4 bg-white shadow-md rounded-md p-4">
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={handleTimeUpdate}
                  controls
                  className="w-full"
                ></audio>
              )}

              {imageUrl && (
                <div className="mt-4 flex justify-center">
                  <Image
                    src={imageUrl}
                    alt="Listening Test Image"
                    className="max-w-full h-auto rounded-md"
                  />
                </div>
              )}
            </div>

            {/* Questions Section */}
            <div className="bg-white shadow-md rounded-md p-6 w-full mt-6">
              <h3 className="text-lg font-bold mb-4">
                Questions - Part {part}
              </h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id}>
                    <p className="text-sm font-medium mb-2">
                      {index + 1}. {question.question}
                    </p>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Your answer..."
                      value={userAnswers[question.id] || ""}
                      onChange={(e) =>
                        handleAnswerChange(question.id, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Next Part Button */}
            <button
              className="mt-4 bg-green-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-green-600 w-full sm:w-48"
              onClick={loadNextPart}
            >
              {part < 4 ? "Next Part" : "Finish Test"}
            </button>
          </>
        ) : (
          <div className="text-center mt-8">
            <h2 className="text-2xl font-bold">Test Complete!</h2>
            <p className="text-lg mt-4">
              You have completed all parts of the Listening Test.
            </p>
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
}
