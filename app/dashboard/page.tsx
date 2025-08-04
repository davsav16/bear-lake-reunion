"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          if (!data.user?.rsvpCompleted) {
            router.push("/rsvp");
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-200 font-medium">
          Here you&apos;ll find all the latest updates and information about the
          reunion.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Event Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Event Details
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-700">Date:</span>
              <p className="text-gray-900">August 29-31, 2025</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <p className="text-gray-900">Bear Lake</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Status:</span>
              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                RSVP Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Schedule</h2>
          <div className="space-y-3">
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Note:</strong> Schedule details will be coming soon!
              </p>
            </div>
          </div>
        </div>

        {/* Updates Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Latest Updates
          </h2>
          <div className="space-y-3">
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm">
                <strong>Note:</strong> Updates will be coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-lg border">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => router.push("/rsvp-edit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Update RSVP
          </button>
        </div>
      </div>
    </div>
  );
}
