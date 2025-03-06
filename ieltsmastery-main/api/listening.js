import axios from "axios";

const BASE_URL = "http://localhost:5000/api/tests";

// ✅ Fetch Listening Test Data
export const fetchListeningData = async (testId, partName) => {
  try {
    console.log("Fetching the data frontend", testId, partName);
    const response = await axios.get(`${BASE_URL}/listening/${testId}/${partName}`);
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
export const saveListeningData = async (testId, partName, questions, formData) => {
  try {
     // Upload Audio
     let audioUrl = null;
     if (formData.get("audio")) {
       console.log("Frontend Audio Received")
       const audioRes = await axios.post(`${BASE_URL}/upload-audio`, formData);
       console.log("Audio Saved")
       audioUrl = audioRes.data.audioUrl;
     }

    // Upload Images
    let imageUrls = [];
    if (formData.getAll("images").length > 0) {
      console.log("Frontend Images Received");
      const imagesRes = await axios.post(`${BASE_URL}/upload-image`, formData);
      console.log("Images Saved");
      imageUrls = imagesRes.data.imageUrls;
    }

    // Save everything in DB
    const response = await axios.post(`${BASE_URL}/listening/${testId}/${partName}`, {
      questions,
      audioUrl,
      imageUrls: JSON.stringify(imageUrls),
    });

    return response.data;
  } catch (error) {
    console.error("Error saving listening test data:", error);
    throw error.response?.data?.message || "Error saving data.";
  }
};

export const fetchListeningTests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tests/listening/tests");
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
      const response = await fetch("http://localhost:5000/api/tests/listening/create", {
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
  
