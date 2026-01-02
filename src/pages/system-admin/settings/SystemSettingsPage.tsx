import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Wrench, Globe, Mail, Database, Clock, Shield } from 'lucide-react';

const settingsSections = [
  {
    name: 'General Settings',
    description: 'Platform name, timezone, and locale',
    icon: Globe,
    items: ['Platform Name', 'Default Timezone', 'Default Language']
  },
  {
    name: 'Email Configuration',
    description: 'SMTP settings and email templates',
    icon: Mail,
    items: ['SMTP Server', 'Sender Email', 'Email Templates']
  },
  {
    name: 'Database',
    description: 'Backup and maintenance settings',
    icon: Database,
    items: ['Auto Backup', 'Retention Period', 'Maintenance Window']
  },
  {
    name: 'Security',
    description: 'Password policies and session management',
    icon: Shield,
    items: ['Password Policy', 'Session Timeout', '2FA Settings']
  },
];

export default function SystemSettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">Configure global system preferences</p>
        </div>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-6">
        {settingsSections.map((section) => (
          <Card key={section.name}>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <section.icon className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{section.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{section.description}</p>
                <div className="mt-4 space-y-3">
                  {section.items.map((item) => (
                    <div key={item} className="flex items-center justify-between py-2 border-b last:border-0">
                      <span className="text-sm text-gray-700">{item}</span>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
