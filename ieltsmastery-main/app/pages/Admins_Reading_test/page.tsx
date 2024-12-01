import Image from "next/image";

export default function AdminReadingPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8 font-serif">
      {/* Header */}
      <header className="flex items-center mb-6 flex-col sm:flex-row sm:justify-between">
        {/* Logo */}
        <div className="flex items-center mr-6 sm:mr-4">
          <img
            src="/logo.png"
            alt="IELTS Mastery Solutions Logo"
            className="h-28 w-28"
          />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold sm:ml-4 mt-4 sm:mt-0 text-center w-full">
          Admin Reading Page
        </h1>
      </header>

      {/* Select Part Section */}
      <div className="bg-white shadow-md rounded-md p-4 mb-6">
        <h3 className="text-lg font-bold mb-4 text-center">Select Part</h3>
        <div className="flex justify-center space-x-4">
          {["Part 1", "Part 2", "Part 3", "Part 4"].map((part, index) => (
            <button
              key={index}
              className="px-6 py-2 rounded-md border border-gray-300 text-center hover:bg-blue-100"
            >
              {part}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row justify-center">
        {/* Left Section: Questions Input */}
        <div className="w-full sm:w-1/2 flex flex-col space-y-6 pr-8">
          {/* Questions Section */}
          <div className="bg-white shadow-md rounded-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Questions (1 to 10)</h3>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Upload Content
              </button>
            </div>
            <div className="space-y-6">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder={`Question ${index + 1}`}
                  />
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder={`Answer ${index + 1}`}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Reading Material Input */}
        <div className="w-full sm:w-1/2 space-y-6">
          {/* Expanded Reading Material Input */}
          <div className="bg-white shadow-md rounded-md p-6 h-full flex flex-col space-y-4">
            <h3 className="text-lg font-bold">Reading Material</h3>
            <textarea
              className="border border-gray-300 rounded-md p-4 w-full h-60 resize-none"
              placeholder="Enter the reading material here..."
            ></textarea>
            <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
              Input Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
