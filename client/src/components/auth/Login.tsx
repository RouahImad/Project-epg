import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router";
import { useLogin, useCurrentUser } from "../../hooks/api/useAuthApi";
import { isAuthenticated } from "../../utils/authUtils";
import { FiEye, FiEyeOff, FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { BiErrorCircle } from "react-icons/bi";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    const navigate = useNavigate();
    const loginMutation = useLogin();
    const { isLoading: isCheckingCurrentUser } = useCurrentUser();

    // Check if already logged in and redirect to home
    useEffect(() => {
        const checkAuthentication = async () => {
            setCheckingAuth(true);
            try {
                await new Promise((resolve) => setTimeout(resolve, 500));

                if (isAuthenticated()) {
                    navigate("/");
                }
            } finally {
                setCheckingAuth(false);
            }
        };

        checkAuthentication();
    }, [navigate]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        try {
            const response = await loginMutation.mutateAsync({
                email,
                password,
            });

            // Reset form fields on success
            setEmail("");
            setPassword("");

            // Navigate to home page or dashboard
            navigate("/");
        } catch (err: any) {
            setError(
                err.response?.data?.message ||
                    "Login failed. Please check your credentials or try again later."
            );
        }
    };
    // Show loading spinner while checking auth state
    if (checkingAuth || isCheckingCurrentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mb-4"></div>
                    <p className="text-gray-600 text-sm font-medium">
                        Checking authentication...
                    </p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 px-4 sm:px-6">
            <div className="max-w-md w-full space-y-8 p-8 sm:p-8 bg-white rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center space-x-6">
                    <div className="h-16 w-16 bg-indigo-100 rounded-full flex-shrink-0 flex items-center justify-center shadow-inner">
                        <FiLogIn className="h-8 w-8 text-indigo-600" />
                    </div>
                    <div className="text-left">
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Sign in to access your account
                        </p>
                    </div>
                </div>

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm flex items-start shadow-sm border border-red-100">
                            <BiErrorCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}
                    <div className="space-y-5">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Email
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FiMail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full pl-11 pr-3.5 py-2.5 border border-gray-300 
                                    placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                    focus:border-indigo-500 transition-all duration-200 text-base shadow-sm"
                                    placeholder="Email address"
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1.5"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                                    <FiLock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="appearance-none block w-full pl-11 pr-10 py-2.5 border border-gray-300 
                                    placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 
                                    focus:border-indigo-500 transition-all duration-200 text-base shadow-sm"
                                    placeholder="Password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <FiEyeOff className="h-5 w-5" />
                                    ) : (
                                        <FiEye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loginMutation.isPending}
                            className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent 
                            text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 
                            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 
                            disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-200
                            shadow-md hover:shadow-lg cursor-pointer"
                        >
                            {loginMutation.isPending ? (
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                            ) : (
                                <FiLogIn className="mr-2 h-5 w-5" />
                            )}
                            Sign in
                        </button>
                    </div>{" "}
                </form>
            </div>
        </div>
    );
};

export default Login;
