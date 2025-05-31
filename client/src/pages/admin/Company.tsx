import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { companyApi } from "../../services/api";
import type { Company } from "../../types";
import { FiEdit2, FiSave, FiX } from "react-icons/fi";
import Logo from "../../assets/logo.webp";

const Company = () => {
    const queryClient = useQueryClient();
    const { data, isLoading, isError } = useQuery({
        queryKey: ["companyInfo"],
        queryFn: companyApi.getCompanyInfo,
    });

    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState<Partial<Company>>({});

    useEffect(() => {
        if (data) setForm(data);
    }, [data]);

    const updateMutation = useMutation({
        mutationFn: companyApi.updateCompanyInfo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["companyInfo"] });
            setEditMode(false);
        },
    });

    if (isLoading) return <div className="p-8">Loading...</div>;
    if (isError)
        return (
            <div className="p-8 text-red-500">Failed to load company info.</div>
        );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        updateMutation.mutate(form);
    };

    return (
        <div className="max-w-xl mx-auto bg-white shadow-lg rounded-xl p-8 mt-4 mb-2">
            <div className="flex items-center mb-6">
                {form.logoUrl && (
                    <img
                        src={
                            form.logoUrl.startsWith("/assets/")
                                ? Logo
                                : `/assets/${form.logoUrl.replace(/^\/+/, "")}`
                        }
                        alt="Logo"
                        className="w-16 h-16 rounded-full object-cover mr-4 border"
                    />
                )}
                <div>
                    <h2 className="text-2xl font-bold">{form.name}</h2>
                    <span className="text-gray-500 text-sm">
                        {form.website}
                    </span>
                </div>
                <button
                    className="ml-auto text-blue-600 hover:text-blue-800"
                    onClick={() => setEditMode((v) => !v)}
                    title={editMode ? "Cancel" : "Edit"}
                >
                    {editMode ? <FiX size={22} /> : <FiEdit2 size={22} />}
                </button>
            </div>
            <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSave();
                }}
            >
                <div>
                    <label className="block text-gray-700 font-medium">
                        Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={form.name || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={form.email || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">
                        Phone
                    </label>
                    <input
                        type="text"
                        name="phone"
                        value={form.phone || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">
                        Address
                    </label>
                    <input
                        type="text"
                        name="address"
                        value={form.address || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">
                        Logo URL
                    </label>
                    <input
                        type="text"
                        name="logoUrl"
                        value={form.logoUrl || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 font-medium">
                        Website
                    </label>
                    <input
                        type="text"
                        name="website"
                        value={form.website || ""}
                        onChange={handleChange}
                        disabled={!editMode}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                {editMode && (
                    <button
                        type="submit"
                        className="mt-4 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
                        disabled={updateMutation.isPending}
                    >
                        <FiSave />{" "}
                        {updateMutation.isPending ? "Saving..." : "Save"}
                    </button>
                )}
            </form>
            {updateMutation.isError && (
                <div className="text-red-500 mt-2">
                    Failed to update company info.
                </div>
            )}
            {updateMutation.isSuccess && (
                <div className="text-green-600 mt-2">
                    Company info updated successfully.
                </div>
            )}
        </div>
    );
};

export default Company;
