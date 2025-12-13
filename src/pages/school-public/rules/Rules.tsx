import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';

export default function Rules() {

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <Card className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">School Rules & Regulations</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold mb-4">General Conduct</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Students must maintain respectful behavior towards teachers, staff, and fellow students</li>
                <li>Punctuality is mandatory for all classes and school activities</li>
                <li>Proper uniform/dress code must be maintained at all times</li>
                <li>Mobile phones and electronic devices must be used responsibly and only during designated times</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Academic Requirements</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Regular attendance is compulsory (minimum 85% attendance required)</li>
                <li>All assignments and projects must be submitted on time</li>
                <li>Students must maintain minimum passing grades in all subjects</li>
                <li>Cheating and plagiarism are strictly prohibited</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Safety & Security</h2>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Students must follow all safety protocols and emergency procedures</li>
                <li>Unauthorized entry into restricted areas is prohibited</li>
                <li>Any suspicious activity must be reported to school authorities immediately</li>
                <li>Personal belongings should be properly secured</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">Disciplinary Actions</h2>
              <p className="text-gray-600 mb-4">
                Violation of school rules may result in disciplinary actions including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Verbal warning</li>
                <li>Written warning</li>
                <li>Parent/guardian meeting</li>
                <li>Suspension</li>
                <li>Expulsion (in severe cases)</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> These rules are subject to change. Students and parents will be notified 
              of any updates through official school communication channels.
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}