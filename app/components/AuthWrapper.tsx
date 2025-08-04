"use client";

import { SignInButton, SignUpButton, useAuth } from "@clerk/nextjs";
import Image from "next/image";

interface AuthWrapperProps {
  children: React.ReactNode;
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { isSignedIn, isLoaded } = useAuth();

  // Don't render anything until auth state is loaded
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Loading...</h1>
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
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className=" w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to the Bear Lake Reunion
          </h1>
          <div className="flex justify-center my-8">
            <Image
              src="/bear-lake-1.jpg"
              alt="Bear Lake Reunion Logo"
              width={800}
              height={800}
              className="rounded-lg"
            />
          </div>
          <p className="text-gray-300 mb-8">
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
