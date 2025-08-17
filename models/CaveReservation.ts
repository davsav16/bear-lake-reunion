import mongoose, { Schema, Document } from "mongoose";

interface ICaveReservation extends Document {
  memberId: number;
  memberName: string;
  familyId: number;
  familyName: string;
  status: "going" | "not going" | "undecided";
  createdAt: Date;
  updatedAt: Date;
}

const CaveReservationSchema = new Schema(
  {
    memberId: {
      type: Number,
      required: true,
      index: true,
    },
    memberName: {
      type: String,
      required: true,
      trim: true,
    },
    familyId: {
      type: Number,
      required: true,
      index: true,
    },
    familyName: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["going", "not going", "undecided"],
      default: "undecided",
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient queries
CaveReservationSchema.index({ memberId: 1, familyId: 1 }, { unique: true });

export default mongoose.models.CaveReservation ||
  mongoose.model<ICaveReservation>(
    "CaveReservation",
    CaveReservationSchema,
    "cave_reservations"
  );
