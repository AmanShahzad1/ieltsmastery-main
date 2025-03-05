"use client";
import Link from "next/link";
import { registerUserProfile } from "@/api/auth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


 export default function RegisterPage() {

  const [userId, setUserId] = useState<number>();
   useEffect(() => {
       //debugger
       if (typeof window !== "undefined") {
         const token = localStorage.getItem("token");
         if (token) {
           try {
             const decoded = jwtDecode<{ userId: number }>(token);
             setUserId(decoded.userId || 16);
           } catch (error) {
             console.error("Error decoding token:", error);
           }
         }
       }
     }, []);


  const [formData, setFormData] = useState({
   // user_id: {userId},
    firstName: "",
    lastName: "",
    profilePic: null as File | null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, profilePic: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError("First Name and Last Name are required.");
      return;
    }

    try {
     // debugger
      await  registerUserProfile({
        user_id: userId,  // Assuming user_id is obtained from the main users table
        first_name: formData.firstName,
        last_name: formData.lastName,
        profile_pic: formData.profilePic, // Should be a valid image path
      });
    
      setSuccess("Profile creation successful!");
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
    <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center justify-center">
      {/* Logo and Heading - Outside White Box */}
      <div className="text-center mb-6">
        <img src="/Logo.png" alt="IELTS Mastery Logo" className="mx-auto w-20" />
        <h1 className="text-2xl font-bold text-blue-900">Create Your Profile</h1>
      </div>

      {/* White Box (Card) starts below the heading */}
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            className="w-full px-4 py-3 border rounded-lg"
            required
          />
          <input
            type="file"
            name="profilePic"
            onChange={handleFileChange}
            className="w-full px-4 py-3 border rounded-lg"
            accept="image/*"
          />
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create →"}
          </button>
          {error && <p className="text-red-600">{error}</p>}
          {success && <p className="text-green-600">{success}</p>}
          <p>
            Already have a profile <Link href="./dashboard" className="text-blue-600">GO TO Dashboard</Link>
          </p>
        </form>

        {/* Footer inside the white box */}
        <div className="mt-8 flex justify-between text-sm text-gray-600">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <span>Copyright @IELTS Mastery 2024</span>
        </div>
      </div>
    </div>
  );
}
