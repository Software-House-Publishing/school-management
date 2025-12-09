import { connectDB } from "../../lib/db.js";
import { Student } from "../../lib/models/Student.js";
import { getUserFromRequest, assertRole, getJsonBody } from "../../lib/auth.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    const currentUser = await getUserFromRequest(req);

    assertRole(currentUser, ["admin", "school_admin"]);

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
      // ⬇️ Only fields your list/detail actually needs
      .select(
        "studentId firstName lastName gender dateOfBirth photoUrl address phone email language guardians enrollment academics attendance activities health finance system documents"
      )
      .sort({
        "enrollment.grade": 1,
        lastName: 1,
      })
      .skip(skip)
      .limit(limitNum)
      .lean(), // ⚡ plain JS objects (much cheaper than Mongoose docs)
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

  // 🔢 Auto-generate next studentId: STU001, STU002, ...
  const lastStudent = await Student.findOne().sort({ studentId: -1 }).lean();

  let nextNumber = 1;
  if (lastStudent && lastStudent.studentId) {
    const match = lastStudent.studentId.match(/\d+/);
    if (match) {
      nextNumber = parseInt(match[0], 10) + 1;
    }
  }

  const newStudentId = `STU${String(nextNumber).padStart(3, "0")}`;

  const existing = await Student.findOne({ studentId: newStudentId }).lean();
  if (existing) {
    return res.status(500).json({
      message: "Generated student ID already exists, please retry.",
    });
  }

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

  return res.status(201).json({
    message: "Student created successfully",
    student: {
      id: student._id.toString(),
      ...student.toObject(),
    },
  });
}
