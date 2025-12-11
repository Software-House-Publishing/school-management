// api/users/create-school-admin.js
import { connectDB } from "../../lib/db.js";
import { User } from "../../lib/models/User.js";
import {
  getUserFromRequest,
  assertRole,
  getJsonBody,
} from "../../lib/auth.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const currentUser = await getUserFromRequest(req);
    assertRole(currentUser, ["admin"]); // only top admin can create school_admin

    const { name, email, password } = await getJsonBody(req);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
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
      role: "school_admin",
      createdBy: currentUser._id,
    });

    return res.status(201).json({
      message: "School Admin created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Create school admin error:", err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}
