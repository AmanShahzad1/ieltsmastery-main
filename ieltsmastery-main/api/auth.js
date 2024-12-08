import axios from "axios";

const BASE_URL = "http://localhost:5000/api"; // Backend base URL

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