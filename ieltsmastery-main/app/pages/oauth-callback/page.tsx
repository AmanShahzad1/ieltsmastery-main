'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    // Extract token from URL hash
    const token = window.location.hash.split('=')[1];
    
    if (token) {
      // Store token in localStorage
      localStorage.setItem('token', token);
      
      // Clean the URL (remove hash)
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Redirect to dashboard
      router.push('/pages/profile_creation');
    } else {
      // No token found - redirect to login
      router.push('/login?error=oauth_failed');
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Completing login...</p>
      </div>
    </div>
  );
}