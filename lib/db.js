// lib/db.js
import mongoose from "mongoose";

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
}
