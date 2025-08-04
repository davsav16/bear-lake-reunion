import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FamilyMember from "@/models/FamilyMember";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all family members from MongoDB
    const families = await FamilyMember.find({}).sort({ id: 1 });

    // Transform the data to use 'members' field for frontend compatibility
    const transformedFamilies = families.flatMap((family) => {
      const familyObj = family.toObject();

      // The familyMembers array contains the actual families
      const actualFamilies = familyObj.familyMembers || [];

      return actualFamilies.map(
        (familyMember: { id: number; name: string; members?: unknown[] }) => ({
          id: familyMember.id,
          name: familyMember.name,
          members: familyMember.members || [],
        })
      );
    });

    return NextResponse.json({ families: transformedFamilies });
  } catch (error) {
    console.error("Error fetching families:", error);
    return NextResponse.json(
      { error: "Failed to fetch families" },
      { status: 500 }
    );
  }
}
