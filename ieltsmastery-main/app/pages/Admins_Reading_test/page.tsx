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

      {/* Main Content */}
      <div className="flex flex-col sm:flex-row justify-center">
        {/* Left Section: Select Part Buttons */}
        <div className="w-full sm:w-1/2 flex flex-col space-y-6 pr-8">
          {/* Select Part Buttons */}
          <div className="bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-bold mb-4">Select Part</h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
              {['Part 1', 'Part 2', 'Part 3', 'Part 4'].map((part, index) => (
                <button
                  key={index}
                  className="p-4 rounded-md border text-center border-gray-300 hover:bg-blue-100"
                >
                  <span className="font-semibold">{part}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Questions Section (Moved below Select Part) */}
          <div className="bg-white shadow-md rounded-md p-6">
            <h3 className="text-lg font-bold mb-4">Questions (1 to 5)</h3>
            <div className="space-y-6">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <p className="text-sm font-medium mb-2">{index + 1}): What is the name of Alex's School?</p>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-2 w-full"
                    placeholder="Your answer..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Expanded Reading Material */}
        <div className="w-full sm:w-1/2 space-y-6">
          {/* Expanded Reading Material */}
          <div className="bg-white shadow-md rounded-md p-6 h-full">
            <h3 className="text-lg font-bold mb-4">Reading Material</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry...
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum has been the industry's standard dummy text ever since the 1500s...
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              It has survived not only five centuries, but also the leap into electronic typesetting...
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages...
            </p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
