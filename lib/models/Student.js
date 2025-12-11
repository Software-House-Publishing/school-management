// lib/models/Student.js
import mongoose from "mongoose";

const guardianSchema = new mongoose.Schema(
  {
    name: String,
    relationship: String,
    phone: String,
    email: String,
    isEmergencyContact: Boolean,
  },
  { _id: false }
);

const enrollmentSchema = new mongoose.Schema(
  {
    admissionDate: String,
    grade: String,
    section: String,
    rollNumber: String,
    status: {
      type: String,
      enum: ["active", "graduated", "transferred", "withdrawn"],
      default: "active",
    },
    previousSchool: String,
    homeroomTeacher: String,
  },
  { _id: false }
);

const academicSchema = new mongoose.Schema(
  {
    gpa: Number,
    currentSubjects: [String],
    lastExamScore: Number,
    remarks: String,
  },
  { _id: false }
);

const attendanceSchema = new mongoose.Schema(
  {
    totalDays: Number,
    presentDays: Number,
    absentDays: Number,
    attendancePercentage: Number,
    lastAbsentDate: String,
  },
  { _id: false }
);

const activitiesSchema = new mongoose.Schema(
  {
    clubs: [String],
    sports: [String],
    awards: [String],
    disciplineNotes: String,
  },
  { _id: false }
);

const healthSchema = new mongoose.Schema(
  {
    allergies: String,
    medicalNotes: String,
    emergencyInstructions: String,
  },
  { _id: false }
);

const financeSchema = new mongoose.Schema(
  {
    feePlan: String,
    totalDue: Number,
    totalPaid: Number,
    outstanding: Number,
    lastPaymentDate: String,
    scholarship: String,
  },
  { _id: false }
);

const systemSchema = new mongoose.Schema(
  {
    portalUsername: String,
    portalActive: Boolean,
    rfidCardId: String,
  },
  { _id: false }
);

const documentSchema = new mongoose.Schema(
  {
    type: String,
    uploaded: Boolean,
    uploadDate: String,
    notes: String,
  },
  { _id: false }
);

const studentSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: String,
    dateOfBirth: String,
    photoUrl: String,
    address: String,
    phone: String,
    email: String,
    language: String,

    guardians: [guardianSchema],
    enrollment: enrollmentSchema,
    academics: academicSchema,
    attendance: attendanceSchema,
    activities: activitiesSchema,
    health: healthSchema,
    finance: financeSchema,
    system: systemSchema,
    documents: [documentSchema],
  },
  { timestamps: true }
);

export const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;
