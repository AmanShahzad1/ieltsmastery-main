import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Backend base URL


  export const fetchWritingTests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tests/writing");
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      return await response.json(); // Return the list of tests
    } catch (err) {
      console.error("Error fetching tests:", err);
      throw err; // Re-throw the error to handle it in the calling component
    }
  };

  export const createWritingTest = async (testName) => {
    try {
      const response = await fetch("http://localhost:5000/api/tests/createwriting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: testName }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to create test");
      }
  
      const data = await response.json();
      return data; // Should return { id, name }
    } catch (error) {
      console.error("Error creating test:", error);
      throw error;
    }
  };
  
// Fetch writing part data
export const fetchWritingPartData = async (testId, partName) => {
  try {
    console.log("🔵 Calling API for:", testId, partName);
    
    const response = await axios.get(`${BASE_URL}/tests/writingPart/part/${testId}/${partName}`);
    
    if (!response.data) throw new Error("No data received from server");
    
    return response.data; // ✅ Ensure this is an object with `questions` & `material`
  } catch (err) {
    console.error("❌ Error fetching writing part data:", err);
    return { questions: [], material: "" }; // Return default empty values on error
  }
};


export const saveWritingPartData = async (testId, partName, questions) => {
  try {
 
    const response = await axios.post(`${BASE_URL}/tests/writing/${testId}/${partName}`,{
      testId,
      partName,
      questions
    });
    return response.data; // Return the server response
  } catch (error) {
    // Check for known error structures, fallback to a generic error message
    if (error.response && error.response.data) {
      throw error.response.data.message || "Error saving test part data.";
    } else {
      throw "An error occurred while saving data. Please try again.";
    }
  }
};
export const saveWritingAnswer = async ({ testId, questionId, userAnswer, partId, score }) => {
    try {
      const response = await axios.post(`${BASE_URL}/writing/saveWritingAnswer`, {
        testId,
        questionId,
        userAnswer,
        partId,
        score,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error saving writing answer.";
    }
  };