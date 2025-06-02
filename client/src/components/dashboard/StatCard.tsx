import React from "react";
import { FiDollarSign, FiUsers, FiUser, FiActivity } from "react-icons/fi";

interface StatCardProps {
    icon: "dollar" | "users" | "user" | "activity";
    label: string;
    value: string | number;
    tooltip?: string;
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    icon,
    label,
    value,
    tooltip,
    className = "",
}) => {
    const IconComponent = () => {
        switch (icon) {
            case "dollar":
                return <FiDollarSign className="text-green-500" size={24} />;
            case "users":
                return <FiUsers className="text-blue-500" size={24} />;
            case "user":
                return <FiUser className="text-indigo-500" size={24} />;
            case "activity":
                return <FiActivity className="text-yellow-500" size={24} />;
            default:
                return null;
        }
    };

    return (
        <div
            className={`rounded-xl shadow p-5 relative ${className}`}
            title={tooltip || value.toString()}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p className="text-gray-600 text-sm font-medium mb-1">
                        {label}
                    </p>
                    <p className="text-2xl font-bold overflow-hidden text-ellipsis whitespace-nowrap">
                        {value}
                    </p>
                </div>
                <div className="p-2 rounded-full bg-white shadow-sm">
                    <IconComponent />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
