import axios from 'axios';

export const updateUserPerformance = async (userId, testId, testType) => {
  try {
    console.log("Saving Performance");
    const response = await axios.post('http://localhost:5000/api/performance/update-performance', {
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