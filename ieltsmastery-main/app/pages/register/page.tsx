"use client";
import { useState } from "react";
import { MdFacebook } from "react-icons/md";
import { FaApple, FaGoogle } from "react-icons/fa";
import Link from "next/link";

export default function RegisterPage() {
  // State to manage form data and messages
  const [formData, setFormData] = useState({
    username: "",
    email_or_phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Function to handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setSuccess("");
      return;
    }

    try {
      // Call the register API
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.username,
          email_or_phone: formData.email_or_phone,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setSuccess("Registration successful!");
        setError("");
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed.");
        setSuccess("");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      setSuccess("");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="min-h-screen w-full bg-blue-50 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <img src="/Logo.png" alt="IELTS Mastery Logo" className="mx-auto w-20" />
          <h1 className="text-2xl font-bold text-blue-900">Create An Account</h1>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              name="email_or_phone"
              value={formData.email_or_phone}
              onChange={handleChange}
              placeholder="Email / Phone number"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm Password"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="submit"
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90"
            >
              Register →
            </button>
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
            <p className="mt-4 text-sm text-gray-700">
              Already have an account?{" "}
              <Link href="./login" className="text-blue-600 font-semibold">
                Login Here
              </Link>
            </p>
          </div>

          {/* Divider */}
          <div className="flex flex-col justify-center items-center text-gray-500">
            <span className="text-sm">Or</span>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex flex-col justify-center gap-4">
            <button className="flex items-center justify-center border border-blue-500 text-blue-500 px-4 py-3 rounded-lg hover:bg-blue-50">
              <FaGoogle size={24} color="blue" />
              <span className="ml-2">Log In with Google</span>
            </button>
            <button className="flex items-center justify-center border border-blue-700 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-50">
              <MdFacebook size={24} color="blue" />
              <span className="ml-2">Log In with Facebook</span>
            </button>
            <button className="flex items-center justify-center border border-black text-black px-4 py-3 rounded-lg hover:bg-gray-100">
              <FaApple size={24} color="black" />
              <span className="ml-2">Log In with Apple Account</span>
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <span>Copyright @aaaa 2024</span>
        </div>
      </div>
    </div>
  );
}
