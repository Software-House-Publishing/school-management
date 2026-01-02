import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Activity, Server, Database, Wifi, HardDrive, Cpu, RefreshCw, CheckCircle2 } from 'lucide-react';

const systemMetrics = [
  { name: 'API Server', status: 'operational', uptime: '99.99%', icon: Server },
  { name: 'Database', status: 'operational', uptime: '99.98%', icon: Database },
  { name: 'CDN', status: 'operational', uptime: '100%', icon: Wifi },
  { name: 'Storage', status: 'operational', uptime: '99.99%', icon: HardDrive },
];

const resourceUsage = [
  { name: 'CPU Usage', value: 42, max: 100, unit: '%' },
  { name: 'Memory', value: 6.2, max: 16, unit: 'GB' },
  { name: 'Storage', value: 234, max: 500, unit: 'GB' },
  { name: 'Bandwidth', value: 1.2, max: 10, unit: 'TB' },
];

export default function SystemHealthPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
          <p className="text-gray-600 mt-1">Monitor system performance and status</p>
        </div>
        <Button variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <Card className="border-l-4 border-l-green-500">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-50 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Systems Operational</h2>
            <p className="text-gray-500">Last checked: Just now</p>
          </div>
        </div>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name}>
            <div className="flex items-center justify-between mb-3">
              <metric.icon className="w-5 h-5 text-gray-400" />
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {metric.status}
              </span>
            </div>
            <h3 className="font-semibold text-gray-900">{metric.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Uptime: {metric.uptime}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-6">Resource Usage</h3>
        <div className="grid gap-6 md:grid-cols-2">
          {resourceUsage.map((resource) => (
            <div key={resource.name}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{resource.name}</span>
                <span className="text-sm text-gray-500">
                  {resource.value} / {resource.max} {resource.unit}
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    (resource.value / resource.max) > 0.8 ? 'bg-red-500' :
                    (resource.value / resource.max) > 0.6 ? 'bg-amber-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${(resource.value / resource.max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="font-semibold text-gray-900 mb-4">Recent Events</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-500">12:45 PM</span>
            <span className="text-gray-900">Automated backup completed successfully</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-gray-500">11:30 AM</span>
            <span className="text-gray-900">System update installed (v2.4.1)</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-500">09:00 AM</span>
            <span className="text-gray-900">Daily health check passed</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
