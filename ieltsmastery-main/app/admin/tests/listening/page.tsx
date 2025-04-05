"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchListeningData, saveListeningData } from "../../../../api/listening";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";

export default function AdminListeningPage() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [questions, setQuestions] = useState<{ type: string; question: string; answer: string }[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("Part 1");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [showAudioUpload, setShowAudioUpload] = useState<boolean>(false);
  const [showImageUpload, setShowImageUpload] = useState<boolean>(false);

  useEffect(() => {
    if (testId && selectedPart) {
      fetchListeningData(testId, selectedPart)
        .then((data) => {
          setQuestions(data.questions || []);
          setAudioUrl(data.audioUrl || null);
          setImageUrl(data.imageUrl || null);
          setAudioFile(null);
          setImageFile(null);
          setShowAudioUpload(false);
          setShowImageUpload(false);
        })
        .catch((error) => {
          console.error("Failed to fetch part data:", error);
          setQuestions([]);
          setAudioUrl(null);
          setImageUrl(null);
        });
    }
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      setSelectedPart(part);
    }
  };

  const handleAddQuestion = (type: string) => {
    setQuestions([...questions, { type, question: "", answer: "" }]);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "audio" | "image") => {
    if (e.target.files) {
      if (type === "audio") {
        setAudioFile(e.target.files[0]);
        setAudioUrl(URL.createObjectURL(e.target.files[0]));
        setShowAudioUpload(false);
      } else {
        setImageFile(e.target.files[0]);
        setImageUrl(URL.createObjectURL(e.target.files[0]));
        setShowImageUpload(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true)
    try {
      let finalAudioUrl = null;
      let finalImageUrl = null;
  
      // Upload audio if new file exists
      if (audioFile) {
        const audioFormData = new FormData()
        audioFormData.append('audio', audioFile)
        const audioRes = await axios.post(`http://localhost:5000/api/tests/upload-audio`, audioFormData);
        console.log("Audio Saved");
        finalAudioUrl = audioRes.data.audioUrl;
        
      }
    
  
      // Upload image if new file exists
      if (imageFile) {
        const imageFormData = new FormData()
        imageFormData.append('image', imageFile)
        const imageResponse = await axios.post(`http://localhost:5000/api/tests/upload-image`, imageFormData);
        console.log("Image Saved");
        finalImageUrl = imageResponse.data.imageUrl;
      }
    
      // Save all data
      const saveResponse = await saveListeningData(
        testId as string,
        selectedPart,
        questions,
        finalAudioUrl,
        finalImageUrl
      )
  
      if (!saveResponse.success) {
        throw new Error(saveResponse.error || 'Save failed')
      }
  
      alert('Saved successfully!')
    } catch (error: any) {
      console.error('Save error:', error)
      alert(`Error: ${error.message || 'Unknown error'}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
         <div className="flex items-center mr-6 sm:mr-4">
                <Image
                  src="/logo.png"
                  alt="IELTS Mastery Solutions Logo"
                  width={112}
                  height={112}
                  className="h-28 w-28"
                  priority
                />
                </div>
        <h1 className="text-2xl font-bold text-center w-full">Admin Listening Test</h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Select Part</h3>
        <div className="flex justify-center space-x-4">
          {["Part 1", "Part 2", "Part 3", "Part 4"].map((part) => (
            <button
              key={part}
              className={`px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100 ${selectedPart === part ? "bg-blue-100" : ""}`}
              onClick={() => handlePartSelection(part)}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Audio File</h3>
        {audioUrl ? (
          <>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Preview:</p>
              <audio controls className="mt-4 w-full" key={audioUrl}>
                <source src={audioUrl} type="audio/wav" />
                Your browser does not support the audio element.
              </audio>
            </div>
            <button
              onClick={() => setShowAudioUpload(!showAudioUpload)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update Audio
            </button>
            {showAudioUpload && (
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, "audio")}
                className="mt-4"
              />
            )}
          </>
        ) : (
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => handleFileUpload(e, "audio")}
          />
        )}
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Image</h3>
        {imageUrl ? (
          <>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={imageUrl}
                alt="Preview"
                className="w-24 h-24 object-cover rounded-md"
              />
            </div>
            <button
              onClick={() => setShowImageUpload(!showImageUpload)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Update Image
            </button>
            {showImageUpload && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "image")}
                className="mt-4"
              />
            )}
          </>
        ) : (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, "image")}
          />
        )}
      </div>

      <div className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-lg font-bold mb-4">Questions</h3>
        <div className="flex space-x-2 mb-4">
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md" onClick={() => handleAddQuestion("MCQ")}>Add MCQ</button>
          <button className="px-4 py-2 bg-green-500 text-white rounded-md" onClick={() => handleAddQuestion("Fill in the Blanks")}>Add Fill in the Blanks</button>
          <button className="px-4 py-2 bg-yellow-500 text-white rounded-md" onClick={() => handleAddQuestion("Question")}>Add Question</button>
          <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => handleAddQuestion("True/False")}>Add True/False</button>
        </div>
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input type="text" className="border border-gray-300 rounded-md p-2 w-full" placeholder={q.type} value={q.question} onChange={(e) => {
                const updatedQuestions = questions.map((item, i) => i === index ? { ...item, question: e.target.value } : item);
                setQuestions(updatedQuestions);
              }} />
              <input type="text" className="border border-gray-300 rounded-md p-2 w-full" placeholder="Answer" value={q.answer} onChange={(e) => {
                const updatedQuestions = questions.map((item, i) => i === index ? { ...item, answer: e.target.value } : item);
                setQuestions(updatedQuestions);
              }} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button onClick={handleSave} className="px-6 py-3 text-white text-lg font-bold rounded-md bg-blue-600">Save Listening Test</button>
        <Link href="/admin/tests/listening/main" className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600">Go Back</Link>
      </div>
    </div>
  );
}