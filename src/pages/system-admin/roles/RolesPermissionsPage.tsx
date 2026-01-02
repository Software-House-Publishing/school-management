import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { KeyRound, Plus, Shield } from 'lucide-react';

const defaultRoles = [
  { name: 'System Administrator', permissions: 'Full access', users: 2 },
  { name: 'School Administrator', permissions: 'School management', users: 15 },
  { name: 'Teacher', permissions: 'Course & student management', users: 120 },
  { name: 'Student', permissions: 'View only', users: 850 },
];

export default function RolesPermissionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">Configure system roles and access permissions</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Create Role
        </Button>
      </div>

      <div className="grid gap-4">
        {defaultRoles.map((role) => (
          <Card key={role.name} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500">{role.permissions}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{role.users} users</span>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
