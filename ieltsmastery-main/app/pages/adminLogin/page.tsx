"use client";
import { useState } from "react";
import Link from "next/link";
import { loginAdmin } from "@/api/auth"; // Import the admin login API function

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const data = await loginAdmin(formData.username, formData.password);
      setSuccess(data.message); // Use the backend-provided success message
      setError("");
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/pages/Admin"; // Redirect to the admin dashboard
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message); // Use the backend-provided error message
      } else {
        setError("An unknown error occurred.");
      }
      setSuccess("");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full">
        <div className="text-center mb-6">
          <img src="/Logo.png" alt="Admin Logo" className="mx-auto w-20" />
          <h1 className="text-2xl font-bold text-blue-900">Admin Login</h1>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90"
          >
            Login as Admin →
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-600">{success}</p>}
        <p className="mt-4 text-sm text-gray-700">
          Return to{" "}
          <Link href="/" className="text-blue-600 font-semibold">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
