"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FamilyMember {
  id: number;
  name: string;
  rsvp: "undecided" | "not attending" | "attending";
  plusOne?: "undecided" | "not attending" | "attending";
}

interface FamilyGroup {
  id: number;
  name: string;
  members: FamilyMember[];
}

interface CaveReservation {
  memberId: number;
  memberName: string;
  familyId: number;
  familyName: string;
  status: "going" | "not going" | "undecided";
}

export default function MinnetonkaCavePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingReservations, setIsLoadingReservations] = useState(false);
  const [error, setError] = useState("");
  const [families, setFamilies] = useState<FamilyGroup[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<FamilyGroup | null>(
    null
  );
  const [selectedMembers, setSelectedMembers] = useState<CaveReservation[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fetch families from MongoDB
  useEffect(() => {
    const fetchFamilies = async () => {
      try {
        const response = await fetch("/api/families");
        if (response.ok) {
          const data = await response.json();
          setFamilies(data.families);
        }
      } catch (err) {
        console.error("Error fetching families:", err);
      }
    };

    fetchFamilies();
  }, []);

  const handleFamilyChange = (familyId: number) => {
    const family = families.find((f) => f.id === familyId);
    setSelectedFamily(family || null);
    setSelectedMembers([]); // Reset selected members when family changes
    setIsDropdownOpen(false);

    // Fetch existing reservations for this family
    if (family) {
      fetchExistingReservations(familyId);
    }
  };

  const fetchExistingReservations = async (familyId: number) => {
    setIsLoadingReservations(true);
    try {
      const response = await fetch(
        `/api/cave-reservations?familyId=${familyId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.reservations && data.reservations.length > 0) {
          // Convert existing reservations to the form format
          const existingReservations = data.reservations.map(
            (reservation: CaveReservation) => ({
              memberId: reservation.memberId,
              memberName: reservation.memberName,
              familyId: reservation.familyId,
              familyName: reservation.familyName,
              status: reservation.status,
            })
          );
          setSelectedMembers(existingReservations);
          console.log("Loaded existing reservations:", existingReservations);
        }
      }
    } catch (error) {
      console.error("Error fetching existing reservations:", error);
    } finally {
      setIsLoadingReservations(false);
    }
  };

  const handleMemberSelection = (
    member: FamilyMember,
    status: "going" | "not going" | "undecided"
  ) => {
    if (!selectedFamily) return;

    const reservation: CaveReservation = {
      memberId: member.id,
      memberName: member.name,
      familyId: selectedFamily.id,
      familyName: selectedFamily.name,
      status,
    };

    // Remove existing reservation for this member if it exists
    const filteredMembers = selectedMembers.filter(
      (m) => m.memberId !== member.id
    );

    // Add new reservation if status is not "undecided"
    if (status !== "undecided") {
      setSelectedMembers([...filteredMembers, reservation]);
    } else {
      setSelectedMembers(filteredMembers);
    }
  };

  const getMemberStatus = (memberId: number) => {
    const reservation = selectedMembers.find((m) => m.memberId === memberId);
    return reservation ? reservation.status : "undecided";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFamily) {
      setError("Please select a family");
      return;
    }

    if (selectedMembers.length === 0) {
      setError("Please select at least one member");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const requestBody = {
        familyId: selectedFamily.id,
        familyName: selectedFamily.name,
        reservations: selectedMembers,
      };

      console.log("Form submitting data:", requestBody);

      const response = await fetch("/api/cave-reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Form - Response status:", response.status);
      console.log("Form - Response ok:", response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.log("Form - Error response text:", errorText);
        throw new Error(
          `Failed to submit Minnetonka Cave reservation: ${response.status} ${errorText}`
        );
      }

      const result = await response.json();
      console.log("Form - Success result:", result);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Failed to submit reservation");
      }
    } catch (err) {
      setError("Failed to submit reservation. Please try again.");
      console.error("Reservation submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-blue-100 mb-4">
              Minnetonka Cave Reservations
            </h2>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              We&apos;re planning to visit Minnetonka Cave on the first day of
              the reunion (August 29, 2025) and need a head count of who would
              be interested in going. Please let us know if you&apos;d like to
              join us for this adventure!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="relative">
              <label
                htmlFor="family"
                className="block text-sm font-medium text-blue-200 mb-2"
              >
                Select your family
              </label>

              {/* Custom Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full px-3 py-3 text-left bg-blue-800/50 border border-blue-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-blue-100"
                >
                  <span
                    className={
                      selectedFamily ? "text-blue-100" : "text-blue-300"
                    }
                  >
                    {selectedFamily
                      ? selectedFamily.name
                      : "Select your family"}
                  </span>
                  <svg
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-400 transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Options */}
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-blue-800 border border-blue-600 rounded-md shadow-lg max-h-60 overflow-auto">
                    {families.map((family) => (
                      <button
                        key={family.id}
                        type="button"
                        onClick={() => handleFamilyChange(family.id)}
                        className="w-full px-3 py-3 text-left text-blue-100 hover:bg-blue-700 focus:bg-blue-700 focus:outline-none border-b border-blue-600 last:border-b-0"
                      >
                        {family.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {selectedFamily && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-100">
                  Select members for Minnetonka Cave tour
                </h3>

                {isLoadingReservations && (
                  <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                    <p className="text-blue-200 text-center">
                      Loading existing reservations...
                    </p>
                  </div>
                )}

                {!isLoadingReservations && selectedMembers.length > 0 && (
                  <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
                    <p className="text-blue-200 text-sm">
                      <strong>Note:</strong> You have existing reservations. You
                      can update them below or make new selections.
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedFamily.members.map((member) => (
                    <div
                      key={member.id}
                      className="border border-blue-600 rounded-lg p-4 bg-blue-800/30 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-medium text-blue-100">
                          {member.name}
                        </span>
                        <div className="flex space-x-2">
                          {(["undecided", "not going", "going"] as const).map(
                            (status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  handleMemberSelection(member, status)
                                }
                                className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                                  getMemberStatus(member.id) === status
                                    ? "bg-green-600 text-white"
                                    : "bg-blue-700 text-blue-200 hover:bg-blue-600"
                                }`}
                              >
                                {status === "not going"
                                  ? "Not Going"
                                  : status === "going"
                                  ? "Going"
                                  : "Undecided"}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedMembers.length > 0 && (
                  <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
                    <h4 className="text-green-100 font-semibold mb-2">
                      Selected Members:
                    </h4>
                    <div className="space-y-2">
                      {selectedMembers.map((reservation) => (
                        <div
                          key={reservation.memberId}
                          className="flex items-center space-x-3"
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
                          <span className="text-green-100">
                            {reservation.memberName} -{" "}
                            {reservation.status === "going"
                              ? "Going"
                              : "Not Going"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  !selectedFamily ||
                  selectedMembers.length === 0
                }
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg border border-green-500 hover:border-green-400"
              >
                {isSubmitting ? "Saving..." : "Save Reservations"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 shadow-lg border border-blue-500 hover:border-blue-400"
              >
                Back to Dashboard
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
