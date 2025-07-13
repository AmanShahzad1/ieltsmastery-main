"use client"
import dynamic from 'next/dynamic';
import React from 'react';

const SpeakingTestMainView = dynamic(
  () => import('./SpeakingTestMainClient'),
  { 
    ssr: false,
    loading: () => (
      <div className="min-h-screen bg-gray-100 p-8 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }
);

export default function Page() {
  return <SpeakingTestMainView />;
}