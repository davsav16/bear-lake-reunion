import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import FamilyMember from "@/models/FamilyMember";

export async function GET() {
  try {
    await dbConnect();

    // Fetch all family members from MongoDB
    const familyDocuments = await FamilyMember.find({});

    // Transform the data to use 'members' field for frontend compatibility
    const transformedFamilies = familyDocuments.flatMap((familyDoc) => {
      const familyObj = familyDoc.toObject();

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

    console.log("API: Found", familyDocuments.length, "documents");
    console.log("API: Transformed to", transformedFamilies.length, "families");
    console.log("API: Sample family data:", transformedFamilies[0]);

    return NextResponse.json({ families: transformedFamilies });
  } catch (error) {
    console.error("Error fetching families:", error);
    return NextResponse.json(
      { error: "Failed to fetch families" },
      { status: 500 }
    );
  }
}
