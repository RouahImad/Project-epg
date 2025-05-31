// Common query keys for consistent cache management
export const QueryKeys = {
    users: {
        all: ["users"],
        detail: (id: number) => ["users", id],
    },
    students: {
        all: ["students"],
        detail: (id: string) => ["students", id],
        majors: (id: string) => ["students", id, "majors"],
    },
    majors: {
        all: ["majors"],
        detail: (id: number) => ["majors", id],
        taxes: (id: number) => ["majors", id, "taxes"],
    },
    programTypes: {
        all: ["programTypes"],
        detail: (id: number) => ["programTypes", id],
        majors: (id: number) => ["programTypes", id, "majors"],
    },
    taxes: {
        all: ["taxes"],
    },
    auth: {
        currentUser: ["currentUser"],
    },
    payments: {
        all: ["payments"],
        byStudent: (studentId: string) => ["payments", "byStudent", studentId],
    },
};
