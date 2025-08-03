import { UserButton } from "@clerk/nextjs";
import AuthWrapper from "./components/AuthWrapper";

export default function Home() {
  return (
    <AuthWrapper>
      <div className="font-sans min-h-screen">
        <header className="p-4 border-b bg-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Bear Lake Reunion</h1>
            <UserButton />
          </div>
        </header>

        <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
          <div className="text-center max-w-2xl">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Bear Lake Reunion
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              You&apos;re signed in! Here you&apos;ll find all the reunion
              details and updates.
            </p>
            <div className="bg-blue-50 p-6 rounded-lg max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-2">Reunion Details</h2>
              <p className="text-gray-700">
                This is where you&apos;ll see all the reunion information,
                schedules, and updates.
              </p>
            </div>
          </div>
        </main>
      </div>
    </AuthWrapper>
  );
}
