import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "../../../utils/auth";

interface ProtectedRouteProps {
  children: ReactNode; // Specify the type of children
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
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

  return <>{children}</>;
};

export default ProtectedRoute;
