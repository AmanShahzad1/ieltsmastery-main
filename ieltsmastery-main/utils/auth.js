export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    return !!token; // Return true if the token exists
  };