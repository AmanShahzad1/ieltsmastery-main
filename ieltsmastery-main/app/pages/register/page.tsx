"use client";
import { useState } from "react";
import { MdFacebook } from "react-icons/md";
import { FaApple, FaGoogle } from "react-icons/fa";
import Link from "next/link";
import { registerUser } from "@/api/auth"; // Import the registerUser function

type FormData = {
  username: string;
  email_or_phone: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email_or_phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear errors on input change
    setSuccess(""); // Clear success message
  };

  const isValidEmail = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };
  
  const isValidPhone = (value: string): boolean => {
    const phoneRegex = /^0?[1-9]\d{9,14}$/; // Ensures 10–15 digits, optional leading `0`
    return phoneRegex.test(value);
  };
  
  const isValidPassword = (value: string): boolean => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    return passwordRegex.test(value);
  };
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
  
    // Username validation
    if (!formData.username || formData.username.length < 3) {
      setError("Username must be at least 3 characters long.");
      document.querySelector<HTMLInputElement>('input[name="username"]')?.focus();
      return;
    }
  
    // Email or phone validation
    if (!formData.email_or_phone) {
      setError("Please enter an email or phone number.");
      document.querySelector<HTMLInputElement>('input[name="email_or_phone"]')?.focus();
      return;
    }
  
    const input = formData.email_or_phone;
    const isEmailValid = isValidEmail(input);
    const isPhoneValid = isValidPhone(input);
  
    if (!isEmailValid && !isPhoneValid) {
      setError("Please enter a valid email address or phone number.");
      document.querySelector<HTMLInputElement>('input[name="email_or_phone"]')?.focus();
      return;
    }
  
    // Password validation
    if (!isValidPassword(formData.password)) {
      setError(
        "Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      document.querySelector<HTMLInputElement>('input[name="password"]')?.focus();
      return;
    }
  
    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      document.querySelector<HTMLInputElement>('input[name="confirmPassword"]')?.focus();
      return;
    }
  
    // If all validations pass
    setIsSubmitting(true);
    setError("");
    setSuccess("");
  
    try {
      await registerUser({
        username: formData.username,
        email_or_phone: formData.email_or_phone,
        password: formData.password,
      });
      setSuccess("Registration successful!");
    } catch (err: unknown) {
      if (typeof err === "string") {
        setError(err);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false);
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
              className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register →"}
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
           
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          
          <span>Copyright @IELTS Mastery 2024</span>
        </div>
      </div>
    </div>
  );
}
