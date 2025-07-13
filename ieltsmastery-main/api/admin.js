const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:5000/api' ;
export const loginAdmin = async (username, password) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/login`, {
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
//..................
//get all users
export const getAllUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/all_users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users.");
      }
  
      return await response.json(); // Returns { users: [...] }
    } catch (err) {
      console.error("Error fetching users:", err);
      throw err;
    }
  };
//....................
//delete user by id
  
  
export const deleteUserById = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/admin/delete_user/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user.");
      }
  
      return await response.json(); // Returns { message: "...", user: {...} }
    } catch (err) {
      console.error(`Error deleting user with id ${id}:`, err);
      throw err;
    }
  };
  