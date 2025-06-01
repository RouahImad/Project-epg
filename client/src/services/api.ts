import axios from "axios";
import type {
    User,
    Student,
    Major,
    MajorType,
    Payment,
    Tax,
    Company,
    StudentMajor,
} from "../types/index";
import type {
    AuthApi,
    TokenService,
    UsersApi,
    StudentsApi,
    ProgramTypesApi,
    MajorsApi,
    TaxesApi,
    PaymentsApi,
    ReceiptsApi,
    CompanyApi,
    DashboardApi,
    Api,
    LoginCredentials,
    ActivityLogsApi,
} from "../types/api.types";

const API_URL = import.meta.env.VITE_APP_API_URL || "http://localhost:4000";
const TOKEN_KEY = "auth_token";

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to handle JWT tokens
apiClient.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken();

        if (token && !config.headers.Authorization) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle authentication errors and extract data
apiClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        console.error("API Error:", error);

        // Handle 401 (Unauthorized) or 403 (Forbidden) responses
        if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
        ) {
            // If we get authentication error, clear the token
            tokenService.removeToken();

            // Redirect to login page if not already there
            const currentPath = window.location.pathname;
            if (currentPath !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

// Auth services
export const authApi: AuthApi = {
    login: (credentials: LoginCredentials) =>
        apiClient.post("/auth/login", credentials),

    logout: () => apiClient.post("/auth/logout"),

    getCurrentUser: () => apiClient.get("/auth/profile"),

    updateProfile: (userData: Partial<User>) =>
        apiClient.patch("/auth/profile", userData),
};

// Token management helpers
export const tokenService: TokenService = {
    setToken: (token: string) => {
        localStorage.setItem(TOKEN_KEY, token);
    },

    getToken: () => {
        return localStorage.getItem(TOKEN_KEY);
    },

    removeToken: () => {
        localStorage.removeItem(TOKEN_KEY);
    },
};

// Users API
export const usersApi: UsersApi = {
    getUsers: () => apiClient.get("/users"),

    getUserById: (userId: number) => apiClient.get(`/users/${userId}`),

    createUser: (userData: Partial<User>) => apiClient.post("/users", userData),

    updateUser: (userId: number, userData: Partial<User>) =>
        apiClient.patch(`/users/${userId}`, userData),

    deleteUser: (userId: number) => apiClient.delete(`/users/${userId}`),
};

// Students API
export const studentsApi: StudentsApi = {
    getStudents: () => apiClient.get("/students"),

    getStudentById: (studentId: string) =>
        apiClient.get(`/students/${studentId}`),

    createStudent: (studentData: Partial<Student>) =>
        apiClient.post("/students", studentData),

    updateStudent: (studentId: string, studentData: Partial<Student>) =>
        apiClient.patch(`/students/${studentId}`, studentData),

    deleteStudent: (studentId: string) =>
        apiClient.delete(`/students/${studentId}`),

    // Student Majors
    getStudentMajors: (studentId: string) =>
        apiClient.get(`/students/${studentId}/majors`),

    addStudentMajor: (studentId: string, majorId: number) =>
        apiClient.post(`/students/${studentId}/majors`, { majorId }),

    updateStudentMajor: (
        studentId: string,
        majorId: number,
        data: Partial<StudentMajor>
    ) => apiClient.patch(`/students/${studentId}/majors/${majorId}`, data),

    deleteStudentMajor: (studentId: string, majorId: number) =>
        apiClient.delete(`/students/${studentId}/majors/${majorId}`),
};

// Program Types API
export const programTypesApi: ProgramTypesApi = {
    getProgramTypes: () => apiClient.get("/program-types"),

    createProgramType: (data: Partial<MajorType>) =>
        apiClient.post("/program-types", data),

    updateProgramType: (typeId: number, data: Partial<MajorType>) =>
        apiClient.patch(`/program-types/${typeId}`, data),

    deleteProgramType: (typeId: number) =>
        apiClient.delete(`/program-types/${typeId}`),

    // Majors under program type
    getMajorsByProgramType: (typeId: number) =>
        apiClient.get(`/program-types/${typeId}/majors`),
};

// Majors API
export const majorsApi: MajorsApi = {
    getMajors: () => apiClient.get("/majors"),

    getMajorById: (majorId: number) => apiClient.get(`/majors/${majorId}`),

    getMajorsGroupedByType: () => apiClient.get("/majors/grouped"),

    updateMajor: (majorId: number, data: Partial<Major>) =>
        apiClient.patch(`/majors/${majorId}`, data),

    deleteMajor: (majorId: number) => apiClient.delete(`/majors/${majorId}`),

    createMajor: (majorData: Partial<Major>) =>
        apiClient.post("/majors", majorData),

    // Major taxes
    getTaxesForMajor: (majorId: number) =>
        apiClient.get(`/majors/${majorId}/taxes`),

    addTaxToMajor: (majorId: number, taxId: number) =>
        apiClient.post(`/majors/${majorId}/taxes`, { taxId }),

    removeTaxFromMajor: (majorId: number, taxId: number) =>
        apiClient.delete(`/majors/${majorId}/taxes/${taxId}`),
};

// Taxes API
export const taxesApi: TaxesApi = {
    getTaxes: () => apiClient.get("/taxes"),

    createTax: (taxData: Partial<Tax>) => apiClient.post("/taxes", taxData),

    updateTax: (taxId: number, taxData: Partial<Tax>) =>
        apiClient.patch(`/taxes/${taxId}`, taxData),

    deleteTax: (taxId: number) => apiClient.delete(`/taxes/${taxId}`),
};

// Payments API
export const paymentsApi: PaymentsApi = {
    getPayments: () => apiClient.get("/payments"),

    getPaymentById: (paymentId: number) =>
        apiClient.get(`/payments/${paymentId}`),

    createPayment: (paymentData: Partial<Payment>) =>
        apiClient.post("/payments", paymentData),

    updatePayment: (paymentId: number, paymentData: Partial<Payment>) =>
        apiClient.patch(`/payments/${paymentId}`, paymentData),

    deletePayment: (paymentId: number) =>
        apiClient.delete(`/payments/${paymentId}`),

    getPaymentsByUser: (userId: number) =>
        apiClient.get(`/payments/user/${userId}`),
};

// Receipts API
export const receiptsApi: ReceiptsApi = {
    getReceipts: () => apiClient.get("/receipts"),

    getReceiptById: (receiptId: number) =>
        apiClient.get(`/receipts/${receiptId}`),

    generateReceipt: (paymentId: number) =>
        apiClient.post(`/receipts/generate/${paymentId}`),

    deleteReceipt: (receiptId: number) =>
        apiClient.delete(`/receipts/${receiptId}`),
};

// Company Info API
export const companyApi: CompanyApi = {
    getCompanyInfo: () => apiClient.get("/company-info"),
    updateCompanyInfo: (companyData: Partial<Company>) =>
        apiClient.patch("/company-info", companyData),
};

// Dashboard API
export const dashboardApi: DashboardApi = {
    // getDashboardStats: () => apiClient.get("/dashboard"),
    getSuperStats: () => apiClient.get("/dashboard/super"),
    getAdminStats: () => apiClient.get("/dashboard/admin"),
};

// Activity logs API
export const activityLogsApi: ActivityLogsApi = {
    getActivityLogs: () => apiClient.get("/logs"),
};

// Default export of all API services
export default {
    auth: authApi,
    users: usersApi,
    students: studentsApi,
    programTypes: programTypesApi,
    majors: majorsApi,
    taxes: taxesApi,
    payments: paymentsApi,
    receipts: receiptsApi,
    company: companyApi,
    dashboard: dashboardApi,
    token: tokenService,
} as Api;
