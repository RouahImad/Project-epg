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
    useUpdateStudentMajor,
    useAddStudentMajor,
} from "./useStudentsApi";

// Programs and Majors hooks
export {
    // Majors
    useMajors,
    useMajor,
    useUpdateMajor,
    useDeleteMajor,
    useMajorTaxes,
    useAddTaxToMajor,
    useRemoveTaxFromMajor,

    // Program Types
    useProgramTypes,
    useMajorsByProgramType,
    useCreateProgramType,
    useUpdateProgramType,
    useDeleteProgramType,
    useAddMajorToProgramType,
} from "./useProgramsApi";

// Taxes hooks
export {
    useTaxes,
    useCreateTax,
    useUpdateTax,
    useDeleteTax,
} from "./useTaxesApi";

// Types
export * from "./types";
