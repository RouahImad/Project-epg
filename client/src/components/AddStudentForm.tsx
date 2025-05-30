import { useState } from "react";

const AddStudentForm = ({
    onSubmit,
    onCancel,
    isLoading,
}: {
    onSubmit: (data: {
        id: string;
        fullName: string;
        email: string;
        phone?: string;
        address?: string;
        dateOfBirth?: string;
    }) => void;
    onCancel: () => void;
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
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
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
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    name="fullName"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                </label>
                <input
                    type="email"
                    name="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Phone
                </label>
                <input
                    type="tel"
                    name="phone"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.phone}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Address
                </label>
                <input
                    type="text"
                    name="address"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.address}
                    onChange={handleChange}
                />
            </div>

            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date of Birth
                </label>
                <input
                    type="date"
                    name="dateOfBirth"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                    onClick={onCancel}
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
    );
};

export default AddStudentForm;
