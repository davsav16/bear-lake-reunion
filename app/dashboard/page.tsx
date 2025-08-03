import { getUserData } from "@/lib/userUtils";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // Get user data to check RSVP status
  const user = await getUserData();

  // If user hasn't completed RSVP, redirect to RSVP page
  if (!user?.rsvpCompleted) {
    redirect("/rsvp");
  }

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-600">
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
              <p className="text-gray-900">July 15-17, 2024</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Location:</span>
              <p className="text-gray-900">Bear Lake Resort</p>
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
            <div>
              <span className="font-medium text-gray-700">Friday:</span>
              <p className="text-gray-900">Welcome Dinner - 6:00 PM</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Saturday:</span>
              <p className="text-gray-900">Lake Activities - All Day</p>
            </div>
            <div>
              <span className="font-medium text-gray-700">Sunday:</span>
              <p className="text-gray-900">Farewell Brunch - 10:00 AM</p>
            </div>
          </div>
        </div>

        {/* Updates Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg border">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Latest Updates
          </h2>
          <div className="space-y-3">
            <div className="border-l-4 border-blue-500 pl-3">
              <p className="text-sm text-gray-500">June 1, 2024</p>
              <p className="text-gray-900">
                Weather forecast looks perfect for the reunion weekend!
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-3">
              <p className="text-sm text-gray-500">May 15, 2024</p>
              <p className="text-gray-900">
                RSVP deadline extended to June 30th
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
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
            Update RSVP
          </button>
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
            View Full Schedule
          </button>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors">
            Contact Organizers
          </button>
        </div>
      </div>
    </div>
  );
}
