import React from "react";

const LoadingPage: React.FC = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-3 text-indigo-600">Loading...</span>
    </div>
);

export default LoadingPage;
