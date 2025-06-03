import type { StudentMajorDetails } from "./Academic.types";
import type {
    User,
    Student,
    MajorType,
    Major,
    StudentMajor,
    Tax,
    Payment,
    PaymentWithTaxes,
    Receipt,
    Company,
    LogsWithUserName,
} from "./index";

// Authentication Types
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    message: string;
    token?: string;
    user?: User;
}

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    message?: string;
    success?: boolean;
}

// Auth API Types
export interface AuthApi {
    login: (credentials: LoginCredentials) => Promise<AuthResponse>;
    logout: () => Promise<ApiResponse<null>>;
    getCurrentUser: () => Promise<User>;
    updateProfile: (userData: Partial<User>) => Promise<User>;
}

// Token Service Types
export interface TokenService {
    setToken: (token: string) => void;
    getToken: () => string | null;
    removeToken: () => void;
}

// Users API Types
export interface UsersApi {
    getUsers: () => Promise<User[]>;
    getUserById: (userId: number) => Promise<User>;
    createUser: (userData: Partial<User>) => Promise<User>;
    updateUser: (userId: number, userData: Partial<User>) => Promise<User>;
    deleteUser: (userId: number) => Promise<ApiResponse<null>>;
}

// Students API Types
export interface StudentsApi {
    getStudents: () => Promise<Student[]>;
    getStudentById: (studentId: string) => Promise<Student>;
    createStudent: (studentData: Partial<Student>) => Promise<Student>;
    updateStudent: (
        studentId: string,
        studentData: Partial<Student>
    ) => Promise<Student>;
    deleteStudent: (studentId: string) => Promise<ApiResponse<null>>;

    // Student Majors
    getStudentMajors: (studentId: string) => Promise<StudentMajorDetails[]>;
    addStudentMajor: (
        studentId: string,
        majorId: number
    ) => Promise<StudentMajor>;
    updateStudentMajor: (
        studentId: string,
        majorId: number,
        data: Omit<StudentMajor, "studentId" | "majorId" | "enrolledBy">
    ) => Promise<StudentMajor>;
    deleteStudentMajor: (
        studentId: string,
        majorId: number
    ) => Promise<ApiResponse<null>>;
}

// Program Types API Types
export interface ProgramTypesApi {
    getProgramTypes: () => Promise<MajorType[]>;
    createProgramType: (data: Partial<MajorType>) => Promise<MajorType>;
    updateProgramType: (
        typeId: number,
        data: Partial<MajorType>
    ) => Promise<MajorType>;
    deleteProgramType: (typeId: number) => Promise<ApiResponse<null>>;
}

// Majors API Types
export interface MajorsApi {
    getMajors: () => Promise<Major[]>;
    getMajorsGroupedByType: () => Promise<Record<number, Major[]>>;
    updateMajor: (majorId: number, data: Partial<Major>) => Promise<Major>;
    deleteMajor: (majorId: number) => Promise<ApiResponse<null>>;
    createMajor: (majorData: Partial<Major>) => Promise<Major>;

    // Major taxes
    getTaxesForMajor: (majorId: number) => Promise<Tax[]>;
    addTaxToMajor: (
        majorId: number,
        taxId: number
    ) => Promise<ApiResponse<null>>;
    removeTaxFromMajor: (
        majorId: number,
        taxId: number
    ) => Promise<ApiResponse<null>>;
}

// Taxes API Types
export interface TaxesApi {
    getTaxes: () => Promise<Tax[]>;
    createTax: (taxData: Partial<Tax>) => Promise<Tax>;
    updateTax: (taxId: number, taxData: Partial<Tax>) => Promise<Tax>;
    deleteTax: (taxId: number) => Promise<ApiResponse<null>>;
}

// Payments API Types
export interface PaymentsApi {
    getPayments: () => Promise<PaymentWithTaxes[]>;
    createPayment: (paymentData: Partial<Payment>) => Promise<ApiResponse<any>>;
    updatePayment: (
        paymentId: number,
        amountPaid: Payment["amountPaid"]
    ) => Promise<ApiResponse<any>>;
    deletePayment: (paymentId: number) => Promise<ApiResponse<null>>;
    getPaymentsByUser: (userId: number) => Promise<PaymentWithTaxes[]>;
}

// Receipts API Types
export interface ReceiptsApi {
    getReceipts: () => Promise<Receipt[]>;
    generateReceipt: (paymentId: number) => Promise<Receipt>;
}

// Company Info API Types
export interface CompanyApi {
    getCompanyInfo: () => Promise<Company>;
    updateCompanyInfo: (companyData: Partial<Company>) => Promise<Company>;
}

export type AdminDashboardData = {
    myIncome: number;
    myStudentsCount: number;
    myOutstandingPayments: number;
    myActivityCount: number;
    recentActions: {
        userId: number | string;
        userName: string;
        action: string;
        entityType: string;
        entityId: number | string;
        details: string;
        timestamp: string;
    }[];
    charts: {
        paymentsByMonth: Record<string, number>;
        outstandingByMonth: Record<string, number>;
        studentsByMonth: Record<string, number>;
    };
};

export type SuperDashboardData = {
    totalIncome: number;
    studentCount: number;
    outstandingBalance: number;
    staffCount: number;
    systemStats: {
        totalUsers: number;
        activeUsers: number;
        totalMajors: number;
        averagePaymentAmount: number;
    };
    charts: {
        incomeOverTime: { month: string; amount: number }[];
        paymentsByProgram: { program: string; total: number }[];
    };
    sortedStaff: {
        userId: number;
        userName: string;
        income: number;
        joinedAt: string;
    }[];
    recentActivity: {
        userId: number;
        userName: string;
        action: string;
        entityType: string;
        entityId: number | string;
        details: string;
        timestamp: string;
    }[];
};

export interface DashboardApi {
    getAdminStats: () => Promise<AdminDashboardData>;
    getSuperStats: () => Promise<SuperDashboardData>;
}

// Activity Logs API Types
export interface ActivityLogsApi {
    getActivityLogs: () => Promise<LogsWithUserName[]>;
}

// Complete API Interface
export interface Api {
    auth: AuthApi;
    users: UsersApi;
    students: StudentsApi;
    programTypes: ProgramTypesApi;
    majors: MajorsApi;
    taxes: TaxesApi;
    payments: PaymentsApi;
    receipts: ReceiptsApi;
    company: CompanyApi;
    dashboard: DashboardApi;
    activityLogs: ActivityLogsApi;
    token: TokenService;
}
