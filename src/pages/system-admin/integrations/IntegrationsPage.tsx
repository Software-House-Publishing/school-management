import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Plug, Plus, Check, AlertCircle } from 'lucide-react';

const integrations = [
  { name: 'Google Workspace', status: 'connected', description: 'SSO and Drive integration' },
  { name: 'Microsoft 365', status: 'available', description: 'Office apps and Teams' },
  { name: 'Zoom', status: 'connected', description: 'Video conferencing' },
  { name: 'Stripe', status: 'available', description: 'Payment processing' },
  { name: 'SendGrid', status: 'connected', description: 'Email notifications' },
  { name: 'Twilio', status: 'available', description: 'SMS notifications' },
];

export default function IntegrationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
          <p className="text-gray-600 mt-1">Connect third-party services to enhance functionality</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add Integration
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <Card key={integration.name}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Plug className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{integration.name}</h3>
                  <p className="text-sm text-gray-500">{integration.description}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
              {integration.status === 'connected' ? (
                <span className="inline-flex items-center gap-1 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  Connected
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm text-gray-500">
                  <AlertCircle className="w-4 h-4" />
                  Not connected
                </span>
              )}
              <Button variant="outline" size="sm">
                {integration.status === 'connected' ? 'Configure' : 'Connect'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
