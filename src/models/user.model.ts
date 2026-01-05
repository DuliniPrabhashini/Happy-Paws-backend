import mongoose, { Document, Schema } from "mongoose";

export enum ROLE {
  ADMIN = "ADMIN",
  USER = "USER",
}

export interface IUSER extends Document {
  _id: mongoose.Types.ObjectId;
  name?: string;
  email?: string;
  password: string;
  roles: ROLE[];
  imageUrl?: string;
}

const userSchema = new Schema<IUSER>({
  name: { type: String, required: true },
  email: { type: String, unique: true, lowercase: true, required: true },
  password: { type: String, required: true },
  roles: { type: [String], enum: Object.values(ROLE), default: [ROLE.USER] },
  imageUrl: { type: String, required: false },
});

export const User = mongoose.model<IUSER>("User", userSchema);
