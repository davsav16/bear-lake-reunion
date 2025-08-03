import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  id: string; // Clerk user ID
  rsvpCompleted: boolean;
  role: string;
  rsvpData?: {
    attending: string;
    guests: number;
    dietary?: string;
    notes?: string;
    submittedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    rsvpCompleted: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: "",
      trim: true,
    },
    rsvpData: {
      attending: {
        type: String,
        enum: ["yes", "no", "maybe"],
      },
      guests: {
        type: Number,
        min: 1,
        max: 10,
      },
      dietary: {
        type: String,
        trim: true,
      },
      notes: {
        type: String,
        trim: true,
      },
      submittedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
