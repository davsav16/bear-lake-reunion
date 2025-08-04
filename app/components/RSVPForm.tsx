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

export default function RSVPForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [families, setFamilies] = useState<FamilyGroup[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<FamilyGroup | null>(
    null
  );
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [originalFamilyMembers, setOriginalFamilyMembers] = useState<
    FamilyMember[]
  >([]);
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
    const members = family ? [...family.members] : [];
    setFamilyMembers(members);
    setOriginalFamilyMembers(members);
    setIsDropdownOpen(false);
  };

  const updateMemberRSVP = (
    memberId: number,
    rsvp: "undecided" | "not attending" | "attending"
  ) => {
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, rsvp } : member
      )
    );
  };

  const updatePlusOneRSVP = (
    memberId: number,
    plusOne: "undecided" | "not attending" | "attending"
  ) => {
    setFamilyMembers((prev) =>
      prev.map((member) =>
        member.id === memberId ? { ...member, plusOne } : member
      )
    );
  };

  const hasChanges = () => {
    if (familyMembers.length === 0 || originalFamilyMembers.length === 0) {
      return false;
    }

    return familyMembers.some((member, index) => {
      const original = originalFamilyMembers[index];
      return (
        member.rsvp !== original.rsvp || member.plusOne !== original.plusOne
      );
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFamily) {
      setError("Please select a family");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      console.log("Submitting RSVP - selectedFamily:", selectedFamily);
      console.log("Submitting RSVP - familyMembers:", familyMembers);

      // Update family members in MongoDB
      const response = await fetch("/api/families/rsvp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          familyId: selectedFamily.id,
          members: familyMembers,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit RSVP");
      }

      const result = await response.json();

      if (result.success) {
        // Update user's RSVP status
        const userResponse = await fetch("/api/users", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            rsvpCompleted: true,
          }),
        });

        if (userResponse.ok) {
          router.push("/dashboard");
        } else {
          setError("Failed to update user status");
        }
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
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to our 2025 Family Reunion!
        </h2>
        <p className="text-lg text-gray-700">
          Please fill out your details below!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="relative">
          <label
            htmlFor="family"
            className="block text-sm font-medium text-gray-900 mb-2"
          >
            Select your family
          </label>

          {/* Custom Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-3 text-left bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            >
              <span
                className={selectedFamily ? "text-gray-900" : "text-gray-500"}
              >
                {selectedFamily ? selectedFamily.name : "Select your family"}
              </span>
              <svg
                className={`absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${
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
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {families.map((family) => (
                  <button
                    key={family.id}
                    type="button"
                    onClick={() => handleFamilyChange(family.id)}
                    className="w-full px-3 py-3 text-left text-gray-900 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none border-b border-gray-100 last:border-b-0"
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
            <h3 className="text-lg font-semibold text-gray-900">
              RSVP for {selectedFamily.name}
            </h3>

            {familyMembers.map((member) => (
              <div
                key={member.id}
                className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="md:flex md:items-center md:justify-between mb-3">
                  <span className="font-medium text-gray-900 text-center md:text-left block mb-3 md:mb-0">
                    {member.name}
                  </span>
                  <div className="flex justify-center md:justify-end space-x-2">
                    {["undecided", "not attending", "attending"].map(
                      (status) => (
                        <button
                          key={status}
                          type="button"
                          onClick={() =>
                            updateMemberRSVP(
                              member.id,
                              status as
                                | "undecided"
                                | "not attending"
                                | "attending"
                            )
                          }
                          className={`px-3 py-1 text-sm rounded-md transition-colors font-medium ${
                            member.rsvp === status
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                          }`}
                        >
                          {status === "not attending"
                            ? "Not Going"
                            : status === "attending"
                            ? "Going"
                            : "Undecided"}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {member.plusOne !== undefined && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="md:flex md:items-center md:justify-between">
                      <div className="flex items-center justify-center md:justify-start mb-3 md:mb-0">
                        <input
                          type="checkbox"
                          id={`plus-one-${member.id}`}
                          checked={member.plusOne !== "undecided"}
                          onChange={(e) => {
                            if (e.target.checked) {
                              updatePlusOneRSVP(member.id, "attending");
                            } else {
                              updatePlusOneRSVP(member.id, "undecided");
                            }
                          }}
                          className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={`plus-one-${member.id}`}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          Plus one?
                        </label>
                      </div>

                      {member.plusOne !== "undecided" && (
                        <div className="flex justify-center md:justify-end space-x-2">
                          {["undecided", "not attending", "attending"].map(
                            (status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() =>
                                  updatePlusOneRSVP(
                                    member.id,
                                    status as
                                      | "undecided"
                                      | "not attending"
                                      | "attending"
                                  )
                                }
                                className={`px-2 py-1 text-xs rounded-md transition-colors font-medium ${
                                  member.plusOne === status
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                                }`}
                              >
                                {status === "not attending"
                                  ? "Not Going"
                                  : status === "attending"
                                  ? "Going"
                                  : "Undecided"}
                              </button>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting || !selectedFamily || !hasChanges()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 shadow-lg"
        >
          {isSubmitting ? "Saving..." : "Save RSVP"}
        </button>
      </form>
    </div>
  );
}
