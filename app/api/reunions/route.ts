import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Reunion from "@/models/Reunion";

export async function GET() {
  try {
    await dbConnect();
    const reunions = await Reunion.find({}).sort({ date: 1 });
    return NextResponse.json({ reunions });
  } catch (error) {
    console.error("Error fetching reunions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reunions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();

    const reunion = new Reunion(body);
    await reunion.save();

    return NextResponse.json({ reunion }, { status: 201 });
  } catch (error) {
    console.error("Error creating reunion:", error);
    return NextResponse.json(
      { error: "Failed to create reunion" },
      { status: 500 }
    );
  }
}
