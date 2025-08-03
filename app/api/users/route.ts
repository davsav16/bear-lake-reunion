import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    let user = await User.findOne({ id: userId });

    // If user doesn't exist in MongoDB, create them
    if (!user) {
      user = new User({
        id: userId,
        rsvpCompleted: false,
        role: "",
      });
      await user.save();
      console.log(`User created in MongoDB via API: ${userId}`);
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Use findOneAndUpdate with upsert to create user if they don't exist
    const user = await User.findOneAndUpdate(
      { id: userId },
      {
        $set: body,
        $setOnInsert: {
          id: userId,
          rsvpCompleted: false,
          role: "",
        },
      },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
