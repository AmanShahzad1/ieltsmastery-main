
"use client";

import { useState } from "react";
import './styles/global.css';
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("writing"); // For AI features demo

  return (
    <div>
      <Head>
        <title>IELTS Mastery Solutions</title>
        <meta name="description" content="Achieve IELTS success with AI-powered personalized solutions." />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inria+Serif:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Header remains the same */}
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

      {/* Enhanced Hero Section */}
      <section className="bg-gradient-to-r from-blue-900 to-blue-700 text-white py-16 sm:py-24">
        <div className="container mx-auto px-5 text-center">
          <h1 className="text-3xl sm:text-5xl font-bold mb-6">
            AI-Powered IELTS Mastery
          </h1>
          <p className="text-xl sm:text-2xl mb-8 max-w-3xl mx-auto">
            The only platform with real-time AI evaluation for writing & speaking
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/pages/login"
              className="bg-white text-blue-800 px-8 py-3 rounded-lg font-bold hover:bg-blue-100 transition"
            >
              Start Your Journey!
            </Link>
            {/* <button className="border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-white hover:text-blue-800 transition">
              See AI in Action
            </button> */}
          </div>
        </div>
      </section>

      {/* Unique Value Proposition Section */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-4xl font-bold text-blue-900 mb-4">
              Why IELTS Mastery Stands Out
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Unlike other platforms, we provide truly personalized preparation with adaptive AI technology
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="text-blue-800 font-bold text-lg mb-3">🤖 AI Evaluation</div>
              <p className="text-gray-700">
                Instant, detailed feedback on writing & speaking tasks using advanced generative AI
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="text-blue-800 font-bold text-lg mb-3">📊 Dynamic Adaptation</div>
              <p className="text-gray-700">
                Your study plan automatically adjusts based on your performance.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <div className="text-blue-800 font-bold text-lg mb-3">🎯 Precision Training</div>
              <p className="text-gray-700">
                Focuses exactly on your weak areas with targeted exercises and practice
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Features Demo Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-12">
            Experience Our AI-Powered Evaluation
          </h2>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
            <div className="flex border-b">
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'writing' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-500'}`}
                onClick={() => setActiveTab('writing')}
              >
                Writing Evaluation
              </button>
              <button 
                className={`px-6 py-3 font-medium ${activeTab === 'speaking' ? 'text-blue-800 border-b-2 border-blue-800' : 'text-gray-500'}`}
                onClick={() => setActiveTab('speaking')}
              >
                Speaking Evaluation
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'writing' ? (
                <div>
                  <h3 className="text-lg font-bold mb-4">Sample Writing Task Feedback</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Student Essay</h4>
                      <div className="bg-gray-100 p-4 rounded h-64 overflow-y-auto">
                        <p>"In many countries, the amount of waste produced by households is increasing. What are the causes of this? What can be done to reduce it?"</p>
                        <p className="mt-2">Nowadays waste production is big problem in world. Many people throwing garbage without thinking..."</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">AI Feedback</h4>
                      <div className="bg-blue-50 p-4 rounded h-64 overflow-y-auto">
                        <div className="mb-3">
                          <span className="font-medium">Task Achievement:</span> 6.0 - Addresses the task but some ideas are unclear
                        </div>
                        <div className="mb-3">
                          <span className="font-medium">Coherence:</span> 5.5 - Ideas are not logically organized
                        </div>
                        <div className="mb-3">
                          <span className="font-medium">Lexical Resource:</span> 6.0 - Some good vocabulary but limited range
                        </div>
                        <div className="mb-3">
                          <span className="font-medium">Grammar:</span> 5.5 - Several errors affect clarity
                        </div>
                        <div className="mt-4">
                          <span className="font-medium">Suggestions:</span> 
                          <ul className="list-disc pl-5 mt-2">
                            <li>Use clearer topic sentences</li>
                            <li>Add more specific examples</li>
                            <li>Review article usage</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-bold mb-4">Sample Speaking Evaluation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Student Recording Analysis</h4>
                      <div className="bg-gray-100 p-4 rounded h-64 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <svg className="w-8 h-8 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
                            </svg>
                          </div>
                          <p>Audio sample analyzed</p>
                          <p className="text-sm text-gray-500 mt-1">Pronunciation, fluency, grammar assessed</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">AI Feedback Report</h4>
                      <div className="bg-blue-50 p-4 rounded h-64 overflow-y-auto">
                        <div className="mb-3">
                          <span className="font-medium">Fluency:</span> 6.0 - Some hesitation and repetition
                        </div>
                        <div className="mb-3">
                          <span className="font-medium">Pronunciation:</span> 6.5 - Generally clear with some errors
                        </div>
                        <div className="mb-3">
                          <span className="font-medium">Lexical Resource:</span> 6.0 - Adequate vocabulary range
                        </div>
                        <div className="mb-3">
                          <span className="font-medium">Grammar:</span> 5.5 - Several noticeable errors
                        </div>
                        <div className="mt-4">
                          <span className="font-medium">Improvement Tips:</span> 
                          <ul className="list-disc pl-5 mt-2">
                            <li>Practice linking words for smoother speech</li>
                            <li>Work on 'th' sounds pronunciation</li>
                            <li>Review past tense forms</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
  <div id="about" className="container mx-auto px-5">
    <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
      Why Choose IELTS Mastery?
    </h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Feature 1 - AI Evaluation */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-blue-800 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">AI-Powered Evaluation</h3>
        <p className="text-gray-600">
          Get instant, detailed feedback on Writing & Speaking tasks using advanced generative AI - a feature no other free platform offers.
        </p>
      </div>

      {/* Feature 2 - Adaptive Learning */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-blue-800 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">Smart Adaptive Learning</h3>
        <p className="text-gray-600">
          Your study plan automatically adjusts based on performance analytics, focusing precisely on your weak areas.
        </p>
      </div>

      {/* Feature 3 - Real Tests */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-blue-800 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">Authentic Test Experience</h3>
        <p className="text-gray-600">
          Real IELTS tests following Cambridge format with actual examiner evaluation criteria for Writing and Speaking.
        </p>
      </div>

      {/* Feature 4 - Performance Tracking */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-blue-800 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">Advanced Analytics</h3>
        <p className="text-gray-600">
          Set target scores and get precise metrics showing exactly where to improve, with progress tracking across all test components.
        </p>
      </div>

      {/* Feature 5 - Expert Community */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-blue-800 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">AI + Human Expertise</h3>
        <p className="text-gray-600">
          Combines AI analysis with insights from IELTS examiners and high-scorers for comprehensive preparation.
        </p>
      </div>

      {/* Feature 6 - Proven Results */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="text-blue-800 mb-4">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
          </svg>
        </div>
        <h3 className="text-xl font-bold mb-3 text-gray-800">Guaranteed Improvement</h3>
        <p className="text-gray-600">
          Our adaptive system helps students improve 1.0-2.0 bands faster than traditional methods.
        </p>
      </div>
    </div>

    {/* Unique Selling Point Banner */}
    <div className="mt-12 bg-blue-100 border border-blue-200 rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold text-blue-800 mb-2">What Makes Us Different?</h3>
      <p className="text-blue-700 max-w-3xl mx-auto">
        While other platforms only test your skills, IELTS Mastery <span className="font-semibold">actively improves them</span> with personalized AI coaching that adapts to your weaknesses in real-time.
      </p>
    </div>
  </div>
</section>
      {/* Personalized Learning Journey */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-5">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-4">
              Your Personalized IELTS Journey
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              We adapt to your needs at every step of your preparation
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Timeline */}
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200"></div>
              
              {/* Timeline Items */}
              <div className="mb-8 relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="font-bold text-lg text-blue-900">Initial Assessment</h3>
                    <p className="text-gray-600">We evaluate your current level across all IELTS skills</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                    1
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              </div>
              
              <div className="mb-8 relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                    2
                  </div>
                  <div className="w-1/2 pl-8">
                    <h3 className="font-bold text-lg text-blue-900">Custom Study Plan</h3>
                    <p className="text-gray-600">AI creates a tailored roadmap for your target score</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-8 relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8 text-right">
                    <h3 className="font-bold text-lg text-blue-900">Smart Practice</h3>
                    <p className="text-gray-600">Exercises adapt based on your performance</p>
                  </div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                    3
                  </div>
                  <div className="w-1/2 pl-8"></div>
                </div>
              </div>
              
              <div className="relative">
                <div className="flex items-center">
                  <div className="w-1/2 pr-8"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white font-bold">
                    4
                  </div>
                  <div className="w-1/2 pl-8">
                    <h3 className="font-bold text-lg text-blue-900">Continuous Optimization</h3>
                    <p className="text-gray-600">Your plan evolves as you improve</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-blue-900 mb-12">
            Success Stories
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4">SK</div>
                <div>
                  <h4 className="font-bold">Sarah K.</h4>
                  <p className="text-sm text-gray-500">Improved from 6.0 to 7.5 in Writing</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI feedback on my essays was incredibly detailed and helped me understand exactly what I was doing wrong. My writing improved by 1.5 bands in just 6 weeks!"
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4">SI</div>
                <div>
                  <h4 className="font-bold">Samee Idrees</h4>
                  <p className="text-sm text-gray-500">Improved from 6.5 to 8 in Writing</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The system interaction is just like a tutor in a live class. I was able to learn consistently throughout my generated plan. I had coonfidence attempting the IELTS Exam."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
            
            
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4">RA</div>
                <div>
                  <h4 className="font-bold">Rahim A.</h4>
                  <p className="text-sm text-gray-500">Achieved 8.0 Overall</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The personalized study plan was a game-changer. It adjusted automatically as I improved, always keeping me challenged but not overwhelmed."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold mr-4">AA</div>
                <div>
                  <h4 className="font-bold">Asjid A.</h4>
                  <p className="text-sm text-gray-500">Achieved 7.5 Overall</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The AI-powered study plan completely transformed my preparation. It identified my weak areas in writing coherence and speaking errors."
              </p>
              <div className="mt-4 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-800 text-white">
        <div className="container mx-auto px-5 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">
            Ready to Transform Your IELTS Preparation?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of students achieving their dream scores with our AI-powered platform
          </p>
          <Link
            href="/pages/register"
            className="inline-block bg-white text-blue-800 px-8 py-3 rounded-lg font-bold hover:bg-blue-100 transition"
          >
            Start Your Journey with Ielts Mastery
          </Link>
        </div>
      </section>

      {/* Footer remains the same */}
          <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
      <div className="container mx-auto px-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Column 1 - Quick Links */}
          
          {/* Column 2 - About Us */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">About Us</h3>
            <p className="mb-4">
              IELTS Mastery Solutions is an AI-powered platform founded in 2025, dedicated to revolutionizing IELTS preparation through adaptive learning technologies.
            </p>
            <div className="flex space-x-4">
              {/* Facebook Icon */}
              <Link href="#" className="text-blue-500 hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </Link>
              
              {/* Twitter Icon */}
              <Link href="#" className="text-blue-400 hover:text-blue-300 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"/>
                </svg>
              </Link>
              
              {/* LinkedIn Icon */}
              <Link href="#" className="text-blue-600 hover:text-blue-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Link>
              
              {/* Instagram Icon */}
              <Link href="#" className="text-purple-500 hover:text-purple-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </Link>
              
              {/* YouTube Icon */}
              <Link href="#" className="text-red-600 hover:text-red-500 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Column 3 - Our Mission */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Our Mission</h3>
            <p>
              To provide personalized, AI-driven IELTS preparation that helps students achieve their target scores faster. We combine cutting-edge technology with expert knowledge to create the most effective learning platform.
            </p>
          </div>

          {/* Column 4 - Recognition */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Recognized By</h3>
            <div className="grid grid-cols-2 gap-4">
              
              {/* National University Logo */}
              <div className="bg-blue-800 p-2 rounded flex items-center justify-center">
                <svg className="h-10" viewBox="0 0 120 40" fill="none">
                  <rect width="120" height="40" rx="4" fill="#03036D"/>
                  <text x="60" y="25" fontFamily="Arial" fontSize="12" fontWeight="bold" textAnchor="middle" fill="white">FAST-NUCES</text>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm">
              © 2025 IELTS Mastery Solutions. All Rights Reserved.
            </p>
          </div>
          <div className="text-sm text-center md:text-right">
            <p className="mb-2">
              IELTS is a registered trademark of University of Cambridge ESOL, the British Council, and IDP Education Australia. 
              This website is not affiliated, approved or endorsed by these organizations.
            </p>
            <p>
              "IELTS Online" is the name of the official online IELTS test and is not affiliated with this website.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </div>
  );
}