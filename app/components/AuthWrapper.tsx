"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Don't render anything until auth state is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  // If user is signed in, show the protected content
  if (isSignedIn) {
    return <>{children}</>;
  }

  // If user is not signed in, show the sign-in/sign-up options
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Bear Lake Reunion
          </h1>
          <p className="text-gray-600 mb-8">
            Please sign in to access the reunion information and updates.
          </p>
          <div className="flex gap-4 justify-center">
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg">
                Sign Up
              </button>
            </SignUpButton>
          </div>
        </div>
      </div>
    </div>
  );
}
