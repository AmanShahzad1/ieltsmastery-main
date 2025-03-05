"use client";
import { useState, useEffect, useRef } from "react";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import { fetchPartData } from "../../../api/tests";
import Link from "next/link";

export default function ListeningTest() {
  const [timeUsed, setTimeUsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes total for all parts
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [part, setPart] = useState(1);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const audioRef = useRef(null);
  const [time, setTime] = useState(0);
  const testId = "1";

  const audioFiles = [
    "/audio/part1_audio.wav",
    "/audio/part2_audio.wav",
    "/audio/part3_audio.wav",
    "/audio/part4_audio.wav"
  ];

  const loadPartData = async (part) => {
    try {
      const partName = `Part ${part}`;
      const data = await fetchPartData(testId, partName);
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error fetching part data:", error);
    }
  };

  useEffect(() => {
    let timer = null;
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

  useEffect(() => {
    if (part >= 1 && part <= 4) {
      loadPartData(part);
    }
  }, [part]);

  const startTest = () => {
    setIsTimerRunning(true);
    setTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

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

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setTime(audioRef.current.currentTime);
    }
  };

  const loadNextPart = () => {
    setIsTimerRunning(false);
    if (part < 4) {
      setPart(part + 1);
      setTime(0);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    } else {
      setIsTestComplete(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif">
        <header className="flex flex-col sm:flex-row items-center sm:justify-between mb-6">
          <img src="/logo.png" alt="IELTS Mastery Solutions Logo" className="h-28 w-28" />
          <h1 className="text-2xl font-bold sm:ml-4 text-center w-full">Listening Test</h1>
        </header>

        {!isTestComplete ? (
          <>
            <button
              className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-full sm:w-48"
              onClick={startTest}
              disabled={isTimerRunning}
            >
              Start Listening
            </button>

            <div className="mt-4 bg-white shadow-md rounded-md p-4">
              <audio
                ref={audioRef}
                src={audioFiles[part - 1]}
                onTimeUpdate={handleTimeUpdate}
              ></audio>

              <div className="flex items-center justify-between mt-4">
                <button
                  className="bg-gray-300 text-gray-700 rounded-md px-4 py-2"
                  onClick={handlePlayPause}
                >
                  {audioRef.current?.paused ? "Play" : "Pause"}
                </button>
                <div className="w-full mx-4">
                  <input
                    type="range"
                    min="0"
                    max={audioRef.current?.duration || 0}
                    value={time}
                    onChange={(e) => {
                      if (audioRef.current) {
                        audioRef.current.currentTime = e.target.value;
                        setTime(e.target.value);
                      }
                    }}
                    className="w-full"
                  />
                </div>
                <span className="text-sm text-gray-600">
                  {formatTime(time)}
                </span>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-md p-6 w-full mt-6">
              <h3 className="text-lg font-bold mb-4">Questions - Part {part}</h3>
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={index}>
                    <p className="text-sm font-medium mb-2">
                      {index + 1}): {question.question}
                    </p>
                    <input
                      type="text"
                      className="border border-gray-300 rounded-md p-2 w-full"
                      placeholder="Your answer..."
                    />
                  </div>
                ))}
              </div>
            </div>

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
            <p className="text-lg mt-4">You have completed all parts of the Listening Test.</p>
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
