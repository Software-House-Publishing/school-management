import { connectDB } from "../../lib/db.js";
import { Student } from "../../lib/models/Student.js";
import { getUserFromRequest, assertRole, getJsonBody } from "../../lib/auth.js";
import mongoose from "mongoose";

// Counter schema for atomic ID generation
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence: { type: Number, default: 0 }
});

const Counter = mongoose.models.Counter || mongoose.model("Counter", counterSchema);

/**
 * Initialize counter to match existing students
 */
async function initializeCounter() {
  try {
    // Check if counter already exists
    const existingCounter = await Counter.findOne({ _id: "studentId" });
    if (existingCounter) {
      return; // Counter already initialized
    }

    // Find the highest existing student ID
    const lastStudent = await Student.findOne()
      .sort({ studentId: -1 })
      .select("studentId")
      .lean();

    let startSequence = 0;
    if (lastStudent && lastStudent.studentId) {
      const match = lastStudent.studentId.match(/\d+/);
      if (match) {
        startSequence = parseInt(match[0], 10);
      }
    }

    // Initialize counter with the highest existing value
    await Counter.create({
      _id: "studentId",
      sequence: startSequence
    });

    console.log(`Counter initialized at ${startSequence}`);
  } catch (err) {
    // Counter might have been created by another request, which is fine
    if (err.code !== 11000) {
      console.error("Error initializing counter:", err);
    }
  }
}

/**
 * Atomically generates next student ID using MongoDB counter
 * @returns {Promise<string>} Next student ID (e.g., "STU001")
 */
async function getNextStudentId() {
  const counter = await Counter.findOneAndUpdate(
    { _id: "studentId" },
    { $inc: { sequence: 1 } },
    { 
      new: true,
      upsert: true,
      returnDocument: 'after'
    }
  );
  
  return `STU${String(counter.sequence).padStart(3, "0")}`;
}

/**
 * Ensures unique index on studentId field
 */
async function ensureStudentIdIndex() {
  try {
    await Student.collection.createIndex(
      { studentId: 1 }, 
      { unique: true, name: "studentId_unique" }
    );
  } catch (err) {
    // Index may already exist, which is fine
    if (err.code !== 85 && err.code !== 11000) {
      console.error("Error creating studentId index:", err);
    }
  }
}

// Initialize once on module load
let initPromise = null;

async function ensureInitialized() {
  if (!initPromise) {
    initPromise = (async () => {
      await ensureStudentIdIndex();
      await initializeCounter();
    })();
  }
  await initPromise;
}

export default async function handler(req, res) {
  try {
    await connectDB();
    await ensureInitialized();
    
    const currentUser = await getUserFromRequest(req);
    assertRole(currentUser, ["system_administrator", "school_administrator"]);

    if (req.method === "GET") {
      return getStudents(req, res);
    }

    if (req.method === "POST") {
      return createStudent(req, res);
    }

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("Students index error:", err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}

// 🔹 GET /api/students?q=...&page=1&limit=50
async function getStudents(req, res) {
  const { q, page = "1", limit = "50" } = req.query || {};

  // Build search filter
  let filter = {};
  if (q) {
    const regex = new RegExp(q, "i");
    filter = {
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { studentId: regex },
      ],
    };
  }

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 50;
  const skip = (pageNum - 1) * limitNum;

  // ⚡ Do count + data in parallel
  const [students, total] = await Promise.all([
    Student.find(filter)
      .select(
        "studentId firstName lastName gender dateOfBirth photoUrl address phone email language guardians enrollment academics attendance activities health finance system documents"
      )
      .sort({
        "enrollment.grade": 1,
        lastName: 1,
      })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Student.countDocuments(filter),
  ]);

  const mapped = students.map((s) => ({
    id: s._id.toString(),
    ...s,
  }));

  return res.status(200).json({
    students: mapped,
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum),
  });
}

// 🔹 POST /api/students
async function createStudent(req, res) {
  const body = await getJsonBody(req);

  const {
    firstName,
    lastName,
    guardians,
    enrollment,
    academics,
    attendance,
    activities,
    health,
    finance,
    system,
    documents,
    gender,
    dateOfBirth,
    photoUrl,
    address,
    phone,
    email,
    language,
  } = body;

  if (!firstName || !lastName) {
    return res
      .status(400)
      .json({ message: "firstName and lastName are required" });
  }

  // 🔢 Atomic ID generation with retry loop
  const MAX_RETRIES = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      // Get next ID atomically
      const newStudentId = await getNextStudentId();

      // Attempt to create student
      const student = await Student.create({
        studentId: newStudentId,
        firstName,
        lastName,
        gender,
        dateOfBirth,
        photoUrl,
        address,
        phone,
        email,
        language,
        guardians: guardians || [],
        enrollment: enrollment || {},
        academics: academics || { currentSubjects: [] },
        attendance: attendance || {},
        activities: activities || {},
        health: health || {},
        finance: finance || {},
        system: system || {},
        documents: documents || [],
      });

      // Success!
      return res.status(201).json({
        message: "Student created successfully",
        student: {
          id: student._id.toString(),
          ...student.toObject(),
        },
      });

    } catch (err) {
      lastError = err;
      
      // Check if it's a duplicate key error on studentId
      if (err.code === 11000 && err.keyPattern?.studentId) {
        console.warn(`Student ID collision on attempt ${attempt}/${MAX_RETRIES}, retrying...`);
        
        // If not last attempt, continue to retry
        if (attempt < MAX_RETRIES) {
          continue;
        }
      } else {
        // Different error, throw immediately
        console.error("Error creating student:", err);
        throw err;
      }
    }
  }

  // All retries exhausted
  console.error("Failed to create student after retries:", lastError);
  return res.status(500).json({
    message: "Unable to generate unique student ID after multiple attempts. Please try again.",
    error: lastError.message
  });
}
