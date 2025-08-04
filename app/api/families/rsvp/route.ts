import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import FamilyMember from "@/models/FamilyMember";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { familyId, members } = body;

    // Try updating using the positional operator
    const updatedFamily = await FamilyMember.findOneAndUpdate(
      { "familyMembers.id": familyId },
      {
        $set: {
          "familyMembers.$.members": members,
        },
      },
      { new: true, runValidators: true }
    );

    // If that didn't work, try the alternative approach
    if (!updatedFamily) {
      console.log("Positional operator failed, trying alternative approach");

      // Find the document first
      const doc = await FamilyMember.findOne({});
      if (doc) {
        // Update the specific family's members
        const familyIndex = doc.familyMembers.findIndex(
          (f: { id: number }) => f.id === familyId
        );
        if (familyIndex !== -1) {
          doc.familyMembers[familyIndex].members = members;
          await doc.save();
        }
      }
    }

    if (!updatedFamily) {
      return NextResponse.json({ error: "Family not found" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "RSVP updated successfully!",
      family: updatedFamily,
    });
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return NextResponse.json(
      { error: "Failed to update RSVP" },
      { status: 500 }
    );
  }
}
