import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Backend base URL


export const registerUserProfile = async (profileData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/user-profile`, profileData);
    return response.data; // Return the server response
  } catch (error) {
    // Handle known error responses
    if (error.response && error.response.data) {
      throw error.response.data.message || "An error occurred while creating the profile.";
    } else {
      throw "An error occurred. Please try again.";
    }
  }
};

//get user profile
export const getUserProfile = async (userId) => {
 // debugger
  try {
    const response = await axios.get(`${BASE_URL}/auth/get-profile/${userId}`);
    return response.data; // Return the server response
  } catch (error) {
    // Handle known error responses
    if (error.response && error.response.data) {
      throw error.response.data.message || "An error occurred while fetching the profile.";
    } else {
      throw "An error occurred. Please try again.";
    }
  }
};



export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data; // Return the server response
  } catch (error) {
    // Check for known error structures, fallback to a generic error message
    if (error.response && error.response.data) {
      throw error.response.data.message || "An error occurred during registration.";
    } else {
      throw "An error occurred. Please try again.";
    }
  }
};


// Admin Login
// Admin Login
export const loginAdmin = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/admin/login`, { username, password });
    return response.data; // Return the server response (e.g., token and message)
  } catch (error) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message); // Use the backend-provided error message
    } else {
      throw new Error("An unknown error occurred. Please try again.");
    }
  }
};