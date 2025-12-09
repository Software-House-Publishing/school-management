
import { connectDB } from "../../lib/db.js";
import { Student } from "../../lib/models/Student.js";
import { getUserFromRequest, assertRole, getJsonBody } from "../../lib/auth.js";

export default async function handler(req, res) {
  try {
    await connectDB();
    const currentUser = await getUserFromRequest(req);

    assertRole(currentUser, ["admin", "school_admin"]);

    if (req.method === "GET") {

      const { q } = req.query || {};
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

      const students = await Student.find(filter).sort({
        "enrollment.grade": 1,
        lastName: 1,
      });

      // map to match your frontend type (id as string)
      const mapped = students.map((s) => ({
        id: s._id.toString(),
        studentId: s.studentId,
        firstName: s.firstName,
        lastName: s.lastName,
        gender: s.gender,
        dateOfBirth: s.dateOfBirth,
        photoUrl: s.photoUrl,
        address: s.address,
        phone: s.phone,
        email: s.email,
        language: s.language,
        guardians: s.guardians,
        enrollment: s.enrollment,
        academics: s.academics,
        attendance: s.attendance,
        activities: s.activities,
        health: s.health,
        finance: s.finance,
        system: s.system,
        documents: s.documents,
      }));

      return res.status(200).json({ students: mapped });
    }

    if (req.method === "POST") {
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


      const lastStudent = await Student.findOne().sort({ studentId: -1 }).lean();

      let nextNumber = 1;
      if (lastStudent && lastStudent.studentId) {
        const match = lastStudent.studentId.match(/\d+/);
        if (match) {
          nextNumber = parseInt(match[0], 10) + 1;
        }
      }

      const newStudentId = `STU${String(nextNumber).padStart(3, "0")}`;

     
      const existing = await Student.findOne({ studentId: newStudentId });
      if (existing) {
        return res
          .status(500)
          .json({ message: "Generated student ID already exists, please retry." });
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

    return res.status(405).json({ message: "Method not allowed" });
  } catch (err) {
    console.error("Students index error:", err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || "Server error" });
  }
}
