import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/types/auth';
import { UserManagement } from '@/components/shared/UserManagement';
import { loadUsers, saveUsers, SystemUser } from './userData';

// Convert SystemUser to User type for compatibility with UserManagement
function toUser(sysUser: SystemUser): User {
  return {
    id: sysUser.id,
    email: sysUser.email,
    role: sysUser.role,
    firstName: sysUser.firstName,
    lastName: sysUser.lastName,
    isActive: sysUser.status === 'active',
    createdAt: sysUser.createdAt,
    updatedAt: sysUser.updatedAt,
    avatar: sysUser.avatar,
    schoolName: sysUser.schoolName,
  };
}

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>(() => loadUsers().map(toUser));
  const [isLoading, setIsLoading] = useState(false);

  const handleAddUser = () => {
    navigate('/system-admin/users/new');
  };

  const handleViewUser = (user: User) => {
    navigate(`/system-admin/users/${user.id}`);
  };

  const handleEditUser = (user: User) => {
    navigate(`/system-admin/users/${user.id}/edit`);
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        const currentUsers = loadUsers();
        const updated = currentUsers.filter((u) => u.id !== userId);
        saveUsers(updated);
        setUsers(updated.map(toUser));
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
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDeleteUser}
        title="System User Management"
        description="Manage all users across the system including administrators, teachers, students, and staff."
      />
    </div>
  );
}
