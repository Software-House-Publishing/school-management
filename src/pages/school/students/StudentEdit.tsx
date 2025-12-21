import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { StudentForm } from '@/components/shared/users/StudentForm';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Student } from '@/pages/school/students/studentData';
import { fetchMockStudentById, updateMockStudent } from '@/utils/mockData';

export default function StudentEdit() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- Load existing student from backend ----------
  useEffect(() => {
    async function fetchStudent() {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const s = await fetchMockStudentById(id);
        setStudent(s);
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Failed to load student');
      } finally {
        setLoading(false);
      }
    }

    fetchStudent();
  }, [id]);

  async function handleSubmit(data: Partial<Student>) {
    if (!student || !id) return;

    try {
      await updateMockStudent(id, data);
      navigate(`/school-admin/students/${id}`);
    } catch (err: unknown) {
      console.error(err);
      alert(err instanceof Error ? err.message : 'Failed to update student');
    }
  }

  // ---------- Loading / error states (Pre-form) ----------
  if (loading) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/students')}
        >
          ← Back to Students
        </Button>
        <Card padding="lg">
          <p className="text-sm text-muted-foreground">Loading student...</p>
        </Card>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="space-y-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/school-admin/students')}
        >
          ← Back to Students
        </Button>
        <Card padding="lg">
          <p className="text-sm text-red-600">
            {error || 'Student not found.'}
          </p>
        </Card>
      </div>
    );
  }

  // ---------- Main form ----------
  return (
    <StudentForm
      title={`Edit Student – ${student.firstName} ${student.lastName}`}
      loading={false}
      error={null}
      initialData={student}
      onCancel={() => navigate(`/school-admin/students/${student.id}`)}
      onSubmit={handleSubmit}
      saveButtonText="Save Changes"
      backButtonText="Cancel"
    />
  );
}
