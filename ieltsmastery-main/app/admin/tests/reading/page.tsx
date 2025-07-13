"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { fetchPartData, savePartData, fetchTestType, saveTestType } from "../../../../api/tests";
import { updatePlanWithTest } from "../../../../api/plans";
import Link from "next/link";
import Image from "next/image";

interface Question {
  id?: number;
  question: string;
  answer: string;
  question_num?: string;
}

export default function AdminReadingPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AdminReadingPageContent />
    </Suspense>
  );
}


function AdminReadingPageContent() {
  const [readingMaterial, setReadingMaterial] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("Part 1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [testType, setTestType] = useState<string>("Academic");
  const [difficulty, setDifficulty] = useState<string>("Intermediate");
  const [lastQuestionNumber, setLastQuestionNumber] = useState<number>(0);
  
  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  useEffect(() => {
    if (testId && selectedPart) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchPartData(testId, selectedPart).then((data: any) => {
        const loadedQuestions: Question[] = data.questions || [];
        setQuestions(loadedQuestions);
        
        if (loadedQuestions.length > 0) {
          const maxNumber = loadedQuestions.reduce((max: number, q: Question) => {
            const match = q.question.match(/Question (\d+)/);
            return match ? Math.max(max, parseInt(match[1])) : max;
          }, 0);
          setLastQuestionNumber(maxNumber);
        }
        
        setReadingMaterial(data.readingMaterial || "");
        setImageUrl(data.readingimage || "");
      }).catch((error: Error) => {
        console.error("Failed to fetch part data:", error);
        setQuestions([]);
        setReadingMaterial("");
        setImageUrl("");
      });
// eslint-disable-next-line @typescript-eslint/no-explicit-any
      fetchTestType(testId).then((data: any) => {
        if (data.type) setTestType(data.type);
        if (data.difficulty) setDifficulty(data.difficulty);
      }).catch(() => {});
    }
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      const currentMaxNumber = questions.reduce((max: number, q: Question) => {
        const match = q.question.match(/Question (\d+)/);
        const num = match ? parseInt(match[1]) : 0;
        return Math.max(max, num);
      }, lastQuestionNumber);
      
      setLastQuestionNumber(currentMaxNumber);
      setSelectedPart(part);
      setQuestions([]);
      setReadingMaterial("");
      setImageUrl("");
      setImageFile(null);
    }
  };

  const handleAddQuestion = () => {
    const newQuestionNumber = lastQuestionNumber + 1;
    setQuestions([...questions, { 
      question: `Question ${newQuestionNumber}: `, 
      answer: "" 
    }]);
    setLastQuestionNumber(newQuestionNumber);
  };

  const handleRemoveQuestion = (index: number) => {
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };

  const handleSave = async () => {
    if (!testId) {
      alert("Test ID is missing");
      return;
    }
  
    setIsUploading(true);
  
    try {
      const formData = new FormData();
      
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      formData.append("testId", testId);
      formData.append("partName", selectedPart);
      formData.append("questions", JSON.stringify(questions));
      formData.append("readingMaterial", readingMaterial);
      
      if (!imageFile && imageUrl) {
        formData.append("readingimage", imageUrl);
      }

      const response = await savePartData(formData);
      
      if (response.readingimage) {
        setImageUrl(response.readingimage);
      }

      await saveTestType(testId, testType, difficulty);
      const res = await updatePlanWithTest(testId, difficulty, 'reading');  
      if (res.success) console.log("Plan updated:", res.updatedPlans); 
      
      alert("Data saved successfully!");
    } catch (error) {
      console.error("Detailed error:", error);
      alert(`An error occurred while saving: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsUploading(false);
    }
  };

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
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">
          Admin Reading Page - Test No: {testId}
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Test Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="Academic">Academic</option>
              <option value="General">General</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4 text-center">Reading Material Preview</h3>
        {imageUrl && (
          <div className="mb-6 flex flex-col items-center">
            <div className="relative w-full max-w-2xl">
              <img
                src={imageUrl}
                alt="Reading Material Visual"
                className="w-full h-auto max-h-96 object-contain rounded-lg border border-gray-200 shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span className="text-xs text-gray-500 mt-1 block text-center">
                Current Material Image
              </span>
            </div>
          </div>
        )}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-lg font-semibold mb-2">Text Content:</h4>
          {readingMaterial ? (
            <pre className="font-sans whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
              {readingMaterial}
            </pre>
          ) : (
            <p className="text-gray-500 italic">No text content available</p>
          )}
        </div>
      </div>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Select Part</h3>
        <div className="flex justify-center space-x-4">
          {["Part 1", "Part 2", "Part 3"].map((part) => (
            <button
              key={part}
              className={`px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100 ${
                selectedPart === part ? "bg-blue-100" : ""
              }`}
              onClick={() => handlePartSelection(part)}
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-center">
        <div className="w-full sm:w-1/2 flex flex-col space-y-6 pr-0 sm:pr-8">
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Questions</h3>
              <button
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Add Question
              </button>
            </div>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const questionText = question.question.replace(/^Question \d+:\s*/, '');
                const questionNumber = question.question.match(/Question (\d+)/)?.[1] || (lastQuestionNumber + index + 1);
                
                return (
                  <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium whitespace-nowrap">Question {questionNumber}:</span>
                        <input
                          type="text"
                          className="border border-gray-300 rounded-md p-2 w-full"
                          value={questionText}
                          onChange={(e) => {
                            const updatedQuestions = [...questions];
                            updatedQuestions[index].question = `Question ${questionNumber}: ${e.target.value}`;
                            setQuestions(updatedQuestions);
                          }}
                          placeholder="Enter question text"
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={question.answer || ""}
                        onChange={(e) => {
                          const updatedQuestions = [...questions];
                          updatedQuestions[index].answer = e.target.value;
                          setQuestions(updatedQuestions);
                        }}
                        placeholder={`Answer ${questionNumber}`}
                      />
                      <button
                        onClick={() => handleRemoveQuestion(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
              {questions.length === 0 && (
                <p className="text-gray-500 text-center">No questions added yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="w-full sm:w-1/2 space-y-6 mt-6 sm:mt-0">
          <div className="bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-bold mb-4">Reading Material Text</h3>
            <textarea
              className="border border-gray-300 rounded-md p-4 w-full h-60 resize-none"
              value={readingMaterial}
              onChange={(e) => setReadingMaterial(e.target.value)}
              placeholder="Enter the reading material here..."
            ></textarea>
          </div>

          <div className="bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-bold mb-4">
              {imageUrl ? "Update Image" : "Upload Image"}
            </h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="border border-gray-300 rounded-md p-2 w-full"
            />
            <button
              onClick={handleSave}
              disabled={isUploading}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isUploading ? "Uploading..." : imageUrl ? "Update Image" : "Upload Image"}
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="px-6 py-3 text-white text-lg font-bold rounded-md"
          style={{ backgroundColor: "#03036D" }}
        >
          {isUploading ? "Saving..." : `Save (${selectedPart}) Test No: ${testId}`}
        </button>
        <Link 
          href="/admin/tests/reading/main" 
          className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}