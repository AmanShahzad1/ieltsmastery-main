"use client";
import { useState, useEffect } from "react";
import {
  FaClock,
  FaHeadphones,
  FaClipboardCheck,
  FaRedo,
  FaList,
  FaMicrophone,
  FaPlay,
} from "react-icons/fa";
import { fetchSpeakingData, saveSpeakingAnswer } from "../../../api/speaking";
import ProtectedRoute from "@/app/pages/RouteProtected/RouteProtected";
import axios from "axios";
import Link from "next/link";

export default function SpeakingTestPage() {
  // Existing state declarations (unchanged)
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [questions, setQuestions] = useState<
    { question: string; answer: string; id?: string }[]
  >([]);
  const [currentPart, setCurrentPart] = useState<
    "Part 1" | "Part 2" | "Part 3"
  >("Part 1");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showCountdown, setShowCountdown] = useState(false);
  const [isTestComplete, setIsTestComplete] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  // Add new state for evaluation results
  const [evaluation, setEvaluation] = useState<{
    transcript: string;
    scores: Record<string, number>;
    feedback: string;
  } | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  const testId = "16";

  // Original instructions array (unchanged)
  const instructions = [
    {
      icon: <FaList size={24} className="text-[#3b82f6]" />,
      text: "The exam is divided into 3 parts. The name of each part is mentioned on the top of the page.",
    },
    {
      icon: <FaClock size={24} className="text-[#3b82f6]" />,
      text: "There will be an active timer to remind you of how much time is left.",
    },
    {
      icon: <FaHeadphones size={24} className="text-[#3b82f6]" />,
      text: "You will use a computer and headset to read and respond to questions.",
    },
    {
      icon: <FaClipboardCheck size={24} className="text-[#3b82f6]" />,
      text: "Submit your test after you finish by clicking on 'SUBMIT TEST'. Make sure you have attempted the maximum number of questions.",
    },
    {
      icon: <FaRedo size={24} className="text-[#3b82f6]" />,
      text: "You can also review your recording and record again to change your responses after completing and before submission.",
    },
    {
      icon: <FaList size={24} className="text-[#3b82f6]" />,
      text: "You can check required browser settings for recording.",
    },
  ];

  // Save recording to backend
  // const saveRecording = async (audioBlob: Blob, questionId?: string) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append('audio', audioBlob, 'recording.wav');
  //     formData.append('testId', testId);
  //     formData.append('part', currentPart);
  //     if (questionId) formData.append('questionId', questionId);

  //     await axios.post("http://localhost:5000/api/tests/saveSpeakingAnswer", formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data'
  //       }
  //     });
  //     console.log("Recording saved successfully");
  //   } catch (error) {
  //     console.error("Error saving recording:", error);
  //   }
  // };

  // const saveRecording = async (audioBlob: Blob) => {
  //   const formData = new FormData();
  //   formData.append('audio', audioBlob, 'recording.wav');
  //   formData.append('question', questions[questionNumber - 1].question); // Current question
  //   formData.append('part', currentPart); // "Part 1", "Part 2", etc.

  //   const response = await axios.post('http://localhost:5001/evaluate_speaking', formData);
  //   setEvaluation(response.data);
  //   console.log(response.data);
  // };
  const saveRecording = async (audioBlob: Blob) => {
    setIsEvaluating(true); // Start loading
    try {
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.wav");
      formData.append("question", questions[questionNumber - 1].question);
      formData.append("part", currentPart);

      const response = await axios.post(
        "http://localhost:5001/evaluate_speaking",
        formData
      );

      const { transcript, evaluation, question } = response.data;

      console.log(response.data);
      setEvaluation(response.data);

      const bandScoreMatch = evaluation.match(/Overall Band Score: (\d)/);
      const score = bandScoreMatch ? parseInt(bandScoreMatch[1], 10) : 0; // Default to 0 if no score is found
      await saveSpeakingAnswer({
                testId,
                questionId: questions[questionNumber - 1]?.id || "", // Dynamic questionId from the questions array
                userAnswer: transcript,
                score, // Use the extracted band score
                feedback: evaluation
              });
      
    } catch (error) {
      console.error("Evaluation error:", error);
    } finally {
      setIsEvaluating(false); // Stop loading regardless of success/error
    }
  };

  // End test handler (new from Listening Test)
  const endTest = async () => {
    const isConfirmed = confirm(
      "Are you sure you want to end the test? Your progress will be saved."
    );
    if (isConfirmed) {
      setIsTestComplete(true);
      setTimerActive(false);
      if (recording) {
        stopRecording();
      }
    }
  };

  // Existing useEffect hooks (unchanged)
  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      try {
        const data = await fetchSpeakingData(testId, currentPart);
        setQuestions(data.questions || []);
        setTimeLeft(currentPart === "Part 2" ? 120 : 60);
      } catch (error) {
        console.error("Failed to fetch questions:", error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (showQuestion) {
      loadQuestions();
    }
  }, [showQuestion, currentPart]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && recording) {
      stopRecording();
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft, recording]);

  useEffect(() => {
    let countdownTimer: NodeJS.Timeout;
    if (showCountdown && countdown > 0) {
      countdownTimer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (showCountdown && countdown === 0) {
      startRecording();
      setShowCountdown(false);
    }
    return () => clearInterval(countdownTimer);
  }, [showCountdown, countdown]);

  useEffect(() => {
    if (showQuestion && questions.length > 0 && !recording && !audioUrl) {
      setShowCountdown(true);
      setCountdown(5);
    }
  }, [showQuestion, questions, questionNumber, recording, audioUrl]);

  // Modified handlers with new functionality
  const handleNextStep = async () => {
    if (!showQuestion) {
      setShowQuestion(true);
      setHasStarted(true);
      return;
    }

    if (recording) {
      stopRecording();
      return;
    }

    if (questionNumber < questions.length) {
      moveToNextQuestion();
    } else if (currentPart !== "Part 3") {
      moveToNextPart();
    } else {
      setIsTestComplete(true);
    }
  };

  const moveToNextQuestion = () => {
    setQuestionNumber((prev) => prev + 1);
    setAudioUrl(null);
    setTimerActive(false);
  };

  const moveToNextPart = () => {
    setCurrentPart(currentPart === "Part 1" ? "Part 2" : "Part 3");
    setQuestionNumber(1);
    setAudioUrl(null);
    setTimerActive(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = async (event) => {
        const audioBlob = new Blob([event.data], { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        await saveRecording(audioBlob);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        setRecording(false);
        setTimerActive(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
      setTimerActive(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif flex flex-col items-center relative">
        {/* Existing UI elements (unchanged) */}
        <img
          src="/logo.png"
          alt="IELTS Mastery Solutions Logo"
          className="h-36 w-36 absolute top-4 left-4"
        />
        <h1 className="text-3xl font-bold absolute top-10 left-1/2 transform -translate-x-1/2">
          SPEAKING TEST: {currentPart}
        </h1>
        <div className="absolute top-20 right-10 bg-blue-500 text-white p-3 rounded-md shadow-md font-semibold">
          ⏳ Time Left: {timeLeft}s
        </div>

        {/* End Test Button (new from Listening Test) */}
        {hasStarted && !isTestComplete && (
          <button
            onClick={endTest}
            className="absolute top-20 right-64 bg-red-500 text-white font-semibold px-4 py-2 rounded-md shadow-md hover:bg-red-600"
          >
            End Test
          </button>
        )}

        <div className="bg-white p-6 shadow-md rounded-md w-full max-w-2xl mt-28">
          {!isTestComplete ? (
            !showQuestion ? (
              <>
                <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
                  INSTRUCTIONS
                </h2>
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-start gap-4 mb-4">
                    <div className="p-2 bg-white rounded-full">
                      {instruction.icon}
                    </div>
                    <p className="text-gray-700 text-sm flex-1">
                      {instruction.text}
                    </p>
                  </div>
                ))}
                <button
                  onClick={handleNextStep}
                  className="mt-8 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600"
                >
                  Start Test ▶▶
                </button>
              </>
            ) : isLoading ? (
              <p className="text-center">Loading questions...</p>
            ) : questions.length > 0 ? (
              <>
                <h2 className="text-2xl font-bold text-center text-gray-800">
                  Question {questionNumber}
                </h2>
                <p className="text-lg text-center text-gray-700 mt-6">
                  {questions[questionNumber - 1]?.question ||
                    "No question available"}
                </p>

                {showCountdown ? (
                  <div className="mt-6 flex flex-col items-center">
                    <p className="text-xl font-bold text-blue-500">
                      Recording starts in: {countdown}s
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="mt-6 flex flex-col items-center">
                      <FaMicrophone
                        size={36}
                        className={
                          recording
                            ? "text-red-500 animate-pulse"
                            : "text-gray-500"
                        }
                      />
                      <p className="text-gray-700 mt-2">
                        {recording
                          ? "Recording in progress..."
                          : "Ready to record"}
                      </p>
                    </div>

                    {audioUrl && (
                      <div className="mt-4 flex items-center gap-2">
                        <audio
                          controls
                          src={audioUrl}
                          className="w-full"
                        ></audio>
                      </div>
                    )}

                    {!showCountdown && (
                      // <button
                      //   onClick={handleNextStep}
                      //   className={`mt-8 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 ${
                      //     recording ? "bg-red-500 hover:bg-red-600" : ""
                      //   }`}
                      // >
                      //   {recording ? "Stop Recording" :
                      //   questionNumber < questions.length ? "Next Question ▶▶" :
                      //   currentPart !== "Part 3" ? "Continue to Next Part ▶▶" :
                      //   "Finish Test"}
                      // </button>
                      <button
                        onClick={handleNextStep}
                        className={`mt-8 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600 ${
                          recording ? "bg-red-500 hover:bg-red-600" : ""
                        } ${
                          isEvaluating ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={isEvaluating}
                      >
                        {isEvaluating ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Evaluating...
                          </span>
                        ) : recording ? (
                          "Stop Recording"
                        ) : questionNumber < questions.length ? (
                          "Next Question ▶▶"
                        ) : currentPart !== "Part 3" ? (
                          "Continue to Next Part ▶▶"
                        ) : (
                          "Finish Test"
                        )}
                      </button>
                    )}
                  </>
                )}
              </>
            ) : (
              <p className="text-center">
                No questions available for this part
              </p>
            )
          ) : (
            <div className="text-center">
              <h2 className="text-2xl font-bold">Test Complete!</h2>
              <p className="text-lg mt-4">
                You have completed all parts of the Speaking Test.
              </p>
              <Link href="/pages/dashboard">
                <button className="mt-4 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600">
                  Return to Dashboard
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
