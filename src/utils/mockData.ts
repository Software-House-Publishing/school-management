import { User } from '@/types/auth';
import { Student } from '@/pages/school/students/studentData'; // Import Student type

// Extended User type to include specific fields for students and teachers
export interface ExtendedUser extends User {
    studentClass?: string; // For students e.g., "10-A"
    parentEmail?: string; // For students
    subject?: string; // For teachers
    coursesCount?: number; // For teachers
}

const MOCK_STUDENTS: ExtendedUser[] = [
    {
        id: '1', // Matches URL param often used
        firstName: 'Emma',
        lastName: 'Thompson',
        email: 'emma.t@student.school.edu',
        role: 'student',
        schoolName: 'St. Mary’s High School',
        studentClass: '10-A',
        parentEmail: 'susan.t@gmail.com',
        isActive: true,
        createdAt: '2024-01-15T08:00:00Z',
        updatedAt: '2024-01-15T08:00:00Z',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '2',
        firstName: 'Liam',
        lastName: 'Wilson',
        email: 'liam.w@student.school.edu',
        role: 'student',
        schoolName: 'St. Mary’s High School',
        studentClass: '10-B',
        parentEmail: 'mark.w@yahoo.com',
        isActive: true,
        createdAt: '2024-01-16T09:00:00Z',
        updatedAt: '2024-01-16T09:00:00Z',
    },
    {
        id: '3',
        firstName: 'Olivia',
        lastName: 'Martinez',
        email: 'olivia.m@student.school.edu',
        role: 'student',
        schoolName: 'St. Mary’s High School',
        studentClass: '11-A',
        parentEmail: 'maria.m@hotmail.com',
        isActive: false,
        createdAt: '2024-01-20T10:30:00Z',
        updatedAt: '2024-02-01T14:20:00Z',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '4',
        firstName: 'Noah',
        lastName: 'Brown',
        email: 'noah.b@student.school.edu',
        role: 'student',
        schoolName: 'Westover Academy',
        studentClass: '9-C',
        parentEmail: 'james.b@gmail.com',
        isActive: true,
        createdAt: '2024-02-10T11:00:00Z',
        updatedAt: '2024-02-10T11:00:00Z',
    },
    {
        id: '5',
        firstName: 'Ava',
        lastName: 'Davis',
        email: 'ava.d@student.school.edu',
        role: 'student',
        schoolName: 'Westover Academy',
        studentClass: '12-B',
        parentEmail: 'linda.d@gmail.com',
        isActive: true,
        createdAt: '2023-09-01T08:00:00Z',
        updatedAt: '2023-09-01T08:00:00Z',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
];

const MOCK_TEACHERS: ExtendedUser[] = [
    {
        id: 'TCH-2024-001',
        firstName: 'Robert',
        lastName: 'Smith',
        email: 'robert.smith@school.edu',
        role: 'teacher',
        schoolName: 'St. Mary’s High School',
        subject: 'Mathematics',
        coursesCount: 5,
        isActive: true,
        createdAt: '2020-08-15T09:00:00Z',
        updatedAt: '2023-08-20T10:00:00Z',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 'TCH-2024-002',
        firstName: 'Jennifer',
        lastName: 'Johnson',
        email: 'jennifer.j@school.edu',
        role: 'teacher',
        schoolName: 'St. Mary’s High School',
        subject: 'English Literature',
        coursesCount: 3,
        isActive: true,
        createdAt: '2019-05-12T08:30:00Z',
        updatedAt: '2023-09-01T09:00:00Z',
    },
    {
        id: 'TCH-2024-003',
        firstName: 'David',
        lastName: 'Williams',
        email: 'david.w@school.edu',
        role: 'teacher',
        schoolName: 'Westover Academy',
        subject: 'Physics',
        coursesCount: 4,
        isActive: false, // On leave
        createdAt: '2021-01-10T14:00:00Z',
        updatedAt: '2024-01-15T11:30:00Z',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: 'TCH-2024-004',
        firstName: 'Susan',
        lastName: 'Jones',
        email: 'susan.j@school.edu',
        role: 'teacher',
        schoolName: 'Westover Academy',
        subject: 'History',
        coursesCount: 2,
        isActive: true,
        createdAt: '2018-03-22T08:15:00Z',
        updatedAt: '2023-11-05T16:00:00Z',
    }
];

export const fetchMockStudents = async (): Promise<ExtendedUser[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_STUDENTS);
        }, 300);
    });
};

