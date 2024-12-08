"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../utils/auth";

const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/pages/login"); // Redirect to login if not authenticated
    } else {
      setLoading(false); // Authentication successful, stop loading
    }
  }, [router]);

  if (loading) {
    return <p>Loading...</p>; // Optional loading message or spinner
  }

  return children;
};

export default ProtectedRoute;