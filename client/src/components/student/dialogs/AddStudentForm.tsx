import { useState } from "react";
import {
    FiX,
    FiUser,
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiHash,
} from "react-icons/fi";

const AddStudentForm = ({
    open,
    onClose,
    onSubmit,
    isLoading,
}: {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        address?: string;
        dateOfBirth?: string;
    }) => void;
    isLoading: boolean;
}) => {
    const [formData, setFormData] = useState({
        id: "",
        fullName: "",
        email: "",
        phone: "",
        address: "",
        dateOfBirth: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({
            id: "",
            fullName: "",
            email: "",
            phone: "",
            address: "",
            dateOfBirth: "",
        });
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800">
                        Add New Student
                    </h2>
                    <button
                        className="text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        type="button"
                        aria-label="Close"
                    >
                        <FiX className="h-6 w-6" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiHash className="text-gray-400" />
                            Student ID
                        </label>
                        <input
                            type="text"
                            name="id"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.id}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiUser className="text-gray-400" />
                            Full Name
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            autoComplete="name"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiMail className="text-gray-400" />
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiPhone className="text-gray-400" />
                            Phone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.phone}
                            onChange={handleChange}
                            autoComplete="tel"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiMapPin className="text-gray-400" />
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.address}
                            onChange={handleChange}
                            autoComplete="street-address"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="text-gray-700 text-sm font-bold mb-2 flex items-center gap-1">
                            <FiCalendar className="text-gray-400" />
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            name="dateOfBirth"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={formData.dateOfBirth}
                            onChange={handleChange}
                            autoComplete="bday"
                        />
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            disabled={isLoading}
                        >
                            {isLoading ? "Saving..." : "Save Student"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentForm;
