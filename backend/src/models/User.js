// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    // "admin" | "school_admin" | "teacher" | "student"
    role: {
      type: String,
      enum: ["admin", "school_admin", "teacher", "student"],
      required: true,
      default: "student",
    },

    // For school_admin / teacher / student, which school they belong to
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
    },

    // Who created this user (for permissions trace)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
