// api/auth/register-admin.js
import { connectDB } from "../../lib/db.js";
import { User } from "../../lib/models/User.js";
import { generateToken } from "../../lib/auth.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, password } = JSON.parse(req.body || "{}");

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "admin", // director in frontend mapping
    });

    const token = generateToken(user._id);

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register admin error:", err);
    res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}
