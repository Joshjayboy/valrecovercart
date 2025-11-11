import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/models/User";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const {name, email, password } = await req.json();
    await dbConnect();

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}