import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Backend base URL

export const fetchTests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/tests");
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
export const createTest = async (testName) => {
    try {
      const response = await fetch("http://localhost:5000/api/tests/create", {
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
  



// Fetch test part data (questions and reading material)
export const fetchPartData = async (testId, partName) => {
  try {
    const response = await axios.get(`${BASE_URL}/tests/${testId}/${partName}`);
    console.log("Response", response);
    return response.data; // Return the data from the response
  } catch (error) {
    // Check for known error structures, fallback to a generic error message
    if (error.response && error.response.data) {
      throw error.response.data.message || "Error fetching test part data.";
    } else {
      throw "An error occurred while fetching data. Please try again.";
    }
  }
};

// Save test part data (questions and reading material)
export const savePartData = async (testId, partName, questions, readingMaterial) => {
  try {
 
    const response = await axios.post(`${BASE_URL}/tests/${testId}/${partName}`, {
      testId,
      partName,
      questions,
      readingMaterial,
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


// plan generation work
export const fetchTestType = async (testId) => {

  try {
    console.log("Frontend Received", testId);
    const response = await axios.get(`${BASE_URL}/tests/type/${testId}`);
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

export const saveTestType = async (testId, type, difficulty) => {
  try {
 
    const response = await axios.post(`${BASE_URL}/tests/type/${testId}`, {
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



//writing work


// Fetch test data for a specific testId
// export const fetchTestData = async (testId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/tests/reading/${testId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch test data");
//       }
//       return await response.json(); // Return the test data (or null if not found)
//     } catch (error) {
//       console.error("Error fetching test data:", error);
//       throw error; // Re-throw the error to handle it in the calling component
//     }
//   };

// // Save test data
// export const saveTestData = async (testId, testData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/tests/reading/${testId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(testData), // The data to be saved
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to save test data");
//       }
  
//       return await response.json(); // Return the saved test data
//     } catch (error) {
//       console.error("Error saving test data:", error);
//       throw error; // Re-throw the error to handle it in the calling component
//     }
//   };
  
  
// // Update test data
// export const updateTestData = async (testId, testData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/tests/reading/${testId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(testData), // The data to be updated
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to update test data");
//       }
  
//       return await response.json(); // Return the updated test data
//     } catch (error) {
//       console.error("Error updating test data:", error);
//       throw error; // Re-throw the error to handle it in the calling component
//     }
//   };  

//   export const fetchParts = async (testId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/parts/${testId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch parts data");
//       }
//       return await response.json(); // Return the parts (or empty array if not found)
//     } catch (error) {
//       console.error("Error fetching parts:", error);
//       throw error;
//     }
//   };

  
//   export const fetchQuestions = async (testId, partId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/questions/${testId}/${partId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch questions");
//       }
//       return await response.json(); // Return the questions (or empty array if not found)
//     } catch (error) {
//       console.error("Error fetching questions:", error);
//       throw error;
//     }
//   };

  
//   export const fetchReadingMaterial = async (testId, partId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/reading-materials/${testId}/${partId}`);
//       if (!response.ok) {
//         throw new Error("Failed to fetch reading material");
//       }
//       return await response.json(); // Return the reading material (or null if not found)
//     } catch (error) {
//       console.error("Error fetching reading material:", error);
//       throw error;
//     }
//   };

  
//   export const savePart = async (testId, partData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/parts/${testId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(partData), // The part data to be saved
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to save part");
//       }
  
//       return await response.json(); // Return the saved part
//     } catch (error) {
//       console.error("Error saving part:", error);
//       throw error;
//     }
//   };

  
//   export const saveQuestion = async (testId, partId, questionData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/questions/${testId}/${partId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(questionData), // The question data to be saved
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to save question");
//       }
  
//       return await response.json(); // Return the saved question
//     } catch (error) {
//       console.error("Error saving question:", error);
//       throw error;
//     }
//   };

  
//   export const saveReadingMaterial = async (testId, partId, materialData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/reading-materials/${testId}/${partId}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(materialData), // The reading material to be saved
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to save reading material");
//       }
  
//       return await response.json(); // Return the saved reading material
//     } catch (error) {
//       console.error("Error saving reading material:", error);
//       throw error;
//     }
//   };

  
//   export const updatePart = async (testId, partId, partData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/parts/${testId}/${partId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(partData), // The part data to be updated
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to update part");
//       }
  
//       return await response.json(); // Return the updated part
//     } catch (error) {
//       console.error("Error updating part:", error);
//       throw error;
//     }
//   };

  
//   export const updateQuestion = async (testId, partId, questionId, questionData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/questions/${testId}/${partId}/${questionId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(questionData), // The question data to be updated
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to update question");
//       }
  
//       return await response.json(); // Return the updated question
//     } catch (error) {
//       console.error("Error updating question:", error);
//       throw error;
//     }
//   };

  
//   export const updateReadingMaterial = async (testId, partId, materialData) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/reading-materials/${testId}/${partId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(materialData), // The reading material data to be updated
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to update reading material");
//       }
  
//       return await response.json(); // Return the updated reading material
//     } catch (error) {
//       console.error("Error updating reading material:", error);
//       throw error;
//     }
//   };
