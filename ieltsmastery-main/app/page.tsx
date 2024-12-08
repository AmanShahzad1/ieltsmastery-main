"use client";

import { useState } from "react";
import './styles/global.css';
import Head from "next/head";
import Link from "next/link";


export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div>
      <Head>
        <title>IELTS Mastery Solutions</title>
        <meta name="description" content="Achieve IELTS success with tailored solutions and resources." />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <style jsx global>{`
        html {
          font-family: 'Inria Serif', serif;
        }
      `}</style>

      {/* Header */}
      <header className="bg-gray-50 shadow">
        <div className="container mx-auto flex items-center justify-between p-5">
          <div className="flex items-center">
            <img src="/logo.png" alt="IELTS Mastery Solutions Logo" className="w-16 sm:w-20" />
            <h1 className="ml-3 text-lg sm:text-xl font-bold" style={{ color: "#03036D" }}>IELTS Mastery</h1>
          </div>
          <div className="flex items-center space-x-4">
            <nav className="hidden lg:flex space-x-6">
              <a href="#features" className="text-gray-700 hover:text-[#03036D]">Features</a>
              <a href="#about" className="text-gray-700 hover:text-[#03036D]">About Us</a>
              
            </nav>
            <Link
              href="/pages/login"
              className="hidden lg:inline-block bg-[#03036D] text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 focus:outline-none"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-gray-50 shadow-lg">
            <nav className="flex flex-col space-y-2 p-4">
              <a href="#features" className="text-gray-700 hover:text-[#03036D]" onClick={() => setIsMenuOpen(false)}>Features</a>
              <a href="#about" className="text-gray-700 hover:text-[#03036D]" onClick={() => setIsMenuOpen(false)}>About Us</a>
              <a href="#testimonials" className="text-gray-700 hover:text-[#03036D]" onClick={() => setIsMenuOpen(false)}>Testimonials</a>
              <a href="#contact" className="text-gray-700 hover:text-[#03036D]" onClick={() => setIsMenuOpen(false)}>Contact</a>
              <Link
                href="/pages/login"
                className="bg-[#03036D] text-white px-4 py-2 rounded text-center hover:bg-blue-700"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-[#e8f1ff] text-center py-10 sm:py-20">
        <div className="container mx-auto px-5">
          <h1 className="text-2xl sm:text-4xl font-bold" style={{ color: "#03036D" }}>Master Your IELTS Journey</h1>
          <p className="mt-4 text-sm sm:text-lg text-gray-600">
            Your path to IELTS success starts here. Access personalized tests, track your progress, and achieve your dream scores.
          </p>
          <Link
            href="/pages/login"
            className="mt-6 inline-block bg-[#03036D] text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            Start Now
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-10 sm:py-20">
        <div className="container mx-auto px-5">
          <h2 className="text-xl sm:text-3xl font-bold text-center" style={{ color: "#03036D" }}>Features</h2>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#03036D" }}>Personalized Tests</h3>
              <p className="mt-4 text-sm sm:text-base text-gray-600">Tailored practice tests for Listening, Reading, Writing, and Speaking.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#03036D" }}>Detailed Analytics</h3>
              <p className="mt-4 text-sm sm:text-base text-gray-600">Track your progress and improve your weak areas.</p>
            </div>
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <h3 className="text-lg sm:text-xl font-bold" style={{ color: "#03036D" }}>Expert Resources</h3>
              <p className="mt-4 text-sm sm:text-base text-gray-600">Access high-quality study material designed by professionals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="bg-gray-100 py-10 sm:py-20">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-xl sm:text-3xl font-bold" style={{ color: "#03036D" }}>About Us</h2>
          <p className="mt-6 text-sm sm:text-base text-gray-600">
            At IELTS Mastery Solutions, we believe in providing the best tools and resources to help students excel in their IELTS tests. Our platform is user-friendly, with data-driven insights and real-time performance tracking.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p className="text-sm">&copy; 2024 IELTS Mastery Solutions. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
