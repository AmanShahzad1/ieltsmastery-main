"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { saveWritingPartData, fetchWritingPartData } from "../../../../../api/writing"; 
import Link from "next/link";
import Image from "next/image"; // Import Image component for image preview
export default function AdminWritingPage() {
  const [questions, setQuestions] = useState<{ question: string }[]>([]);
  const [selectedPart, setSelectedPart] = useState<string>("Task 1");
  const [imageFile, setImageFile] = useState<File | null>(null); // For uploaded image file
  const [material, setMaterial] = useState<string>(""); // For fetched or uploaded image URL
  const [isUploading, setIsUploading] = useState<boolean>(false); // To track image upload status

  const searchParams = useSearchParams();
  const testId = searchParams.get("testId");

  // Fetch data whenever testId or selectedPart changes
  useEffect(() => {
    const fetchData = async () => {
      if (!testId) return;
      
      console.log("Fetching data for:", { testId, selectedPart });

      try {
        const data = await fetchWritingPartData(testId, selectedPart);
        console.log("Fetched data:", data);

        setQuestions(data.questions || []);
        setMaterial(data.material || ""); // Set fetched image URL
      } catch (error) {
        console.error("⚠️ Failed to fetch part data:", error);
        setQuestions([]);
        setMaterial("");
      }
    };

    fetchData();
  }, [testId, selectedPart]); // Runs when testId or selectedPart changes

  // Handle part selection
  const handlePartSelection = (part: string) => {
    if (part !== selectedPart) {
      setSelectedPart(part);
    }
  };

  // Handle adding a new question
  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "" }]);
  };

  // Handle saving the Writing Test data
  const handleSave = async () => {
    if (!testId) {
      alert("Test ID is missing");
      return;
    }

    // Check if an image is selected for upload/update
    if (!imageFile) {
      if (material) {
        alert("No image selected to update.");
      } else {
        alert("No image selected to upload.");
      }
      return;
    }

    setIsUploading(true); // Start loading state

    try {
      // Create FormData object
      const formData = new FormData();

      // Append image file
      formData.append("image", imageFile);

      // Append other data (questions, testId, partName)
      formData.append("testId", testId);
      formData.append("partName", selectedPart);
      formData.append("questions", JSON.stringify(questions));

      // Save Writing Test data (including image upload)
      const response = await saveWritingPartData(testId, selectedPart, questions, formData);
      if (response.success) {
        const imageUrl = response.imageUrl; // Get the image URL from the response
        setMaterial(imageUrl); // Update the material state with the new image URL
        alert("Data saved successfully!");
      } else {
        alert("Error saving data.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data.");
    } finally {
      setIsUploading(false); // End loading state
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <h1 className="text-2xl font-bold text-center w-full">
          Admin Writing Page - Test No: {testId}
        </h1>
      </header>


      {/* Show Material (Image URL) */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Material:</h3>
        {material ? (
          <div className="text-center">
            <Image
              src={material}
              alt="Uploaded Material"
              className="w-48 h-48 object-cover mx-auto rounded-md"
            />
            <p className="text-sm text-gray-600 mt-2">Image URL: {material}</p>
          </div>
        ) : (
          <p className="text-center text-gray-600">No material available</p>
        )}
      </div>


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

      <div className="bg-white shadow-md rounded-md p-6">
        <h3 className="text-lg font-bold mb-4">Questions</h3>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <input
              key={index}
              type="text"
              className="border border-gray-300 rounded-md p-2 w-full"
              value={question.question}
              onChange={(e) => {
                const updatedQuestions = questions.map((q, i) =>
                  i === index ? { question: e.target.value } : q
                );
                setQuestions(updatedQuestions);
              }}
              placeholder={`Question ${index + 1}`}
            />
          ))}
        </div>
        <button
          onClick={handleAddQuestion}
          className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          Add Question
        </button>
      </div>

      <div className="bg-white shadow-md rounded-md p-6 mt-6">
        <h3 className="text-lg font-bold mb-4">
          {material ? "Update Image" : "Upload Image"}
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
          {isUploading ? "Saving..." : material ? "Update Image" : "Upload Image"}
        </button>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={handleSave}
          disabled={isUploading}
          className="px-6 py-3 text-white text-lg font-bold rounded-md bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {isUploading ? "Saving..." : `Save (${selectedPart}) Test No: ${testId}`}
        </button>
        <Link
          href="/admin/tests/writing/main"
          className="ml-4 px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
        >
          Go Back
        </Link>
      </div>
    </div>
  );
}