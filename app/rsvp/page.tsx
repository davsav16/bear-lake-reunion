import RSVPForm from "../components/RSVPForm";
import { getUserData } from "@/lib/userUtils";
import { redirect } from "next/navigation";

export default async function RSVPPage() {
  // Get user data to check RSVP status
  const user = await getUserData();

  // If user has already completed RSVP, redirect to dashboard
  if (user?.rsvpCompleted) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">
          RSVP for Bear Lake Reunion
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Please complete your RSVP to access the reunion dashboard and updates.
        </p>

        <div className="bg-white p-8 rounded-lg shadow-lg border max-w-md mx-auto">
          <h2 className="text-2xl font-semibold mb-6 text-gray-900">
            RSVP Form
          </h2>
          <RSVPForm />
        </div>
      </div>
    </div>
  );
}
