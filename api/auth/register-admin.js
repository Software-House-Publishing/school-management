// api/auth/register-admin.js
import { connectDB } from "../../lib/db.js";
import { User } from "../../lib/models/User.js";
import { generateToken, getJsonBody } from "../../lib/auth.js";
import { validatePassword } from "../../lib/validators/passwordValidator.js";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectDB();

    const { name, email, password, setupSecret } = await getJsonBody(req);

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fields are required" });
    }

  
    const passwordValidation = validatePassword(password);
    
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        message: passwordValidation.message,
      });
    }

    
    const validatedPassword = passwordValidation.trimmedPassword;

    const existingAdmin = await User.findOne({ role: "system_administrator" });
    if (existingAdmin) {
      return res.status(403).json({
        message: "Admin user already exists. Admin registration is disabled after first setup.",
      });
    }

    const requiredSecret = process.env.ADMIN_SETUP_SECRET;
    
    if (requiredSecret) {
      if (!setupSecret) {
        return res.status(403).json({
          message: "Setup secret is required for admin registration",
        });
      }

      if (setupSecret !== requiredSecret) {
        return res.status(403).json({
          message: "Invalid setup secret",
        });
      }
    }

    // Check if user with this email already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    // Create system administrator user
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(validatedPassword, salt);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "system_administrator",
    });

    const token = generateToken(user._id);

    return res.status(201).json({
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
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}
