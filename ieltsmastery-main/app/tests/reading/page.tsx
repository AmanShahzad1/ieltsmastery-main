"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import { fetchPartData } from "../../../api/tests"; // Ensure this is your correct path
import Link from "next/link"; // Import Link component
import axios from "axios"; // Make sure axios is installed for API requests

export default function Home() {
  const [isBlurred, setIsBlurred] = useState(true);
  const [time, setTime] = useState(0); // Overall timer
  const [partTime, setPartTime] = useState(0); // Timer for each part
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [readingMaterial, setReadingMaterial] = useState<string>(""); 
  const [questions, setQuestions] = useState<{ id: number; question: string; answer: string }[]>([]);
  const [part, setPart] = useState(1); // Start with Part 1
  const [isTestComplete, setIsTestComplete] = useState(false); // Track if the test is complete
  const [audioPlayed, setAudioPlayed] = useState(false); // Track if audio has been played
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: string }>({}); // Store answers

  const testId = "1"; // Static for now

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

  // Handle Test Start
  const startTest = () => {
    if (part === 1 && !audioPlayed) {
      // Play the audio only during Part 1 if it hasn't been played already
      const audioInstance = new Audio("/audio/Reading_Start.wav");
      setAudio(audioInstance);
      audioInstance.play();
      audioInstance.addEventListener("ended", () => {
        setIsBlurred(false);
        setIsTimerRunning(true); // Start timer
        setAudioPlayed(true); // Mark audio as played
      });
    } else {
      // If audio has been played (for subsequent parts), just start the timer
      setIsBlurred(false);
      setIsTimerRunning(true);
    }
  };

  // Handle Next Part (Part 4 logic but no submission)
  const loadNextPart = () => {
    setIsTimerRunning(false); // Stop part timer
    setIsBlurred(true); // Blur questions again
    setPart(part + 1); // Move to next part
  };

 const submitTest = async () => {
    try {
      console.log("Submitting test. Current questions:", questions);
      console.log("User answers:", userAnswers);

      for (const [questionId, userAnswer] of Object.entries(userAnswers)) {
        console.log("Checking questionId:", questionId);
        const question = questions.find((q) => q.id.toString() === questionId.toString());

        if (question) {
          console.log("Found question:", question);
          await handleSubmitAnswer(question.id, userAnswer, question.answer);
        } else {
          console.warn(`Question with ID ${questionId} not found in questions array.`);
          console.log("All questions:", questions);
        }
      }

      setIsTestComplete(true);
      setIsTimerRunning(false);
    } catch (error) {
      console.error("Error submitting test:", error);
    }
  };
// Load Part Data (for first part and next part)
  useEffect(() => {
    if (part >= 1 && part <= 4) {
      loadPartData(part);
      if (part > 1) {
        setIsBlurred(true); // Blur questions initially for subsequent parts
      }
    }
  }, [part]); // Only run when part changes

  // Handle Answer Change
  const handleAnswerChange = (questionId: number, userAnswer: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: userAnswer,
    }));
  };

  // Handle Answer Submission (send to backend)
  const handleSubmitAnswer = async (questionId: number, userAnswer: string, correctAnswer: string) => {
    try {
      console.log(questionId, userAnswer, correctAnswer);
      const response = await axios.post("http://localhost:5000/api/tests/saveUserAnswer", {
        testId: testId,
        questionId: questionId,
        userAnswer: userAnswer,
        partId: part,
        correctAnswer: correctAnswer,
      });
      console.log("Answer saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };
  const handleNextPart = async () => {
    await submitTest();
    setPart((prevPart) => {
      const newPart = prevPart + 1;
      loadPartData(newPart); // Load next part immediately
      return newPart;
    });
  };
  
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
                    value={userAnswers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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
              onClick={handleNextPart}
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
