import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, Plus, Search } from 'lucide-react';

export default function SystemUsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage all system users across schools</p>
        </div>
        <Button className="gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full rounded-lg border px-10 py-2 text-sm"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No users yet</h3>
          <p className="text-sm text-gray-500 mt-1">Users will appear here once schools are active</p>
        </div>
      </Card>
    </div>
  );
}
