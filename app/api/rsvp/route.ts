import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Update user's RSVP status and add RSVP data
    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        $set: {
          rsvpCompleted: true,
          rsvpData: {
            attending: body.attending,
            guests: body.guests,
            dietary: body.dietary,
            notes: body.notes,
            submittedAt: new Date(),
          },
        },
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      user,
      message: "RSVP submitted successfully!",
    });
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 }
    );
  }
}
