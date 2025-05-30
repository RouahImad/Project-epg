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
export const useAddStudentMajor = (studentId: string) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (majorId: number) =>
            studentsApi.addStudentMajor(studentId, majorId),
        onSuccess: () => {
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
export const useUpdateStudentMajor = (studentId: string, majorId: number) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: Partial<StudentMajor>) =>
            studentsApi.updateStudentMajor(studentId, majorId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.majors(studentId),
            });
            queryClient.invalidateQueries({
                queryKey: QueryKeys.students.detail(studentId),
            });
        },
    });
};
