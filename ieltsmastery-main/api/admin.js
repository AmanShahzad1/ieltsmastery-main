export const loginAdmin = async (username, password) => {
    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed.");
      }
  
      return await response.json(); // Return the token and other data
    } catch (err) {
      console.error("Admin login error:", err);
      throw err; // Re-throw the error to handle it in the calling component
    }
  };
  