// User-related types
export interface User {
    id: number;
    fullName: string;
    email: string;
    password: string;
    role: "admin" | "super_admin";
    createdAt: Date;
    banned: boolean;
}

export interface Activity {
    id: number;
    userId: User["id"];
    action: string;
    timestamp: Date;
}
