"use client";
import Image from "next/image";
import Link from "next/link";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/auth";
/* import { useRouter } from "next/navigation"; // Use the App Router's navigation
  const router = useRouter(); */

export default function ProfilePage() {
  
  const [userId, setUserId] = useState<number>();
  // const [loading, setLoading] = useState(true);

  // Default user state
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    profilePic: "/profile.jpg", // Replace with actual image URL
  });

  // Extract user ID from token
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

  // Fetch user profile and update state
  useEffect(() => {
    
    const loadPartData = async (userId: number) => {
      try {
       
        const data = await getUserProfile(userId); // Fetch user profile data
        if (data) {
          setUser({
            firstName: data.first_name || "John",
            lastName: data.last_name || "Doe",
            email: data.email_or_phone || "johndoe@example.com",
            profilePic: data.profile_pic && data.profile_pic.trimStart() !== "" ? data.profile_pic.trimStart() : "/profile.jpg",
          });
        }
      } catch (error) {
        console.error("Error fetching user profile data:", error);
      } 
    };

    if (userId && userId !== 0) {
      loadPartData(userId);
    }
  }, [userId]);



/*
  // Dummy user data (replace with actual user data from backend)
  const [user, setUser] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@example.com",
    profilePic: "/profile.jpg", // Replace with actual image URL
  }); */

  return (
    <div className="min-h-screen w-full bg-blue-50 flex flex-col items-center justify-center">
      {/* Logo and Heading */}
      <div className="text-center mb-6">
        <img src="/Logo.png" alt="IELTS Mastery Logo" className="mx-auto w-20" />
        <h1 className="text-2xl font-bold text-blue-900">Your Profile</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full flex flex-col items-center">
        <Image
          src={user.profilePic}
          alt="Profile Picture"
          width={120}
          height={120}
          className="rounded-full border-2 border-gray-300 mb-4"
        />
        <h2 className="text-xl font-semibold text-gray-800">{user.firstName} {user.lastName}</h2>
        <p className="text-gray-600 mb-4">{user.email}</p>

        <Link href="/pages/dashboard">
          <button className="px-6 py-2 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg">
            Dashbord
          </button>
        </Link>

        {/* Footer inside the white box */}
        <div className="mt-8 flex justify-between text-sm text-gray-600 w-full">
          <span>Copyright @IELTS Mastery 2025</span>
        </div>
      </div>
    </div>
  );
}
