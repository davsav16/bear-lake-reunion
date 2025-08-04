import RSVPForm from "../components/RSVPForm";

export default async function RSVPPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4 text-white">
          RSVP for Bear Lake
        </h1>
        <p className="text-lg text-gray-200 font-medium mb-8">
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
