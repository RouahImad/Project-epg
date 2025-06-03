import { Suspense } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import AppRoutes from "./router/App.routes";

const AppContent = () => {
    const { isLoading } = useAuth();
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                <span className="ml-4 text-blue-600 text-lg font-semibold">
                    Loading...
                </span>
            </div>
        );
    }
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-screen">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    <span className="ml-4 text-blue-600 text-lg font-semibold">
                        Loading...
                    </span>
                </div>
            }
        >
            <AppRoutes />
        </Suspense>
    );
};

const App = () => {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
};

export default App;
