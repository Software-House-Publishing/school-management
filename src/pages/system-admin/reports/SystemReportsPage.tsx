import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BarChart3, Download, FileText, TrendingUp, Users, Building2 } from 'lucide-react';

const reportTypes = [
  { name: 'Schools Overview', description: 'Summary of all schools and their status', icon: Building2 },
  { name: 'User Analytics', description: 'User activity and engagement metrics', icon: Users },
  { name: 'Growth Report', description: 'Platform growth and adoption trends', icon: TrendingUp },
  { name: 'System Usage', description: 'Resource utilization and performance', icon: BarChart3 },
];

export default function SystemReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Generate and download system reports</p>
        </div>
        <Button className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {reportTypes.map((report) => (
          <Card key={report.name} className="hover:shadow-md transition-shadow cursor-pointer">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <report.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{report.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{report.description}</p>
                <Button variant="outline" size="sm" className="mt-3 gap-2">
                  <FileText className="w-3 h-3" />
                  Generate
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
