"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Check if user is authenticated by checking for the auth token
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth_token='));
    
    if (token) {
      // If authenticated, redirect to dashboard
      router.push('/admin/dashboard');
    } else {
      // If not authenticated, redirect to login
      router.push('/admin/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting...</p>
    </div>
  );
}