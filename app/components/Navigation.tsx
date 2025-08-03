import { UserButton } from "@clerk/nextjs";

export default function Navigation() {
  return (
    <header className="p-4 border-b bg-white shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Bear Lake Reunion</h1>
        <UserButton />
      </div>
    </header>
  );
}
