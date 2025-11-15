export interface School {
  id: string;
  name: string;
  code: string;
  type: SchoolType;
  address: Address;
  contact: ContactInfo;
  settings: SchoolSettings;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  website?: string;
}

export interface SchoolSettings {
  timezone: string;
  locale: 'en' | 'my';
  academicYear: string;
  gradingSystem: 'percentage' | 'letter' | 'gpa';
}

export type SchoolType = 
  | 'private_school'
  | 'public_school'
  | 'university'
  | 'private_tuition'
  | 'language_school'
  | 'other';

export interface Course {
  id: string;
  schoolId: string;
  title: string;
  description: string;
  code: string;
  credits: number;
  level: string;
  teacherId: string;
  isActive: boolean;
  startDate: string;
  endDate: string;
  maxStudents: number;
  enrolledStudents: number;
  createdAt: string;
  updatedAt: string;
}

export interface Student {
  id: string;
  userId: string;
  schoolId: string;
  studentId: string;
  grade: string;
  enrollmentDate: string;
  guardianName?: string;
  guardianContact?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Teacher {
  id: string;
  userId: string;
  schoolId: string;
  employeeId: string;
  department: string;
  specialization: string[];
  hireDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}