// src/routes/userRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

/**
 * Create School Admin
 * Only system Admin can do this
 * POST /api/users/create-school-admin
 * body: { name, email, password }
 */
router.post(
  "/create-school-admin",
  requireAuth,
  requireRole("admin"), // only highest power
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

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
        role: "school_admin",
        // later: schoolId: ...
        createdBy: req.user._id,
      });

      res.status(201).json({
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
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * Create Teacher
 * Allowed: admin OR school_admin
 * POST /api/users/create-teacher
 * body: { name, email, password }
 */
router.post(
  "/create-teacher",
  requireAuth,
  requireRole("admin", "school_admin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

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
        role: "teacher",
        // schoolId: req.user.schoolId (later when we have school setup)
        createdBy: req.user._id,
      });

      res.status(201).json({
        message: "Teacher created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Create teacher error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/**
 * Create Student
 * Allowed: admin OR school_admin
 * POST /api/users/create-student
 * body: { name, email, password }
 */
router.post(
  "/create-student",
  requireAuth,
  requireRole("admin", "school_admin"),
  async (req, res) => {
    try {
      const { name, email, password } = req.body;

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
        role: "student",
        // schoolId: req.user.schoolId (later)
        createdBy: req.user._id,
      });

      res.status(201).json({
        message: "Student created successfully",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (err) {
      console.error("Create student error:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
