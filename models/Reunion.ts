import mongoose, { Schema, Document } from "mongoose";

export interface IReunion extends Document {
  title: string;
  date: Date;
  location: string;
  description: string;
  attendees: string[];
  activities: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ReunionSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    attendees: [
      {
        type: String,
        trim: true,
      },
    ],
    activities: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Reunion ||
  mongoose.model<IReunion>("Reunion", ReunionSchema);
