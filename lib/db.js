// lib/db.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;

if (!MONGODB_URI) {
  throw new Error("MONGO_URI is not defined");
}

let cached = global.mongooseConn;

if (!cached) {
  cached = global.mongooseConn = { conn: null, promise: null };
}

export async function connectDB() {
  // Already connected → reuse
  if (cached.conn) {
    return cached.conn;
  }

  // First time: create the connection promise
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
      })
      .then((m) => m);
  }

  // Await the shared promise
  cached.conn = await cached.promise;
  return cached.conn;
}
