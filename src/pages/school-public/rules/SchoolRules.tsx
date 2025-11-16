import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '@/components/layouts/Container';
import { Card } from '@/components/ui/Card';

interface SchoolRulesData {
  schoolName: string;
  lastUpdated: string;
  sections: Array<{
    title: string;
    content: string;
    subsections?: Array<{
      title: string;
      content: string;
    }>;
  }>;
}

export default function SchoolRules() {
  const { schoolId } = useParams<{ schoolId: string }>();
  const [rulesData, setRulesData] = useState<SchoolRulesData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch school rules from backend API
    const mockRulesData: SchoolRulesData = {
      schoolName: "Example School",
      lastUpdated: "January 2024",
      sections: [
        {
          title: "1. Attendance Policy",
          content: "Regular attendance is essential for academic success and is mandatory for all students.",
          subsections: [
            {
              title: "1.1 Daily Attendance",
              content: "Students must be present in school by 8:00 AM. Late arrivals must report to the office with a valid reason."
            },
            {
              title: "1.2 Leave Policy",
              content: "Parents must submit a written request for leave at least one day in advance. Medical leave requires a doctor's certificate."
            },
            {
              title: "1.3 Absence Consequences",
              content: "Unexplained absences will result in disciplinary action. Students with less than 75% attendance may not be allowed to take examinations."
            }
          ]
        },
        {
          title: "2. Code of Conduct",
          content: "All students are expected to maintain high standards of behavior and discipline.",
          subsections: [
            {
              title: "2.1 Respect and Courtesy",
              content: "Students must show respect to teachers, staff, and fellow students at all times."
            },
            {
              title: "2.2 Uniform Policy",
              content: "Students must wear the prescribed school uniform neatly and appropriately. Uniform must be clean and well-maintained."
            },
            {
              title: "2.3 Prohibited Items",
              content: "Mobile phones, electronic devices, and other prohibited items are not allowed on school premises without prior permission."
            }
          ]
        },
        {
          title: "3. Academic Integrity",
          content: "Students must maintain honesty and integrity in all academic work.",
          subsections: [
            {
              title: "3.1 Homework and Assignments",
              content: "All homework and assignments must be completed on time and represent the student's own work."
            },
            {
              title: "3.2 Examination Rules",
              content: "Cheating, copying, or any form of academic dishonesty will result in severe disciplinary action."
            }
          ]
        },
        {
          title: "4. Safety and Security",
          content: "Student safety is our top priority. All students must follow safety protocols.",
          subsections: [
            {
              title: "4.1 Emergency Procedures",
              content: "Students must participate in all emergency drills and follow instructions from staff during emergencies."
            },
            {
              title: "4.2 Visitor Policy",
              content: "All visitors must register at the office. Students should not interact with strangers on school premises."
            }
          ]
        },
        {
          title: "5. Disciplinary Actions",
          content: "Violations of school rules will result in appropriate disciplinary measures.",
          subsections: [
            {
              title: "5.1 Minor Offenses",
              content: "Minor offenses may result in warnings, parent meetings, or detention."
            },
            {
              title: "5.2 Major Offenses",
              content: "Major offenses may result in suspension, expulsion, or legal action as appropriate."
            }
          ]
        }
      ]
    };

    setTimeout(() => {
      setRulesData(mockRulesData);
      setLoading(false);
    }, 1000);
  }, [schoolId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!rulesData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">School Rules Not Found</h2>
          <p className="text-gray-600">The school rules you're looking for are not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container>
        <Card className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">School Rules & Regulations</h1>
            <h2 className="text-xl text-gray-600 mb-2">{rulesData.schoolName}</h2>
            <p className="text-sm text-gray-500">Last updated: {rulesData.lastUpdated}</p>
          </div>
          
          <div className="space-y-8">
            {rulesData.sections.map((section, index) => (
              <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{section.title}</h3>
                <p className="text-gray-600 mb-4">{section.content}</p>
                
                {section.subsections && (
                  <div className="ml-6 space-y-4">
                    {section.subsections.map((subsection, subIndex) => (
                      <div key={subIndex} className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">{subsection.title}</h4>
                        <p className="text-gray-600 text-sm">{subsection.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Important:</strong> These rules are subject to change. Students and parents will be notified 
              of any updates. For questions about these rules, please contact the school administration.
            </p>
          </div>
        </Card>
      </Container>
    </div>
  );
}