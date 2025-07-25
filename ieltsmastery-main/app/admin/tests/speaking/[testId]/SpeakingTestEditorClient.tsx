"use client";

import { useEffect, useState } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useParams, useRouter } from "next/navigation";
import {
  fetchSpeakingData,
  saveSpeakingData,
  fetchSpeakingTestType,
  saveSpeakingTestType,
} from "../../../../../api/speaking";
import { updatePlanWithTest } from "../../../../../api/plans";
import Link from "next/link";
import Image from "next/image";

interface Question {
  question: string;
}

export default function SpeakingTestEditorClient() {
  const { testId } = useParams();
//   const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedPart, setSelectedPart] = useState("Part 1");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [difficulty, setDifficulty] = useState("Intermediate");

  useEffect(() => {
    if (!testId) return;

    const loadData = async () => {
      try {
        const [testData, typeData] = await Promise.all([
          fetchSpeakingData(testId as string, selectedPart),
          fetchSpeakingTestType(testId as string)
        ]);

        setQuestions(
          testData.questions?.map((q: Question) => ({ question: q.question || "" })) || []
        );

        if (typeData.difficulty) {
          setDifficulty(typeData.difficulty);
        }
      } catch (error) {
        console.error("Error loading test data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    setSelectedPart(part);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "" }]);
  };

  const handleSave = async () => {
    if (!testId) return;

    setIsSaving(true);
    try {
      const response = await saveSpeakingData(testId as string, selectedPart, questions);
      await saveSpeakingTestType(testId as string, difficulty);
      await updatePlanWithTest(testId as string, difficulty, 'speaking');
      
      if (!response.success) {
        throw new Error(response.message || "Save failed");
      }
      alert("Speaking test saved successfully!");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Save error:", error);
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl">Loading test editor...</div>
      </div>
    );
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
        <h1 className="text-2xl font-bold text-center w-full">
          Admin Speaking Test
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Difficulty
            </label>
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

      <div className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-lg font-bold mb-4">Questions</h3>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-md mb-4"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className="grid grid-cols-1 p-4 border border-gray-200 rounded-md"
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Question
                </label>
                <input
                  type="text"
                  className="border border-gray-300 rounded-md p-2 w-full"
                  value={q.question}
                  onChange={(e) => {
                    const updatedQuestions = [...questions];
                    updatedQuestions[index].question = e.target.value;
                    setQuestions(updatedQuestions);
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className={`px-6 py-3 text-white text-lg font-bold rounded-md ${
            isSaving ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isSaving ? "Saving..." : "Save Speaking Test"}
        </button>
        <Link
          href="/admin/tests/speaking/main"
          className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}