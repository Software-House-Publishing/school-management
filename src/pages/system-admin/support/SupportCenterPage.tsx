import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { HeadphonesIcon, Search, MessageCircle, Clock, CheckCircle2 } from 'lucide-react';

const mockTickets = [
  { id: 'TKT-001', subject: 'Login issues at Main School', priority: 'high', status: 'open', created: '2 hours ago' },
  { id: 'TKT-002', subject: 'Report generation failing', priority: 'medium', status: 'in_progress', created: '1 day ago' },
  { id: 'TKT-003', subject: 'Request for new feature', priority: 'low', status: 'open', created: '2 days ago' },
  { id: 'TKT-004', subject: 'Billing question', priority: 'medium', status: 'resolved', created: '3 days ago' },
];

export default function SupportCenterPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Center</h1>
          <p className="text-gray-600 mt-1">Manage support tickets from schools</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="text-center">
          <div className="text-3xl font-bold text-gray-900">12</div>
          <div className="text-sm text-gray-500 mt-1">Open Tickets</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-amber-600">5</div>
          <div className="text-sm text-gray-500 mt-1">In Progress</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-green-600">48</div>
          <div className="text-sm text-gray-500 mt-1">Resolved (30d)</div>
        </Card>
        <Card className="text-center">
          <div className="text-3xl font-bold text-blue-600">2.4h</div>
          <div className="text-sm text-gray-500 mt-1">Avg Response</div>
        </Card>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tickets..."
              className="w-full rounded-lg border px-10 py-2 text-sm"
            />
          </div>
        </div>

        <div className="space-y-3">
          {mockTickets.map((ticket) => (
            <div key={ticket.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
              <div className="flex items-center gap-4">
                <MessageCircle className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-500">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      ticket.priority === 'high' ? 'bg-red-100 text-red-700' :
                      ticket.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                      'bg-gray-100 text-gray-600'
                    }`}>{ticket.priority}</span>
                  </div>
                  <p className="font-medium text-gray-900 mt-1">{ticket.subject}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{ticket.created}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  ticket.status === 'open' ? 'bg-blue-100 text-blue-700' :
                  ticket.status === 'in_progress' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {ticket.status === 'resolved' && <CheckCircle2 className="w-3 h-3" />}
                  {ticket.status === 'in_progress' && <Clock className="w-3 h-3" />}
                  {ticket.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
