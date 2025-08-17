import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/mongodb";
import CaveReservation from "@/models/CaveReservation";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { familyId, familyName, reservations } = body;

    console.log("Cave Reservations API - Received data:", {
      familyId,
      familyName,
      reservations,
    });

    if (
      !familyId ||
      !familyName ||
      !reservations ||
      !Array.isArray(reservations)
    ) {
      return NextResponse.json(
        {
          error: "Family ID, family name, and reservations array are required",
        },
        { status: 400 }
      );
    }

    // Process each reservation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const upsertOperations = reservations.map((reservation: any) => ({
      updateOne: {
        filter: {
          memberId: reservation.memberId,
          familyId: reservation.familyId,
        },
        update: {
          $set: {
            memberName: reservation.memberName,
            familyName: reservation.familyName,
            status: reservation.status,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    console.log("Cave Reservations API - Upsert operations:", upsertOperations);

    // Use bulkWrite to upsert all reservations
    const result = await CaveReservation.bulkWrite(upsertOperations);
    console.log("Cave Reservations API - Bulk write result:", result);

    // Fetch all reservations for this family to return
    const familyReservations = await CaveReservation.find({ familyId }).sort({
      memberName: 1,
    });

    return NextResponse.json({
      success: true,
      message: "Cave reservations updated successfully!",
      reservations: familyReservations,
      result: result,
    });
  } catch (error) {
    console.error("Error updating cave reservations:", error);
    return NextResponse.json(
      { error: "Failed to update cave reservations" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const familyId = searchParams.get("familyId");

    let query = {};
    if (familyId) {
      query = { familyId: parseInt(familyId) };
    }

    // Get cave reservations with optional family filter
    const reservations = await CaveReservation.find(query).sort({
      familyName: 1,
      memberName: 1,
    });

    return NextResponse.json({
      success: true,
      reservations: reservations,
    });
  } catch (error) {
    console.error("Error fetching cave reservations:", error);
    return NextResponse.json(
      { error: "Failed to fetch cave reservations" },
      { status: 500 }
    );
  }
}
