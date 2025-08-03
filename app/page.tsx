import { ensureUserExists, getUserData } from "@/lib/userUtils";
import { redirect } from "next/navigation";

export default async function Home() {
  // Ensure user exists in MongoDB
  await ensureUserExists();

  // Get user data to check RSVP status
  const user = await getUserData();

  // Redirect based on RSVP status
  if (user?.rsvpCompleted) {
    redirect("/dashboard");
  } else {
    redirect("/rsvp");
  }

  // This should never be reached due to redirects
  return null;
}
