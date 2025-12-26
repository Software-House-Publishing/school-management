import { useState, useEffect } from 'react';
import { User } from '@/types/auth';
import { UserManagement } from '@/components/shared/UserManagement';
import { useAuthStore } from '@/stores/authStore';

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

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
  const { user: currentUser, token } = useAuthStore();
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // only fetch from API if signed-in user is system admin
    if (!currentUser || !token) return;
    // check role - only allow system administrators to manage users
    if (currentUser.role !== 'system_administrator' && currentUser.role !== 'school_administrator') {
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          console.error('Failed to fetch users', await res.text());
          setIsLoading(false);
          return;
        }
        const data = await res.json();
        // map to User[] shape
        const mapped: User[] = data.map((u: any) => ({
          id: u.id,
          email: u.email,
          role: (Array.isArray(u.roles) && u.roles[0]) || 'school_administrator',
          firstName: '',
          lastName: '',
          isActive: u.status === 'active',
          createdAt: u.createdAt,
          updatedAt: u.createdAt,
        }));
        setUsers(mapped);
      } catch (err) {
        console.error('Error fetching users', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser, token]);

  const handleAddUser = () => {
    if (!currentUser || !token) {
      alert('You must be signed in as an administrator to add users');
      return;
    }

    if (currentUser.role !== 'system_administrator' && currentUser.role !== 'school_administrator') {
      alert('Only administrators can add users');
      return;
    }

    // Simple prompt-based add (replace with modal in UI later)
    const email = window.prompt('Email for new user (required)');
    if (!email) return;
    const password = window.prompt('Temporary password (required)');
    if (!password) return;
    const role = window.prompt('Role for new user (e.g. teacher, student, school_administrator)', 'teacher');

    setIsLoading(true);
    fetch(`${API_BASE_URL}/api/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ email, password, roles: [role] }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'failed to create user');
        }
        return res.json();
      })
      .then((created) => {
        // append to users list
        const newUser: User = {
          id: created.id,
          email: created.email,
          role: (Array.isArray(created.roles) && created.roles[0]) || 'teacher',
          firstName: '',
          lastName: '',
          isActive: created.status === 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUsers((s) => [newUser, ...s]);
      })
      .catch((err) => {
        console.error('Failed to create user', err);
        alert('Failed to create user: ' + (err instanceof Error ? err.message : String(err)));
      })
      .finally(() => setIsLoading(false));
  };

  const handleEditUser = (user: User) => {
    if (!currentUser || !token) {
      alert('You must be signed in as an administrator to edit users');
      return;
    }
    if (currentUser.role !== 'system_administrator' && currentUser.role !== 'school_administrator') {
      alert('Only administrators can edit users');
      return;
    }

    // Simple prompt-based edit (replace with modal later)
    const newEmail = window.prompt('Email', user.email) ?? user.email;
    const newRole = window.prompt('Role', user.role) ?? user.role;
    const newStatusPrompt = window.prompt('Status (active/inactive)', user.isActive ? 'active' : 'inactive') ?? (user.isActive ? 'active' : 'inactive');
    const newStatus = newStatusPrompt === 'active' ? 'active' : 'inactive';
    const newPassword = window.prompt('New password (leave blank to keep current)');

    // If nothing changed, skip
    if (
      newEmail === user.email &&
      newRole === user.role &&
      newStatus === (user.isActive ? 'active' : 'inactive') &&
      (!newPassword || newPassword === '')
    ) {
      return;
    }

    setIsLoading(true);
    const body: any = {};
    if (newEmail !== user.email) body.email = newEmail;
    if (newRole !== user.role) body.roles = [newRole];
    if (newStatus !== (user.isActive ? 'active' : 'inactive')) body.status = newStatus;
    if (newPassword && newPassword.length > 0) body.password = newPassword;

    fetch(`${API_BASE_URL}/api/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || 'failed to update user');
        }
        return res.json();
      })
      .then((updated) => {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, email: updated.email || u.email, role: (Array.isArray(updated.roles) && updated.roles[0]) || u.role, isActive: updated.status === 'active' } : u)));
      })
      .catch((err) => {
        console.error('Failed to update user', err);
        alert('Failed to update user: ' + (err instanceof Error ? err.message : String(err)));
      })
      .finally(() => setIsLoading(false));
  };

  const handleDeleteUser = (userId: string) => {
    if (!currentUser || !token) {
      alert('You must be signed in as an administrator to delete users');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      setIsLoading(true);
      fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error('delete failed');
          setUsers((prev) => prev.filter((u) => u.id !== userId));
        })
        .catch((err) => {
          console.error('Failed to delete user', err);
          alert('Failed to delete user');
        })
        .finally(() => setIsLoading(false));
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
