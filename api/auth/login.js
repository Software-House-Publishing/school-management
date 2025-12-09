// api/auth/login.js
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

    // body can be string or object depending on runtime
    const rawBody = req.body ?? {};
    const { email, password } =
      typeof rawBody === "string"
        ? JSON.parse(rawBody || "{}")
        : rawBody;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Invalid email or password" });
    }

    const token = generateToken(user._id);

    return res.json({
      message: "Login successful",
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res
      .status(500)
      .json({ message: err.message || "Server error" });
  }
}
