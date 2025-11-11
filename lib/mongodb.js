// lib/mongodb.js
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("⚠️  Please add MONGODB_URI to your .env.local file");
}

// keep one global cache during hot reloads
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "recovercard",
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then((mongoose) => {
        console.log("✅ Connected to MongoDB Atlas successfully!");
        return mongoose;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err);
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
