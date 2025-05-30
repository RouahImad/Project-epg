import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface UIContextType {
    isLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    showNotification: (
        message: string,
        type: "success" | "error" | "info"
    ) => void;
    notification: {
        message: string;
        type: "success" | "error" | "info" | null;
        isVisible: boolean;
    };
    hideNotification: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({
        message: "",
        type: null as "success" | "error" | "info" | null,
        isVisible: false,
    });

    const showNotification = (
        message: string,
        type: "success" | "error" | "info"
    ) => {
        setNotification({
            message,
            type,
            isVisible: true,
        });

        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideNotification();
        }, 5000);
    };

    const hideNotification = () => {
        setNotification((prev) => ({
            ...prev,
            isVisible: false,
        }));
    };

    const value = {
        isLoading,
        setIsLoading,
        showNotification,
        notification,
        hideNotification,
    };

    return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => {
    const context = useContext(UIContext);

    if (context === undefined) {
        throw new Error("useUI must be used within a UIProvider");
    }

    return context;
};

export default UIContext;
