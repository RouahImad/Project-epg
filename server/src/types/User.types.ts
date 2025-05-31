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

// export interface Activity {
//     id: number;
//     userId: User["id"];
//     action: string;
//     timestamp: Date;
// }
export const ACTIVITY_ACTIONS = {
    CREATE_STUDENT: "create_student",
    UPDATE_STUDENT: "update_student",
    DELETE_STUDENT: "delete_student",
    ADD_PAYMENT: "add_payment",
    UPDATE_PAYMENT: "update_payment",
    DELETE_PAYMENT: "delete_payment",
    ASSIGN_MAJOR: "assign_major",
    REMOVE_MAJOR: "remove_major",
    LOGIN: "login",
    UPDATE_PROFILE: "update_profile",
} as const;

export interface ActivityLog {
    id: number;
    userId: number;
    action: (typeof ACTIVITY_ACTIONS)[keyof typeof ACTIVITY_ACTIONS];
    entityType:
        | "student"
        | "payment"
        | "major"
        | "enrollment"
        | "company"
        | "user";
    entityId: string | number;
    details?: Record<string, any>; // Optional detailed payload
    timestamp: Date;
}
export interface LogsWithUserName extends ActivityLog {
    username: User["fullName"];
}
