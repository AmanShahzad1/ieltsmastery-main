import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"; // Backend base URL
const API_URL = process.env.NEXT_PUBLIC_LLM_URL || 'http://localhost:5001' ;


  export const fetchWritingTests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tests/writing`);
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
      const response = await fetch(`${BASE_URL}/tests/createwriting`, {
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




export const saveWritingPartData = async (testId, partName, questions, formData) => {
  try {
    // Upload Image (Single)
    let imageUrl = null;
    if (formData && formData.get("image")) {
      console.log("Frontend Image Received");
      const imageRes = await axios.post(`${BASE_URL}/tests/upload-image`, formData, {
        headers: {
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });
      console.log("Image Saved");
      imageUrl = imageRes.data.imageUrl; // Get the image URL from the response
    }

    // Save everything in DB
    const response = await axios.post(`${BASE_URL}/tests/writing/${testId}/${partName}`, {
      testId,
      partName,
      questions,
      material: imageUrl, // Send image URL as material
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
export const saveWritingAnswer = async ({ testId, questionId, userAnswer, partId, score, userId }) => {
    try {
      console.log("Trying to save", testId, questionId, userAnswer, partId, score, userId)
      const response = await axios.post(`${BASE_URL}/tests/writing/saveWritingAnswer`, {
        testId,
        questionId,
        userAnswer,
        partId,
        score,
        userId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error saving writing answer.";
    }
  };


export const saveWritingLLMResponse = async ({ testId, questionId, feedback, partId, score }) => {
    try {
      console.log("Trying to save LLM")
      const response = await axios.post(`${BASE_URL}/tests/writing/saveWritingLLMResponse`, {
        testId,
        questionId,
        feedback,
        partId,
        score,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error saving writing answer.";
    }
  };

  //Flask api
export const getFeedbackFromFlask = async (userAnswer) => {
    try {
      const response = await fetch(`${API_URL}/chatbot?question=${encodeURIComponent(userAnswer)}`);
      if (!response.ok) {
        throw new Error("Failed to fetch feedback from Flask backend");
      }
      const data = await response.json();
      return data.response; // The feedback from the Flask backend
    } catch (error) {
      console.error("Error fetching feedback:", error);
      return null;
    }
  };


// plan generation work
export const fetchWritingTestType = async (testId) => {

  try {
    console.log("Frontend Received", testId);
    const response = await axios.get(`${BASE_URL}/tests/writingType/${testId}`);
    console.log("Response", response);
    return response.data; // Return the data from the response
  } catch (error) {
    // Check for known error structures, fallback to a generic error message
    if (error.response && error.response.data) {
      throw error.response.data.message || "Error fetching test type data.";
    } else {
      throw "An error occurred while fetching data. Please try again.";
    }
  }
};

export const saveWritingTestType = async (testId, type, difficulty) => {
  try {
 
    const response = await axios.post(`${BASE_URL}/tests/writingType/${testId}`, {
      testId,
      type,
      difficulty
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
