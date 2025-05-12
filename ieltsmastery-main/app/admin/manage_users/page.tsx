"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getAllUsers, deleteUserById } from "@/api/admin";
import Image from "next/image";

// Define the structure of a user object
interface User {
  id: number;
  username: string;
  email_or_phone: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch the list of users from the backend
  const fetchUsers = async () => {
    try {
      const data = await getAllUsers();
      if (data && data.users) {
        setUsers(data.users);
      } else {
        console.error("Invalid users data", data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Fetch users when the component mounts
  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle deleting a user
  const handleDeleteUser = async (id: number) => {
    try {
      await deleteUserById(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error(`Error deleting user with id ${id}:`, error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      {/* Header */}
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center mr-6 sm:mr-4">
          <Image
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            width={112}
            height={112}
            className="h-28 w-28"
          />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">
          Manage Users
        </h1>
      </header>

      {/* Main Content */}
      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-bold mb-6">All Users</h2>

        {/* List of Users */}
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50"
            >
              <div>
                <p className="text-lg font-semibold">User Name:</p>
                <p className="mb-2">{user.username}</p>
                <p className="text-lg font-semibold">Email:</p>
                <p>{user.email_or_phone}</p>
              </div>
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="flex justify-center mt-8">
          <Link
            href="/admin/home"
            className="px-6 py-3 bg-gray-500 text-white text-lg font-bold rounded-md hover:bg-gray-600"
          >
            Go Back
          </Link>
        </div>
      </div>
    </div>
  );
}
