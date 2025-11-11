import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ MONGODB_URI missing in environment variables");
}

let isConnected = false;

export async function dbConnect() {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "recovercart", // ✅ Explicitly set DB name
    });
    isConnected = db.connections[0].readyState;
    console.log("✅ MongoDB connected to:", db.connection.name);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
