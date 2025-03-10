"use client";
import { useState, useEffect } from "react";
import { FaClock, FaHeadphones, FaClipboardCheck, FaRedo, FaList, FaMicrophone, FaPlay } from "react-icons/fa";

export default function GeneralInstructions() {
  const [showQuestion, setShowQuestion] = useState(false);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<BlobPart[]>([]);

  const questions = [
    "What is your name?",
    "Where are you from?",
    "What do you do for a living?"
  ];

  const instructions = [
    { icon: <FaList size={24} className="text-[#3b82f6]" />, text: "The exam is divided into 3 parts. The name of each part is mentioned on the top of the page." },
    { icon: <FaClock size={24} className="text-[#3b82f6]" />, text: "There will be an active timer to remind you of how much time is left." },
    { icon: <FaHeadphones size={24} className="text-[#3b82f6]" />, text: "You will use a computer and headset to read and respond to questions." },
    { icon: <FaClipboardCheck size={24} className="text-[#3b82f6]" />, text: "Submit your test after you finish by clicking on ‘SUBMIT TEST’. Make sure you have attempted the maximum number of questions." },
    { icon: <FaRedo size={24} className="text-[#3b82f6]" />, text: "You can also review your recording and record again to change your responses after completing and before submission." },
    { icon: <FaList size={24} className="text-[#3b82f6]" />, text: "You can check required browser settings for recording." },
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (timerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, timeLeft]);

  const handleNextStep = async () => {
    if (!showQuestion) {
      setShowQuestion(true);
      setTimerActive(true);
      startRecording();
    } else if (recording) {
      stopRecording();
    } else if (questionNumber < questions.length) {
      setQuestionNumber((prev) => prev + 1);
      setTimeLeft(60);
      setAudioUrl(null);
      startRecording();
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        setAudioChunks([]);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setAudioChunks(chunks);
      setRecording(true);
    } catch (error) {
      console.error("Error accessing microphone", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e8f1ff] p-8 font-serif flex flex-col items-center relative">
      {/* Logo */}
      <img src="/logo.png" alt="IELTS Mastery Solutions Logo" className="h-36 w-36 absolute top-4 left-4" />

      {/* Title */}
      <h1 className="text-3xl font-bold absolute top-10 left-1/2 transform -translate-x-1/2">
        SPEAKING TEST
      </h1>

      {/* Timer */}
      <div className="absolute top-20 right-10 bg-blue-500 text-white p-3 rounded-md shadow-md font-semibold">
        ⏳ Time Left: {timeLeft}s
      </div>

      {/* Instructions or Question Box */}
      <div className="bg-white p-6 shadow-md rounded-md w-full max-w-2xl mt-28">
        {!showQuestion ? (
          <>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">INSTRUCTIONS</h2>
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start gap-4 mb-4">
                <div className="p-2 bg-white rounded-full">{instruction.icon}</div>
                <p className="text-gray-700 text-sm flex-1">{instruction.text}</p>
              </div>
            ))}
          </>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-center text-gray-800">Question {questionNumber}</h2>
            <p className="text-lg text-center text-gray-700 mt-6">{questions[questionNumber - 1]}</p>

            {/* Recording Section */}
            <div className="mt-6 flex flex-col items-center">
              <FaMicrophone size={36} className={recording ? "text-red-500 animate-pulse" : "text-gray-500"} />
              <p className="text-gray-700 mt-2">{recording ? "Recording... Click again to stop" : "Click to record"}</p>
            </div>

            {/* Audio Playback */}
            {audioUrl && (
              <div className="mt-4 flex items-center gap-2">
                <FaPlay size={24} className="text-blue-500" />
                <audio controls src={audioUrl} className="w-full"></audio>
              </div>
            )}
          </>
        )}

        {/* Next Step Button */}
        <button onClick={handleNextStep} className="mt-8 bg-blue-500 text-white font-semibold px-6 py-3 rounded-md shadow-md hover:bg-blue-600">
          {!showQuestion ? "Start Test ▶▶" : recording ? "Stop Recording" : questionNumber < questions.length ? "Next Question ▶▶" : "Finish Test"}
        </button>
      </div>
    </div>
  );
}
