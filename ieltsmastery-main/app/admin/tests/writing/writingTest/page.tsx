"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  saveWritingPartData,
  fetchWritingPartData,
  fetchWritingTestType,
  saveWritingTestType,
} from "../../../../../api/writing";
import { updatePlanWithTest } from "../../../../../api/plans";
import Link from "next/link";

export default function AdminWritingPage() {
  const [questions, setQuestions] = useState<{ question: string }[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("Task 1");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [material, setMaterial] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  const [testType, setTestType] = useState<string>("Academic");
  const [difficulty, setDifficulty] = useState<string>("Intermediate");

  useEffect(() => {
    const fetchData = async () => {
      if (!testId) return;

      try {
        const data = await fetchWritingPartData(testId, selectedPart);
        setQuestions(data.questions || []);
        setMaterial(data.material || "");

        // Fetch test type and difficulty
        const typeData = await fetchWritingTestType(testId);
        if (typeData.type) setTestType(typeData.type);
        if (typeData.difficulty) setDifficulty(typeData.difficulty);
      } catch (error) {
        console.error("Failed to fetch part data:", error);
        setQuestions([]);
        setMaterial("");
      }
    };

    fetchData();
  }, [testId, selectedPart]);

  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      setSelectedPart(part);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "" }]);
  };

  const handleSave = async () => {
    if (!testId) {
      alert("Test ID is missing");
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      
      // Only append image if one was selected
      if (imageFile) {
        formData.append("image", imageFile);
      }
      
      formData.append("testId", testId);
      formData.append("partName", selectedPart);
      formData.append("questions", JSON.stringify(questions));
      
      // Include existing material URL if no new file was selected
      if (!imageFile && material) {
        formData.append("material", material);
      }

      const response = await saveWritingPartData(
        testId,
        selectedPart,
        questions,
        formData
      );

      await saveWritingTestType(testId, testType, difficulty);
      const res = await updatePlanWithTest(testId, difficulty, 'writing');  
            if (res.success) console.log("Plan updated:", res.updatedPlans);
      
      if (response.success) {
        // Update material state if a new image URL was returned
        if (response.imageUrl) {
          setMaterial(response.imageUrl);
        }
        setImageFile(null); // Clear the file input after successful save
        alert("Data saved successfully!");
      } else {
        alert("Error saving data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold text-center w-full">
          Admin Writing Page - Test No: {testId}
        </h1>
      </header>

      {/* Material Display Section */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Material</h3>
        {material ? (
          <div className="text-center">
            <img
              src={material}
              alt="Writing Task Material"
              className="max-w-full h-auto max-h-96 mx-auto rounded-md"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <p className="text-sm text-gray-600 mt-2">Current Material</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">No material available</p>
        )}
      </div>

      {/* Test Type and Difficulty Selectors */}
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

      {/* Task Selection */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Select Task</h3>
        <div className="flex justify-center space-x-4">
          {["Task 1", "Task 2"].map((task) => (
            <button
              key={task}
              className={`px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100 ${
                selectedPart === task ? "bg-blue-100" : ""
              }`}
              onClick={() => handlePartSelection(task)}
            >
              {task}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Section */}
      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Questions</h3>
          <button
            onClick={handleAddQuestion}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Add Question
          </button>
        </div>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <input
              key={index}
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={question.question}
              onChange={(e) => {
                const updatedQuestions = [...questions];
                updatedQuestions[index].question = e.target.value;
                setQuestions(updatedQuestions);
              }}
              placeholder={`Question ${index + 1}`}
            />
          ))}
          {questions.length === 0 && (
            <p className="text-gray-500 text-center">No questions added yet</p>
          )}
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="bg-white shadow-md rounded-md p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">
          {material ? "Update Material Image" : "Upload Material Image"}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          {material ? "Select a new image to update" : "Optional: Upload an image for this task"}
        </p>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImageFile(e.target.files?.[0] || null)}
          className="border border-gray-300 rounded-md p-2 w-full"
        />
      </div>

      {/* Save Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="px-6 py-3 text-white text-lg font-bold rounded-md"
          style={{ backgroundColor: "#03036D" }}
        >
          {isUploading ? "Saving..." : `Save (${selectedPart}) Test No: ${testId}`}
        </button>
        <Link
          href="/admin/tests/writing/main"
          className="px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}