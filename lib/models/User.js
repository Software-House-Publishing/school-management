// lib/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["system_administrator", "school_administrator", "teacher", "student"],
      required: true,
      default: "student",
    },
    schoolId: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// IMPORTANT: named export "User"
export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
