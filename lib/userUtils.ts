import { auth } from "@clerk/nextjs/server";
import dbConnect from "./mongodb";
import User from "@/models/User";

export async function ensureUserExists() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    await dbConnect();
    let user = await User.findOne({ id: userId });

    // If user doesn't exist, create them
    if (!user) {
      user = new User({
        id: userId,
        rsvpCompleted: false,
        role: "",
      });
      await user.save();
    }

    return user;
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    return null;
  }
}

export async function getUserData() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    await dbConnect();
    const user = await User.findOne({ id: userId });
    return user;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
}
