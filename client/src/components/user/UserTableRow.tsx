import { FiEdit2, FiMail, FiShield, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import type { User } from "../../types/";

const UserTableRow = ({
    user,
    idx,
    onEdit,
    onDelete,
}: {
    user: User;
    idx: number;
    onEdit: (user: User) => void;
    onDelete: (id: number) => void;
}) => (
    <tr
        className={`transition hover:bg-blue-50 group rounded-lg ${
            idx % 2 === 0 ? "bg-white" : "bg-gray-50"
        }`}
    >
        <td className="py-3 px-4 font-mono text-xs text-gray-500 whitespace-nowrap">
            {user.id}
        </td>
        <td className="py-3 px-4 gap-3 max-w-[180px] sm:max-w-xs whitespace-nowrap">
            <span className="font-medium text-gray-800 group-hover:text-blue-700 transition truncate block">
                {user.fullName}
            </span>
        </td>
        <td className="py-3 px-4 gap-2 text-gray-700 max-w-[160px] sm:max-w-xs whitespace-nowrap">
            <div className="flex items-center gap-2">
                <FiMail className="text-gray-400 flex-shrink-0" />
                <span className="truncate block" title={user.email}>
                    {user.email}
                </span>
            </div>
        </td>
        <td className="py-3 px-4 gap-2 capitalize whitespace-nowrap">
            <div className="flex items-center gap-2">
                <FiShield className="text-gray-400 flex-shrink-0" />
                <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        user.role === "admin"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-indigo-100 text-indigo-700"
                    }`}
                >
                    {user.role}
                </span>
            </div>
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
            {user.banned ? (
                <span className="inline-block px-2 py-0.5 rounded bg-red-100 text-red-600 font-semibold text-xs">
                    Yes
                </span>
            ) : (
                <span className="inline-block px-2 py-0.5 rounded bg-green-100 text-green-700 font-semibold text-xs">
                    No
                </span>
            )}
        </td>
        <td className="py-3 px-4 whitespace-nowrap">
            <div className="flex items-center gap-2">
                <motion.button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => onEdit(user)}
                    title="Edit"
                    whileTap={{ scale: 0.9 }}
                >
                    <FiEdit2 />
                </motion.button>
                <motion.button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => onDelete(user.id)}
                    title="Delete"
                    whileTap={{ scale: 0.9 }}
                >
                    <FiTrash2 />
                </motion.button>
            </div>
        </td>
    </tr>
);

export default UserTableRow;
