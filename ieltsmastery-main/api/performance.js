import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api' ;

export const updateUserPerformance = async (userId, testId, testType) => {
  try {
    console.log("Saving Performance");
    const response = await axios.post(`${BASE_URL}/performance/update-performance`, {
      userId,
      testId,
      testType
    });
    return response.data;
  } catch (error) {
    console.error('Error updating performance:', error);
    throw error;
  }
};