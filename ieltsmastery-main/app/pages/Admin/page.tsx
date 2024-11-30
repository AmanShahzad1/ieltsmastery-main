import Image from 'next/image';
import { FaRegUserCircle } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-[#03036D] text-white p-6 shadow-lg">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-sm">Welcome, Admin! Manage the IELTS Mastery modules below.</p>
      </header>

      {/* Main Content */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Users Management */}
        <div className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300">
          <div
            className="mx-auto flex items-center justify-center"
            style={{ width: 100, height: 100, backgroundColor: '#03036D', borderRadius: '50%' }}
          >
            <FaRegUserCircle style={{ color: 'white', width: 60, height: 60 }} />
          </div>
          <h2 className="text-xl font-bold text-center mt-3 text-gray-800">Users Management</h2>
          <p className="text-gray-600 text-center">
            View and manage registered users efficiently.
          </p>
        </div>

        {/* Manage Reading Test */}
        <div className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300">
          <Image
            src="/icons/reading.png"
            alt="Manage Reading Test"
            width={80}
            height={80}
            className="mx-auto object-contain"
          />
          <h2 className="text-xl font-bold text-center mt-3 text-gray-800">Manage Reading Test</h2>
          <p className="text-gray-600 text-center">
            Create and update IELTS reading test materials.
          </p>
        </div>

        {/* Manage Speaking Test */}
        <div className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300">
          <Image
            src="/icons/speaking.png"
            alt="Manage Speaking Test"
            width={80}
            height={80}
            className="mx-auto object-contain"
          />
          <h2 className="text-xl font-bold text-center mt-3 text-gray-800">Manage Speaking Test</h2>
          <p className="text-gray-600 text-center">
            Add and edit speaking prompts for IELTS tests.
          </p>
        </div>

        {/* Manage Listening Test */}
        <div className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300">
          <Image
            src="/icons/listening.png"
            alt="Manage Listening Test"
            width={80}
            height={80}
            className="mx-auto object-contain"
          />
          <h2 className="text-xl font-bold text-center mt-3 text-gray-800">Manage Listening Test</h2>
          <p className="text-gray-600 text-center">
            Upload and manage audio-based IELTS tasks.
          </p>
        </div>

        {/* Manage Writing Test */}
        <div className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300">
          <Image
            src="/icons/writing.png"
            alt="Manage Writing Test"
            width={80}
            height={80}
            className="mx-auto object-contain"
          />
          <h2 className="text-xl font-bold text-center mt-3 text-gray-800">Manage Writing Test</h2>
          <p className="text-gray-600 text-center">
            Oversee and update writing topics and samples.
          </p>
        </div>
      </div>
    </div>
  );
}
