import { UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navigation() {
  return (
    <header className="p-4 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Bear Lake Reunion
        </Link>
        <UserButton />
      </div>
    </header>
  );
}
