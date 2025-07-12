"use client";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
// import { useRouter } from 'next/navigation';




export default function LoginPage() {
  const [formData, setFormData] = useState({
    email_or_phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
   const [showPassword, setShowPassword] = useState(false);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleGoogleLogin =()=>{
    window.location.href = 'http://localhost:5000/auth/google';
  }

  

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_or_phone: formData.email_or_phone,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        setSuccess("Login successful!");
        setError("");
        // You would ideally store the JWT token in localStorage or cookies
        localStorage.setItem("token", data.token);
        window.location.href = "/pages/profile_creation"; // Redirect to the dashboard page
      } else {
        const data = await response.json();
        setError(data.message || "Login failed.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess("");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <img
            src="/Logo.png"
            alt="IELTS Mastery Logo"
            className="mx-auto w-20"
          />
          <h1 className="text-2xl font-bold text-blue-900">Login to Your Account</h1>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="email_or_phone"
                value={formData.email_or_phone}
                onChange={handleChange}
                placeholder="Email / Phone number"
                className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <FaEyeSlash size={20} />
                  ) : (
                    <FaEye size={20} />
                  )}
                </button>
              </div>
              <button
                type="submit"
                className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90"
              >
                Login to Your Account →
              </button>
            </form>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
            <p className="mt-4 text-sm text-gray-700">
              Don’t have an account yet?{" "}
              <Link href="./register" className="text-blue-600 font-semibold">
                Register now!
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="flex flex-col justify-center items-center text-gray-500">
            <span className="text-sm">Or</span>
          </div>

          {/* Right Section */}
                    
          

            
          
          <div className="flex-1 flex justify-center flex-col gap-4">
            
            <button
             className="flex items-center justify-center border border-blue-500 text-blue-500 px-4 py-3 rounded-lg hover:bg-blue-50"
              onClick={handleGoogleLogin}>
              <FaGoogle size={24} color="blue" />
              <span className="ml-2">Log in with Google</span>
            </button>
            
        
            
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-sm text-gray-600">
        
          
          <span>Copyright IELTS Mastery 2025</span>
        </div>
      </div>
    </div>
  );
}