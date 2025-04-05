import axios from "axios";
const BASE_URL = "http://localhost:5000/api/tests";
//create a speaking test
export const createSpeakingTest = async (testName) => {
    try {
        //debugger;
      const response = await fetch("http://localhost:5000/api/tests/speaking/create", {
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
  //fetch all speaking tests
  export const fetchSpeakingTests = async () => {
    //debugger;
    try {
      const response = await fetch("http://localhost:5000/api/tests/speaking/tests",
        {method: "GET",});
      
      if (!response.ok) {
        throw new Error("Failed to fetch tests");
      }
      return await response.json(); // Return the list of tests
    } catch (err) {
      console.error("Error fetching tests:", err);
      throw err; // Re-throw the error to handle it in the calling component
    }
  };


  //fetch a single speaking data
   // Update this with your actual API URL

export const fetchSpeakingData = async (testId, partName) => {
  try {
    console.log("Fetching speaking test data:", testId);
    const response = await axios.get(`${BASE_URL}/speaking/${testId}/${partName}`);
    console.log("Speaking test data fetched successfully:", response.data);
    return response.data || { questions: [] }; // Return an empty list if no questions exist
  } catch (error) {
    console.error("Error fetching speaking test data:", error);
    throw error.response?.data?.message || "Error fetching data.";
  }
};
export const saveSpeakingData = async (testId, partName, questions) => {
  try {
    console.log("Saving speaking test data:", testId, partName, questions);
    const response = await axios.post(`${BASE_URL}/speaking/${testId}/${partName}`, {
      questions 
    });
    console.log("Speaking test data saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving speaking test data:", error);
    throw error.response?.data?.message || "Error saving data.";
  }
};

/* export const saveSpeakingData = async (testId, questions) => {
  try {
    console.log("Saving speaking test data:", testId, questions);

    // Save questions in DB (JSONB format)
    const response = await axios.post(`${BASE_URL}/speaking/${testId}`, {
      questions: JSON.stringify(questions), // Convert to JSON string
    });

    console.log("Speaking test data saved successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error saving speaking test data:", error);
    throw error.response?.data?.message || "Error saving data.";
  }
}; */