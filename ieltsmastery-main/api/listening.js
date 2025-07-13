import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

// ✅ Fetch Listening Test Data
export const fetchListeningData = async (testId, partName) => {
  try {
    console.log("Fetching the data frontend", testId, partName);
    const response = await axios.get(`${BASE_URL}//tests/listening/${testId}/${partName}`);
    console.log("Data fetched successfully", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching listening test data:", error);
    throw error.response?.data?.message || "Error fetching data.";
  }
};

// ✅ Save Listening Test Data
// export const saveListeningData = async (testId, partName, questions, formData) => {
//   try {
//     // Upload Audio
//     let audioUrl = null;
//     if (formData.get("audio")) {
//       console.log("Frontend Audio Received")
//       const audioRes = await axios.post(`${BASE_URL}/upload-audio`, formData);
//       console.log("Audio Saved")
//       audioUrl = audioRes.data.audioUrl;
//     }

//     // Upload Images
//     const imageUrls = [];
//     for (let i = 0; formData.get(`image_${i}`); i++) {
//       const imgRes = await axios.post(`${BASE_URL}/upload-image`, formData);
//       console.log("Images Saved")
//       imageUrls.push(imgRes.data.imageUrl);
//     }

//     // Save everything in DB
//     const response = await axios.post(`${BASE_URL}/listening/${testId}/${partName}`, {
//       questions,
//       audioUrl,
//       imageUrls: JSON.stringify(imageUrls),
//     });

//     return response.data;
//   } catch (error) {
//     console.error("Error saving listening test data:", error);
//     throw error.response?.data?.message || "Error saving data.";
//   }
// };
export const saveListeningData = async (testId, partName, questions, audioUrl, imageUrl) => {
  try {
    // Save everything in DB
    const response = await axios.post(`${BASE_URL}/tests/listening/${testId}/${partName}`, {
      questions,
      audioUrl,
      imageUrl
    });

    return response.data;
  } catch (error) {
    console.error("Error saving listening test data:", error);
    throw error.response?.data?.message || "Error saving data.";
  }
};

export const fetchListeningTests = async () => {
    try {
      const response = await fetch(`${BASE_URL}/tests/listening/tests`);
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      return await response.json(); // Return the list of tests
    } catch (err) {
      console.error("Error fetching tests:", err);
      throw err; // Re-throw the error to handle it in the calling component
    }
  };
  
  // In your `createTest` function (frontend):
export const createListeningTest = async (testName) => {
    try {
      const response = await fetch(`${BASE_URL}/tests/listening/create`, {
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
  

export const fetchListeningTestType = async (testId) => {

  try {
    console.log("Frontend Received", testId);
    const response = await axios.get(`${BASE_URL}/tests/listeningType/${testId}`);
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

export const saveListeningTestType = async (testId, difficulty) => {
  try {
 
    const response = await axios.post(`${BASE_URL}/tests/listeningType/${testId}`, {
      testId,
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

