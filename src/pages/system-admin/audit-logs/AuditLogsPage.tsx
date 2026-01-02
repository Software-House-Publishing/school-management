import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScrollText, Search, Download, Filter } from 'lucide-react';

const mockLogs = [
  { id: 1, action: 'User Login', user: 'admin@example.com', ip: '192.168.1.1', time: '2 mins ago', status: 'success' },
  { id: 2, action: 'School Created', user: 'admin@example.com', ip: '192.168.1.1', time: '1 hour ago', status: 'success' },
  { id: 3, action: 'Permission Changed', user: 'john@school.edu', ip: '10.0.0.5', time: '3 hours ago', status: 'warning' },
  { id: 4, action: 'Failed Login Attempt', user: 'unknown@test.com', ip: '45.33.32.156', time: '5 hours ago', status: 'error' },
  { id: 5, action: 'Settings Updated', user: 'admin@example.com', ip: '192.168.1.1', time: '1 day ago', status: 'success' },
];

export default function AuditLogsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
          <p className="text-gray-600 mt-1">Track all system activities and changes</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export Logs
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full rounded-lg border px-10 py-2 text-sm"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Action</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">IP Address</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Time</th>
                <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{log.action}</td>
                  <td className="px-4 py-3 text-gray-600">{log.user}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{log.ip}</td>
                  <td className="px-4 py-3 text-gray-500">{log.time}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-700' :
                      log.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
