"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSpeakingTest, fetchSpeakingTests } from "../../../../../api/speaking";
import Link from "next/link";
import Image from "next/image";

interface Test {
  id: number;
  name: string;
}

export default function SpeakingTestMainView() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadTests = async () => {
      try {
        const fetchedTests = await fetchSpeakingTests();
        setTests(fetchedTests);
      } catch (error) {
        console.error("Error loading tests:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTests();
  }, []);

  const handleCreateTest = async () => {
    try {
      const newTest = await createSpeakingTest(`Speaking ${tests.length + 1}`);
      if (newTest?.id) {
        setTests(prev => [...prev, newTest]);
        router.push(`/admin/tests/speaking/${newTest.id}`);
      }
    } catch (error) {
      console.error("Error creating test:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl">Loading tests...</div>
      </div>
    );
  }

  
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        <div className="flex items-center mr-6 sm:mr-4">
          <Image
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            width={112}
            height={112}
            className="h-28 w-28"
            priority
          />
        </div>
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">
          Speaking Tests
        </h1>
      </header>

      <div className="bg-white shadow-md rounded-md p-6">
        <h2 className="text-lg font-bold mb-6">All Speaking Tests</h2>

        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex justify-between items-center p-4 border border-gray-300 rounded-md bg-gray-50"
            >
              <span className="text-lg">{test.name}</span>
              <Link
                href={`/admin/tests/speaking/${test.id}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                View Test
              </Link>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 gap-4">
          <button
            onClick={handleCreateTest}
            className="px-6 py-3 bg-[#03036D] text-white text-lg font-bold rounded-md hover:bg-[#020258]"
          >
            Create Test
          </button>
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