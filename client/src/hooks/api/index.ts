// hooks/api/index.ts
// Re-export all hooks for easy imports

// Auth hooks
export {
    useLogin,
    useLogout,
    useCurrentUser,
    useUpdateProfile,
} from "./useAuthApi";

// Users hooks
export {
    useUsers,
    useUser,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
} from "./useUsersApi";

// Students hooks
export {
    useStudents,
    useStudent,
    useCreateStudent,
    useUpdateStudent,
    useDeleteStudent,
    useStudentMajors,
    useAddStudentMajor,
    useUpdateStudentMajor,
    useDeleteStudentMajor,
} from "./useStudentsApi";

// Programs and Majors hooks
export {
    // Program Types
    useProgramTypes,
    useMajorsByProgramType,
    useCreateProgramType,
    useUpdateProgramType,
    useDeleteProgramType,
} from "./useProgramsApi";

export * from "./useMajorsApi";

// Taxes hooks
export {
    useTaxes,
    useCreateTax,
    useUpdateTax,
    useDeleteTax,
} from "./useTaxesApi";

// Types
export * from "./types";
