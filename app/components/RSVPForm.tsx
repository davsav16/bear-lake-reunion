"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RSVPForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const rsvpData = {
      attending: formData.get("attending") as string,
      guests: parseInt(formData.get("guests") as string),
      dietary: formData.get("dietary") as string,
      notes: formData.get("notes") as string,
    };

    try {
      const response = await fetch("/api/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(rsvpData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP");
      }

      const result = await response.json();

      if (result.success) {
        // Redirect to dashboard after successful RSVP
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to submit RSVP");
      }
    } catch (err) {
      setError("Failed to submit RSVP. Please try again.");
      console.error("RSVP submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="attending"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Will you be attending?
        </label>
        <select
          id="attending"
          name="attending"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select an option</option>
          <option value="yes">Yes, I will attend</option>
          <option value="no">No, I cannot attend</option>
          <option value="maybe">Maybe, I&apos;ll let you know</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="guests"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of guests (including yourself)
        </label>
        <input
          type="number"
          id="guests"
          name="guests"
          min="1"
          max="10"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="1"
          required
        />
      </div>

      <div>
        <label
          htmlFor="dietary"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Dietary restrictions or preferences
        </label>
        <textarea
          id="dietary"
          name="dietary"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any dietary restrictions or preferences..."
        />
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Additional notes
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional information..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
      >
        {isSubmitting ? "Submitting..." : "Submit RSVP"}
      </button>
    </form>
  );
}
