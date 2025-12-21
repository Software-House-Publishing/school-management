export type StudentStatus = 'active' | 'graduated' | 'transferred' | 'withdrawn';

export interface Student {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    email?: string;
    gender?: string;
    dateOfBirth?: string;
    phone?: string;
    address?: string;
    language?: string;
    photoUrl?: string;

    guardians?: {
        name: string;
        relationship: string;
        phone: string;
        email?: string;
        isEmergencyContact: boolean;
    }[];

    enrollment?: {
        admissionDate: string;
        grade: string;
        section?: string;
        status: StudentStatus | string;
        previousSchool?: string;
        homeroomTeacher?: string;
        rollNumber?: string;
    };

    academics?: {
        gpa?: number;
        currentSubjects: string[];
        lastExamScore?: number;
        remarks?: string;
    };

    attendance?: {
        totalDays?: number;
        presentDays?: number;
        absentDays?: number;
        attendancePercentage?: number;
        lastAbsentDate?: string;
    };

    activities?: {
        clubs: string[];
        sports: string[];
        awards: string[];
        disciplineNotes: string;
    };

    finance?: {
        feePlan: string;
        totalDue?: number;
        totalPaid?: number;
        outstanding?: number;
        lastPaymentDate?: string;
        scholarship?: string;
    };

    health?: {
        allergies: string;
        medicalNotes: string;
        emergencyInstructions: string;
    };

    system?: {
        portalUsername: string;
        portalActive: boolean;
        rfidCardId: string;
    };

    documents?: {
        type: string;
        uploaded: boolean;
    }[];
}
