import mongoose, { Schema, Document } from "mongoose";

interface IMember {
  id: number;
  name: string;
  rsvp: "undecided" | "not attending" | "attending";
  plusOne?: "undecided" | "not attending" | "attending";
  minnetonkaRSVP?: "undecided" | "not attending" | "going";
}

interface IFamily {
  id: number;
  name: string;
  members: IMember[];
}

interface IFamilyMember extends Document {
  familyMembers: IFamily[];
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  rsvp: {
    type: String,
    enum: ["undecided", "not attending", "attending"],
    default: "undecided",
  },
  plusOne: {
    type: String,
    enum: ["undecided", "not attending", "attending"],
  },
  minnetonkaRSVP: {
    type: String,
    enum: ["undecided", "not attending", "going"],
    default: "undecided",
  },
});

const FamilySchema = new Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  members: [MemberSchema],
});

const FamilyMemberSchema = new Schema(
  {
    familyMembers: [FamilySchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.FamilyMember ||
  mongoose.model<IFamilyMember>(
    "FamilyMember",
    FamilyMemberSchema,
    "family_members"
  );
