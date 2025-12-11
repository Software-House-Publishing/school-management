// api/students/[id].js
import { connectDB } from '../../lib/db.js';
import { Student } from '../../lib/models/Student.js';
import {
  getUserFromRequest,
  assertRole,
  getJsonBody,
} from '../../lib/auth.js';
import {
  sanitizeFields,
  ensureNoProtectedFields,
  FIELD_WHITELISTS,
} from '../../lib/utils/sanitizer.js';

export default async function handler(req, res) {
  const { id } = req.query || {};

  if (!id) {
    return res.status(400).json({ message: 'Student id is required' });
  }

  try {
    await connectDB();
    const currentUser = await getUserFromRequest(req);
    // Only admin & school_admin can manage students
    assertRole(currentUser, ['admin', 'school_admin']);

    if (req.method === 'GET') {
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      return res.status(200).json({
        student: {
          id: student._id.toString(),
          ...student.toObject(),
        },
      });
    }

    if (req.method === 'PUT') {
      const rawUpdates = await getJsonBody(req);

      // 🔒 Security checks
      ensureNoProtectedFields(rawUpdates);
      
      // 🔒 Sanitize to only allowed fields
      // Note: This properly handles arrays like guardians, documents, activities
      const sanitizedUpdates = sanitizeFields(
        rawUpdates,
        FIELD_WHITELISTS.student,
        {
          strict: true,        // Error if no valid fields
          logRejected: process.env.NODE_ENV === 'development', // Log only in dev
        }
      );

      const student = await Student.findByIdAndUpdate(
        id,
        sanitizedUpdates,
        {
          new: true,
          runValidators: true, // Run schema validators
        }
      );

      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }

      return res.status(200).json({
        message: 'Student updated successfully',
        student: {
          id: student._id.toString(),
          ...student.toObject(),
        },
      });
    }

    if (req.method === 'DELETE') {
      const existing = await Student.findById(id);
      if (!existing) {
        return res.status(404).json({ message: 'Student not found' });
      }

      await Student.findByIdAndDelete(id);
      return res
        .status(200)
        .json({ message: 'Student deleted successfully' });
    }

    // Any other method
    return res.status(405).json({ message: 'Method not allowed' });
  } catch (err) {
    console.error('Student detail error:', err);
    return res
      .status(err.statusCode || 500)
      .json({ message: err.message || 'Server error' });
  }
}