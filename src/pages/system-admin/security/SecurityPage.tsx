import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Shield, Key, Lock, AlertTriangle, CheckCircle2, Eye } from 'lucide-react';

const securityItems = [
  { name: 'Two-Factor Authentication', status: 'enabled', description: 'Required for all admin users' },
  { name: 'Password Policy', status: 'enabled', description: 'Min 12 chars, special chars required' },
  { name: 'Session Timeout', status: 'enabled', description: '30 minutes of inactivity' },
  { name: 'IP Whitelist', status: 'disabled', description: 'Restrict access by IP address' },
  { name: 'Brute Force Protection', status: 'enabled', description: 'Lock after 5 failed attempts' },
];

const recentAlerts = [
  { type: 'warning', message: '3 failed login attempts from 45.33.32.156', time: '5 mins ago' },
  { type: 'info', message: 'Security scan completed successfully', time: '2 hours ago' },
  { type: 'success', message: 'SSL certificate renewed', time: '1 day ago' },
];

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Security</h1>
          <p className="text-gray-600 mt-1">Manage platform security settings and monitoring</p>
        </div>
        <Button className="gap-2">
          <Eye className="w-4 h-4" />
          Security Scan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-l-4 border-l-green-500">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-8 h-8 text-green-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">Secure</div>
              <div className="text-sm text-gray-500">Overall Status</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Lock className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">256-bit</div>
              <div className="text-sm text-gray-500">Encryption</div>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <Key className="w-8 h-8 text-purple-500" />
            <div>
              <div className="text-2xl font-bold text-gray-900">OAuth 2.0</div>
              <div className="text-sm text-gray-500">Authentication</div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
          <div className="space-y-4">
            {securityItems.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.status === 'enabled' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Recent Security Alerts</h3>
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <div key={index} className={`flex items-start gap-3 p-3 rounded-lg ${
                alert.type === 'warning' ? 'bg-amber-50' :
                alert.type === 'success' ? 'bg-green-50' : 'bg-blue-50'
              }`}>
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${
                  alert.type === 'warning' ? 'text-amber-600' :
                  alert.type === 'success' ? 'text-green-600' : 'text-blue-600'
                }`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
