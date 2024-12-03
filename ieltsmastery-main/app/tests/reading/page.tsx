"use client";
import { useState, useEffect } from "react";

export default function readingTest() {
  // State to toggle question blur
  const [isBlurred, setIsBlurred] = useState(true);

  // Timer state
  const [time, setTime] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // Create an Audio instance
  const audio = new Audio("start audio.wav"); // Replace with your audio file path

  // Timer logic
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>; // Explicitly type the timer variable
    if (isTimerRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const startTest = () => {
    audio.play();
    audio.addEventListener("ended", () => {
      setIsBlurred(false);
      setIsTimerRunning(true);
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      {/* Header */}
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center mr-6 sm:mr-4">
          <img
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            className="h-28 w-28"
          />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">
          Reading Test
        </h1>
      </header>

      {/* Get Started Button and Timer */}
      <div className="flex items-center mb-6">
        <button
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 w-48 text-center"
          onClick={startTest}
          disabled={isTimerRunning}
        >
          Get Started
        </button>
        <div
          className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md w-48 text-center flex items-center justify-center ml-auto"
        >
          Timer: {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col lg:flex-row justify-center gap-6">
        {/* Left Section: Reading Material */}
        <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
          <h3 className="text-lg font-bold mb-4">Reading Material</h3>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book.
            </p>
            {/* Additional content */}
          </div>
        </div>

        {/* Right Section: Questions */}
        <div className="bg-white shadow-md rounded-md p-6 w-full lg:w-1/2">
          <h3 className="text-lg font-bold mb-4">Questions (1 to 5)</h3>
          <div className="space-y-6">
            {[
              "What is the name of Alex's school?",
              "What is Alex's favorite subject?",
              "Who is Alex's best friend?",
              "What sport does Alex play?",
              "What city does Alex live in?",
            ].map((question, index) => (
              <div
                key={index}
                className={`${
                  isBlurred ? "blur-sm" : "blur-none"
                } transition duration-300`}
              >
                <p className="text-sm font-medium mb-2">
                  {index + 1}): {question}
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
    </div>
  );
}
