import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StudentForm } from '@/components/shared/users/StudentForm';
import { Student } from '@/pages/school/students/studentData';
import { createMockStudent } from '@/utils/mockData';



export default function StudentCreate() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(data: Partial<Student>) {
    try {
      setLoading(true);
      setError(null);

      // The StudentForm returns a payload that matches mostly Student structure
      // We rely on createMockStudent to handle ID generation if missing
      await createMockStudent(data as Student);

      navigate('/school-admin/students');
    } catch (err: unknown) {
      console.error(err);
      const message = err instanceof Error ? err.message : 'Failed to create student';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <StudentForm
      title="Add New Student"
      loading={loading}
      error={error}
      onCancel={() => navigate('/school-admin/students')}
      onSubmit={handleSubmit}
      saveButtonText="Create Student"
    />
  );
}

