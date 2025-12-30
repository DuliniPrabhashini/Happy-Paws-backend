import mongoose, { Document, Schema } from "mongoose";

export interface IPetDetail extends Document {
  petId: mongoose.Types.ObjectId;
  type: "VACCINE" | "VET_CHECKUP" | "BIRTHDAY";
  date: Date;
  description: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const petDetailSchema = new Schema<IPetDetail>(
  {
    petId: {
      type: Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["VACCINE", "VET_CHECKUP", "BIRTHDAY"],
    },

    date: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const PetDetail = mongoose.model<IPetDetail>(
  "PetDetail",
  petDetailSchema
);
