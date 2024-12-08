"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import { fetchPartData } from "../../../api/tests"; // Ensure this is your correct path
import Link from "next/link"; // Import Link component

export default function Home() {
  const [isBlurred, setIsBlurred] = useState(true);
  const [time, setTime] = useState(0); // Overall timer
  const [partTime, setPartTime] = useState(0); // Timer for each part
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<string>("");
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([]);
  const [part, setPart] = useState(1); // Start with Part 1
  const [isTestComplete, setIsTestComplete] = useState(false); // Track if the test is complete
  const testId = "1"; // Static for now

  // Different audio files for each part
  const audioFiles = [
    "/audio/part1_audio.wav", // Audio for Part 1
    "/audio/part2_audio.wav", // Audio for Part 2
    "/audio/part3_audio.wav", // Audio for Part 3
    "/audio/part4_audio.wav", // Audio for Part 4
  ];

  // Fetch Part Data
  const loadPartData = async (part: number) => {
    try {
      const partName = `Part ${part}`;
      const data = await fetchPartData(testId, partName); // Use the API call
      setReadingMaterial(data.readingMaterial || "");
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching part data:", error);
    }
  };

  // Timer logic for overall test
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1); // Increase overall time
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerRunning]);

  // Timer logic for each part
  useEffect(() => {
    let partTimer: NodeJS.Timeout | null = null;
    if (isTimerRunning && partTime < 900) { // Each part lasts 15 minutes (900 seconds)
      partTimer = setInterval(() => {
        setPartTime((prevPartTime) => prevPartTime + 1); // Increase part time
      }, 1000);
    }
    return () => {
      if (partTimer) clearInterval(partTimer);
    };
  }, [isTimerRunning, partTime]);

  // Handle Test Start
  const startTest = () => {
    if (audio) {
      audio.play();
      audio.addEventListener("ended", () => {
        setIsBlurred(false);
        setIsTimerRunning(true); // Start both timers
      });
    }
  };

  // Handle Next Part
  const loadNextPart = () => {
    setIsTimerRunning(false); // Stop part timer
    setPartTime(0); // Reset part timer
    setIsBlurred(true); // Blur questions again
    setPart(part + 1); // Move to next part
  };

  // Handle Submit Test
  const submitTest = () => {
    setIsTimerRunning(false); // Stop overall timer
    setIsTestComplete(true); // Mark the test as complete
  };

  // Load Part Data (for first part and next part)
  useEffect(() => {
    if (part >= 1 && part <= 4) {
      loadPartData(part);
      if (part > 1) {
        setIsBlurred(true); // Blur questions initially for subsequent parts
      }
      // Play the corresponding audio file for each part
      if (typeof window !== "undefined") {
        const audioInstance = new Audio(audioFiles[part - 1]); // Get audio based on current part
        setAudio(audioInstance);
      }
    }
  }, [part]);

  // Reset Timer and Move to Next Part after 15 Minutes
  useEffect(() => {
    if (partTime >= 900 && part < 4) {
      loadNextPart();
    }
  }, [partTime, part]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
          <div className="flex items-center mb-4 sm:mb-0 sm:mr-4">
            <img src="/logo.png" alt="IELTS Mastery Solutions Logo" className="h-28 w-28" />
          </div>
          <h1 className="text-2xl font-bold sm:ml-4 text-center w-full">
            Reading Test
          </h1>
        </header>

        {/* Get Started Button and Timer */}
        <div className="flex flex-col sm:flex-row items-center sm:justify-between sm:gap-4 mb-6">
          {/* Get Started Button */}
          <button
            className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48 text-center"
            onClick={startTest}
            disabled={isTimerRunning}
          >
            Get Started
          </button>

          {/* Timers - On large screens, align them to the right */}
          <div className="flex gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
            {/* Overall Timer */}
            <div className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md text-center flex items-center justify-center">
              Timer: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
            </div>
            {/* Part Timer */}
            <div className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md text-center flex items-center justify-center">
              Part Timer: {Math.floor(partTime / 60)}:{String(partTime % 60).padStart(2, "0")}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row justify-center gap-6">
          {/* Left Section: Reading Material */}
          <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
            <h3 className="text-lg font-bold mb-4">Reading Material</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">{readingMaterial}</p>
            </div>
          </div>

          {/* Right Section: Questions */}
          <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
            <h3 className="text-lg font-bold mb-4">Questions ({part === 1 ? "1 to 10" : part === 2 ? "11 to 20" : part === 3 ? "21 to 30" : "31 to 40"})</h3>
            <div className="space-y-6">
              {questions.map((question, index) => (
                <div key={index} className={`${isBlurred ? "blur-sm" : "blur-none"} transition duration-300`}>
                  <p className="text-sm font-medium mb-2">
                    {index + 1}): {question.question}
                  </p>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="Your answer..."
                    disabled={isBlurred}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Part Button or Submit Test Button */}
        <div className="flex justify-center mt-8">
          {part < 4 ? (
            <button
              onClick={loadNextPart}
              className="px-6 py-3 text-white text-lg font-bold rounded-md"
              style={{ backgroundColor: "#03036D" }}
            >
              Next Part
            </button>
          ) : (
            <button
              onClick={submitTest}
              className="px-6 py-3 text-white text-lg font-bold rounded-md"
              style={{ backgroundColor: "#03036D" }}
            >
              Submit Test
            </button>
          )}
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
}
