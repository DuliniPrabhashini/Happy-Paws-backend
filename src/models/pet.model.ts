import mongoose, { Document, Schema } from "mongoose";

export enum PET_TYPE {
  DOG = "DOG",
  CAT = "CAT",
  BIRD = "BIRD",
  SNAKE = "SNAKE",
  MONKEY = "MONKEY",
  OTHER = "OTHER",
}

export interface IPet extends Document {
  _id: mongoose.Types.ObjectId;
  owner: mongoose.Types.ObjectId;
  name: string;
  type: PET_TYPE;
  age?: number;
  breed?: string;
  imageUrl: string;
  createdAt: Date;
}

const petSchema = new Schema<IPet>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: Object.values(PET_TYPE),
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    breed: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
        type: String,
        required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Pet = mongoose.model<IPet>("Pet", petSchema);
