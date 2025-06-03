// User-related types
export interface User {
    id: number;
    fullName: string;
    email: string;
    password?: string;
    role: "admin" | "super_admin";
    createdAt: Date;
    banned: boolean;
}

export const ACTIVITY_ACTIONS = {
    CREATE_STUDENT: "Created student",
    UPDATE_STUDENT: "Updated student",
    DELETE_STUDENT: "Deleted student",

    ADD_PAYMENT: "Added payment",
    UPDATE_PAYMENT: "Updated payment",
    DELETE_PAYMENT: "delete_payment",

    CREATED_TAX: "Created tax",
    UPDATED_TAX: "Updated tax",
    DELETED_TAX: "Deleted tax",
    ASSIGNED_TAX: "Assigned tax",
    REMOVED_TAX: "Removed tax",

    CREATE_MAJOR: "Created major",
    UPDATE_MAJOR: "Updated major",
    DELETE_MAJOR: "Deleted major",

    ASSIGN_MAJOR: "Assigned major",
    REMOVE_MAJOR: "Removed major",

    UPDATE_PROFILE: "Updated profile",

    UPDATE_COMPANY: "Updated company",
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
        | "user"
        | "tax";
    entityId: string | number;
    details?: string;
    timestamp: Date;
}
export interface LogsWithUserName extends ActivityLog {
    username: User["fullName"];
}
