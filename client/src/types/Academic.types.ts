// Academic-related types
import type { User } from "./User.types";

export interface Student {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    address: string;
    dateOfBirth: Date;
    createdBy: User["id"];
    createdAt: Date;
}

export interface MajorType {
    id: number;
    name: string;
    description: string;
}

export interface Major {
    id: number;
    name: string;
    majorTypeId: MajorType["id"];
    price: number;
    duration: number;
    description: string;
    createdAt: Date;
}

export interface StudentMajor {
    studentId: Student["id"];
    majorId: Major["id"];
    enrollmentDate: Date;
}
