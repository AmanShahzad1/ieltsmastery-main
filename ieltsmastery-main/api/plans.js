// api/plans.js
import axios from 'axios';

const BASE_URL = "http://localhost:5000/api";

export const updatePlanWithTest = async (testId, difficulty, testType) => {
  try {
    const response = await axios.post(`${BASE_URL}/plans/update-test`, {
      testId,
      difficulty: difficulty.toLowerCase(), // Ensure case matches your DB
      testType: testType.toLowerCase()
    });
    return response.data;
  } catch (error) {
    console.error("Error updating plan:", error);
    throw error;
  }
};


export const assignPlanToUser = async (userId, recommendedLevel) => {
  try {
    const response = await axios.post(`${BASE_URL}/plans/assign`, {
      userId,
      level: recommendedLevel.toLowerCase()
    });
    return response.data;
  } catch (error) {
    console.error("Error assigning plan:", error);
    throw error;
  }
};

export const getUserPlan = async (userId) => {
  try {
    const response = await axios.get(`${BASE_URL}/plans/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user plan:", error);
    throw error;
  }
};