import { MdFacebook } from "react-icons/md";
import { FaApple } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import Image from "next/image";
export default function LoginPage() {
  return (
    <div className="min-h-screen w-full  flex items-center justify-center bg-blue-50">
      <div className="bg-white shadow-lg rounded-lg p-10 max-w-4xl w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
            
          <img
            src='/Logo.png'
            alt="IELTS Mastery Logo"
            className="mx-auto w-20"
          />
          <h1 className="text-2xl font-bold text-blue-900">Login to Your Account</h1>
        </div>

        {/* Content Section */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Email / Phone number"
              className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute right-4 top-1/2 transform -translate-y-1/2 cursor-pointer">
                👁️
              </span>
            </div>
            <button className="w-full mt-4 py-3 bg-gradient-to-r from-purple-500 to-yellow-500 text-white font-semibold rounded-lg shadow-lg hover:opacity-90">
              Login to Your Account →
            </button>
            <p className="mt-4 text-sm text-gray-700">
              Don’t have an account yet?{" "}
              <a href="#" className="text-blue-600 font-semibold">
                Register now!
              </a>
            </p>
          </div>

          {/* Divider */}
          <div className="flex flex-col justify-center items-center text-gray-500">
            <span className="text-sm">Or</span>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex flex-col gap-3">
            <button className="flex items-center justify-center border border-blue-500 text-blue-500 px-4 py-3 rounded-lg hover:bg-blue-50">
              <FaGoogle size={24} color="blue"/>
              <span className="ml-2">Log in with Google</span>
            </button>
            <button className="flex items-center justify-center border border-blue-700 text-blue-700 px-4 py-3 rounded-lg hover:bg-blue-50">
              <MdFacebook size={24} color="blue"/>
              <span className="ml-2">Log in with Facebook</span>
            </button>
            <button className="flex items-center justify-center border border-black text-black px-4 py-3 rounded-lg hover:bg-gray-100">
              <FaApple size={24} color="black"/>
              <span className="ml-2">Log in with Apple Account</span>
            </button>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between text-sm text-gray-600">
          <a href="#" className="hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="hover:underline">
            Forgot Password?
          </a>
          <span>Copyright @aaaa 2023</span>
        </div>
      </div>
    </div>
  );
}
