export const isAuthenticated = () => {
    const token = localStorage.getItem("adminToken");
    return !!token; // Return true if the token exists
  };