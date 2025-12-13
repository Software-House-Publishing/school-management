import { useState } from 'react';
import { User } from '@/types/auth';
import { UserManagement } from '@/components/shared/UserManagement';

// Mock data for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@school.com',
    role: 'school_administrator',
    firstName: 'Sarah',
    lastName: 'Connor',
    isActive: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    email: 'director@school.com',
    role: 'system_administrator',
    firstName: 'James',
    lastName: 'Cameron',
    isActive: true,
    createdAt: '2023-11-20T09:30:00Z',
    updatedAt: '2023-11-20T09:30:00Z',
  },
  {
    id: '3',
    email: 'teacher.math@school.com',
    role: 'teacher',
    firstName: 'John',
    lastName: 'Nash',
    isActive: true,
    createdAt: '2024-02-01T08:15:00Z',
    updatedAt: '2024-02-01T08:15:00Z',
  },
  {
    id: '4',
    email: 'student.1@school.com',
    role: 'student',
    firstName: 'Peter',
    lastName: 'Parker',
    isActive: true,
    createdAt: '2024-03-10T11:45:00Z',
    updatedAt: '2024-03-10T11:45:00Z',
  },
  {
    id: '5',
    email: 'finance@school.com',
    role: 'finance_officer',
    firstName: 'Gordon',
    lastName: 'Gekko',
    isActive: false,
    createdAt: '2023-12-05T14:20:00Z',
    updatedAt: '2023-12-05T14:20:00Z',
  },
  {
    id: '6',
    email: 'manager@school.com',
    role: 'manager',
    firstName: 'Michael',
    lastName: 'Scott',
    isActive: true,
    createdAt: '2024-01-05T13:10:00Z',
    updatedAt: '2024-01-05T13:10:00Z',
  }
];

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = () => {
    // Logic to open add user modal would go here
    console.log('Add user clicked');
    alert('Add User functionality would open a modal here');
  };

  const handleEditUser = (user: User) => {
    // Logic to open edit user modal would go here
    console.log('Edit user', user);
    alert(`Editing user: ${user.firstName} ${user.lastName}`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setUsers(users.filter(u => u.id !== userId));
        setIsLoading(false);
      }, 500);
    }
  };

  return (
    <div className="p-6">
      <UserManagement
        users={users}
        isLoading={isLoading}
        onAddUser={handleAddUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        title="System User Management"
        description="Manage all users across the system including administrators, teachers, students, and staff."
      />
    </div>
  );
}
