import { FiUsers, FiDollarSign, FiActivity, FiUser } from "react-icons/fi";
import React from "react";

const ICONS: Record<string, React.ReactNode> = {
    users: <FiUsers className="text-blue-500" size={28} />,
    dollar: <FiDollarSign className="text-green-500" size={28} />,
    activity: <FiActivity className="text-yellow-500" size={28} />,
    user: <FiUser className="text-indigo-500" size={28} />,
};

interface StatCardProps {
    icon: keyof typeof ICONS;
    label: string;
    value: string | number;
    className?: string;
}

const StatCard = ({ icon, label, value, className }: StatCardProps) => (
    <div
        className={`bg-white rounded-xl flex flex-col items-center justify-center p-6 ${
            className ?? ""
        }`}
        style={{
            borderRight: "1px solid #f3f4f6",
            boxShadow: "0 1px 4px 0 rgba(0,0,0,0.03)",
        }}
    >
        <div className="mb-2">{ICONS[icon]}</div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-gray-500">{label}</div>
    </div>
);

export default StatCard;
