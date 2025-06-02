// hooks/api/useStudentsApi.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentsApi } from "../../services/api";
import { QueryKeys } from "./types";
import type { Student, StudentMajor } from "../../types";

/**
 * Hook to get all students
 */
export const useStudents = () =>
    useQuery({
        queryKey: QueryKeys.students.all,
        queryFn: studentsApi.getStudents,
    });

/**
 * Hook to get a single student by ID
 */
export const useStudent = (studentId: string) =>
    useQuery({
        queryKey: QueryKeys.students.detail(studentId),
        queryFn: () => studentsApi.getStudentById(studentId),
        enabled: !!studentId,
    });

/**
 * Hook to create a new student
 */
export const useCreateStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentData: Partial<Student>) =>
            studentsApi.createStudent(studentData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.students.all });
        },
    });
};

/**
 * Hook to update a student
 */
export const useUpdateStudent = (studentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentData: Partial<Student>) =>
            studentsApi.updateStudent(studentId, studentData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.students.all });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.detail(studentId),
            });
        },
    });
};

/**
 * Hook to delete a student
 */
export const useDeleteStudent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (studentId: string) => studentsApi.deleteStudent(studentId),
        onSuccess: (_, studentId) => {
            queryClient.invalidateQueries({ queryKey: QueryKeys.students.all });
            queryClient.removeQueries({
                queryKey: QueryKeys.students.detail(studentId),
            });
        },
    });
};

/**
 * Hook to get a student's majors
 */
export const useStudentMajors = (studentId: string) =>
    useQuery({
        queryKey: QueryKeys.students.majors(studentId),
        queryFn: () => studentsApi.getStudentMajors(studentId),
        enabled: !!studentId,
    });

/**
 * Hook to add a major to a student
 */
export const useAddStudentMajor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            studentId,
            majorId,
        }: {
            studentId: string;
            majorId: number;
        }) => studentsApi.addStudentMajor(studentId, majorId),
        onSuccess: (_, { studentId }) => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.majors(studentId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.detail(studentId),
            });
        },
    });
};

/**
 * Hook to update a student's major
 */
export const useUpdateStudentMajor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            studentId,
            majorId,
            data,
        }: {
            studentId: string;
            majorId: number;
            data: Omit<StudentMajor, "studentId" | "majorId" | "enrolledBy">;
        }) => studentsApi.updateStudentMajor(studentId, majorId, data),
        onSuccess: (_, { studentId }) => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.majors(studentId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.detail(studentId),
            });
        },
    });
};

/**
 * Hook to delete a student's major
 */

export const useDeleteStudentMajor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            studentId,
            majorId,
        }: {
            studentId: string;
            majorId: number;
        }) => studentsApi.deleteStudentMajor(studentId, majorId),
        onSuccess: (_, { studentId }) => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.majors(studentId),
            });
            queryClient.removeQueries({
                queryKey: QueryKeys.students.majors(studentId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.detail(studentId),
            });
        },
    });
};