export const fetchMockTeachers = async (): Promise<ExtendedUser[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_TEACHERS);
        }, 300);
    });
};

export const fetchMockUsers = async (): Promise<ExtendedUser[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...MOCK_STUDENTS, ...MOCK_TEACHERS]);
        }, 300);
    });
}

// ----------------------------------------------------------------------
// FULL STUDENT MOCK CRUD (Simulating Backend)
// ----------------------------------------------------------------------

// Helper to create a full student object from the basic ExtendedUser
function extendToFullStudent(baseUser: ExtendedUser): Student {
    return {
        id: baseUser.id,
        studentId: baseUser.id,
        firstName: baseUser.firstName,
        lastName: baseUser.lastName,
        email: baseUser.email,
        gender: 'Female', // Mock default
        dateOfBirth: '2008-01-01', // Mock default
        phone: '+1 234 567 890',
        address: '123 School Lane, Cityville',
        language: 'English',
        photoUrl: baseUser.avatar,

        guardians: baseUser.parentEmail ? [
            {
                name: 'Parent of ' + baseUser.firstName,
                relationship: 'Parent',
                phone: '+1 987 654 321',
                email: baseUser.parentEmail,
                isEmergencyContact: true,
            }
        ] : [],

        enrollment: {
            admissionDate: '2020-09-01',
            grade: baseUser.studentClass?.split('-')[0] || '10',
            section: baseUser.studentClass?.split('-')[1] || 'A',
            status: baseUser.isActive ? 'active' : 'withdrawn',
        },

        academics: {
            gpa: 3.5,
            currentSubjects: ['Math', 'Science', 'English'],
            lastExamScore: 88,
            remarks: 'Doing well in class.',
        },

        attendance: {
            totalDays: 180,
            presentDays: 170,
            absentDays: 10,
            attendancePercentage: 94.4,
            lastAbsentDate: '2024-02-15',
        },

        finance: {
            feePlan: 'Standard',
            outstanding: 0,
            totalPaid: 5000,
            totalDue: 5000,
            lastPaymentDate: '2024-03-01',
        },

        health: {
            allergies: 'None',
            medicalNotes: '',
            emergencyInstructions: '',
        },

        system: {
            portalUsername: baseUser.email?.split('@')[0] || '',
            portalActive: baseUser.isActive,
            rfidCardId: 'RFID-' + baseUser.id,
        },

        documents: [],
    };
}

export const fetchMockStudentById = async (id: string): Promise<Student> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const baseUser = MOCK_STUDENTS.find(s => s.id === id);
            if (baseUser) {
                resolve(extendToFullStudent(baseUser));
            } else {
                reject(new Error('Student not found'));
            }
        }, 300);
    });
};

export const createMockStudent = async (student: Partial<Student>): Promise<Student> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newId = String(MOCK_STUDENTS.length + 1);
            const newStudent: Student = {
                ...student,
                id: newId,
                studentId: newId,
            } as Student;

            // In a real app we'd add to MOCK_STUDENTS, but here it's static const
            // casting to any to trick it for now or just returning success
            console.log('Mock Created Student:', newStudent);
            resolve(newStudent);
        }, 500);
    });
};

export const updateMockStudent = async (id: string, updates: Partial<Student>): Promise<Student> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Mock Updated Student:', id, updates);
            // Just return the updates merged with a fake base
            resolve({ ...updates, id } as Student);
        }, 500);
    });
};

export const deleteMockStudent = async (id: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Mock Deleted Student:', id);
            resolve();
        }, 500);
    });
};

