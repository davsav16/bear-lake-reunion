import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

// Webhook secret from Clerk Dashboard
const webhookSecret = process.env.CLERK_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const headersList = await headers();
    const svix_id = headersList.get("svix-id");
    const svix_timestamp = headersList.get("svix-timestamp");
    const svix_signature = headersList.get("svix-signature");

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      return NextResponse.json(
        { error: "Missing svix headers" },
        { status: 400 }
      );
    }

    // Get the body
    const payload = await request.text();
    const body = JSON.parse(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(webhookSecret);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let evt: any;

    // Verify the payload with the headers
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      evt = wh.verify(payload, {
        "svix-id": svix_id,
        "svix-timestamp": svix_timestamp,
        "svix-signature": svix_signature,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any;
    } catch (err) {
      console.error("Error verifying webhook:", err);
      return NextResponse.json(
        { error: "Error verifying webhook" },
        { status: 400 }
      );
    }

    // Handle the webhook
    const eventType = evt.type;

    if (eventType === "user.created") {
      await dbConnect();

      const { id } = evt.data;

      // Check if user already exists
      const existingUser = await User.findOne({ id });

      if (!existingUser) {
        // Create new user in MongoDB
        const newUser = new User({
          id,
          rsvpCompleted: false,
          role: "",
        });

        await newUser.save();
        console.log(`User created in MongoDB: ${id}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
