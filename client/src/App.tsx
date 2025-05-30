import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./router/App.routes";

const App = () => {
    return (
        <AuthProvider>
            <AppRoutes />
        </AuthProvider>
    );
};

export default App;
