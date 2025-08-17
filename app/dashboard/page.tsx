"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Member {
  id: number;
  name: string;
  rsvp: "undecided" | "not attending" | "attending";
  plusOne?: "undecided" | "not attending" | "attending";
}

interface Family {
  id: number;
  name: string;
  members: Member[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [families, setFamilies] = useState<Family[]>([]);

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

    const fetchFamilies = async () => {
      try {
        const response = await fetch("/api/families");
        if (response.ok) {
          const data = await response.json();
          setFamilies(data.families || []);
        }
      } catch (error) {
        console.error("Error fetching families:", error);
      }
    };

    checkUserStatus();
    fetchFamilies();
  }, [router]);

  // Filter families to only show those with attending members
  const familiesWithAttendees = families.filter((family) =>
    family.members.some((member) => member.rsvp === "attending")
  );

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
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-lg border border-blue-700 hover:border-blue-500 transition-all duration-200 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-100">
            Event Details
          </h2>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-blue-200">Date:</span>
              <p className="text-blue-100">August 29-31, 2025</p>
            </div>
            <div>
              <span className="font-medium text-blue-200">Location:</span>
              <p className="text-blue-100">Bear Lake</p>
            </div>
            <div>
              <span className="font-medium text-blue-200">Status:</span>
              <span className="inline-block bg-green-900/50 text-green-300 px-2 py-1 rounded-full text-sm font-medium border border-green-700">
                RSVP Confirmed
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-lg border border-blue-700 hover:border-blue-500 transition-all duration-200 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-100">Schedule</h2>
          <div className="space-y-3">
            <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
              <p className="text-yellow-200 text-sm">
                <strong>Note:</strong> Schedule details will be coming soon!
              </p>
            </div>
          </div>
        </div>

        {/* Updates Card */}
        <div className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-lg border border-blue-700 hover:border-blue-500 transition-all duration-200 hover:shadow-xl">
          <h2 className="text-xl font-semibold mb-4 text-blue-100">
            Latest Updates
          </h2>
          <div className="space-y-3">
            <div className="mt-4 p-3 bg-blue-800/30 border border-blue-600/50 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>Note:</strong> Updates will be coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-lg border border-blue-700 hover:border-blue-500 transition-all duration-200 hover:shadow-xl">
        <h2 className="text-xl font-semibold mb-4 text-blue-100">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button
            onClick={() => router.push("/rsvp-edit")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors border border-blue-500 hover:border-blue-400"
          >
            Update RSVP
          </button>
        </div>
      </div>

      {/* Who's In! Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Who&apos;s in!? 🎉
        </h2>
        {familiesWithAttendees.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {familiesWithAttendees.map((family) => (
              <div
                key={family.id}
                className="bg-gradient-to-br from-blue-900 to-blue-800 p-6 rounded-lg shadow-lg border border-blue-700 hover:border-blue-500 transition-all duration-200 hover:shadow-xl mb-6 break-inside-avoid"
              >
                <h3 className="text-lg font-semibold text-blue-100 mb-4 pb-2 border-b border-blue-600">
                  {family.name} Family
                </h3>
                <div className="space-y-3">
                  {family.members
                    .filter((member) => member.rsvp === "attending")
                    .map((member) => (
                      <div
                        key={member.id}
                        className="flex items-center space-x-3 bg-blue-800/50 p-3 rounded-lg border border-blue-600/30"
                      >
                        <div className="flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="text-blue-100 font-medium">
                          {member.name}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="bg-blue-900/50 p-6 rounded-lg border border-blue-700">
              <p className="text-blue-200 text-lg">
                No RSVPs confirmed yet. Check back soon!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
