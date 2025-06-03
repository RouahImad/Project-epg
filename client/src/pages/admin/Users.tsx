import { useState, useRef } from "react";
import {
    useUsers,
    useCreateUser,
    useUpdateUser,
    useDeleteUser,
} from "../../hooks/api";
import { FiUser, FiSearch, FiX, FiPlus, FiArrowLeft } from "react-icons/fi";
import UserFormDialog from "../../components/user/UserFormDialog";
import DeleteUserDialog from "../../components/user/DeleteUserDialog";
import UserTableRow from "../../components/user/UserTableRow";
import { useAuth } from "../../contexts/AuthContext";
import type { User } from "../../types";
import { useNavigate } from "react-router";

export const initialForm = {
    fullName: "",
    email: "",
    password: "",
    role: "admin",
    banned: false,
} as Partial<User>;

// Table Head as a component
const UserTableHead = () => (
    <thead>
        <tr className="bg-gray-50">
            <th className="text-left font-semibold py-3 px-4 rounded-tl-xl">
                ID
            </th>
            <th className="text-left font-semibold py-3 px-4">User</th>
            <th className="text-left font-semibold py-3 px-4">Email</th>
            <th className="text-left font-semibold py-3 px-4">Role</th>
            <th className="text-left font-semibold py-3 px-4">Banned</th>
            <th className="text-left font-semibold py-3 px-4 rounded-tr-xl">
                Actions
            </th>
        </tr>
    </thead>
);

const Users = () => {
    const { data: users, isLoading, isError, error } = useUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);
    const { user } = useAuth();
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [editUser, setEditUser] = useState<User | null>(null);
    const [form, setForm] = useState<Partial<User>>(initialForm);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<string | null>(null);

    const createUser = useCreateUser();
    const updateUser = useUpdateUser(editUser?.id || 0);
    const deleteUser = useDeleteUser();

    if (!user) return null;
    const loggedUserId = user.id;

    // Exclude logged user from the list
    const filteredUsers = users
        ?.filter((user) => user.id !== loggedUserId)
        ?.filter((user) =>
            [user.fullName, user.email, user.id]
                .filter(Boolean)
                .some((field) =>
                    String(field)
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                )
        );

    const focusSearchInput = () => {
        searchInputRef.current?.focus();
    };

    // Handlers
    const handleOpenAdd = () => {
        setForm(initialForm);
        setShowAdd(true);
        setFeedback(null);
    };
    const handleOpenEdit = (user: User) => {
        setEditUser(user);
        setForm({
            fullName: user.fullName,
            email: user.email,
            password: "",
            role: user.role,
            banned: user.banned,
        });
        setShowEdit(true);
        setFeedback(null);
    };
    const handleAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createUser.mutate(form, {
            onSuccess: () => {
                setShowAdd(false);
                setFeedback("User added successfully.");
            },
            onError: (err: Error) =>
                setFeedback(
                    (err as any)?.response?.data?.message ||
                        "Failed to add user"
                ),
        });
    };
    const handleEditSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const data = { ...form };
        if (!data.password) delete data.password;
        updateUser.mutate(data, {
            onSuccess: () => {
                setShowEdit(false);
                setFeedback("User updated successfully.");
            },
            onError: (err: Error) =>
                setFeedback(
                    (err as any)?.response?.data?.message ||
                        "Failed to update user"
                ),
        });
    };
    const handleDelete = (id: number) => {
        deleteUser.mutate(id, {
            onSuccess: () => {
                setDeleteId(null);
                setFeedback("User deleted.");
            },
            onError: (err: Error) =>
                setFeedback(
                    (err as any)?.response?.data?.message ||
                        "Failed to delete user"
                ),
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <span className="ml-4 text-gray-600">Loading users...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                    <h3 className="text-red-700 font-medium mb-2">Error</h3>
                    <p className="text-red-600">
                        {error?.message || "Failed to load users"}
                    </p>
                </div>
            </div>
        );
    }

    const navigate = useNavigate();

    return (
        <div className="container mx-auto px-6 sm:px-8 py-8 md:max-w-[85vw]">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
                <div className="flex items-center mb-6">
                    <button
                        className="mr-3 text-gray-500 hover:text-blue-600"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                    >
                        <FiArrowLeft size={22} />
                    </button>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <FiUser className="text-blue-500" /> Users
                    </h1>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative flex-1">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search users by name, email, or ID..."
                            className="pl-11 pr-10 py-2 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            aria-label="Search users"
                        />
                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 cursor-pointer"
                            onClick={focusSearchInput}
                            tabIndex={0}
                            aria-label="Focus search"
                        />
                        {searchTerm && (
                            <button
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                onClick={() => setSearchTerm("")}
                                aria-label="Clear search"
                                type="button"
                            >
                                <FiX className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow"
                        onClick={handleOpenAdd}
                        type="button"
                    >
                        <FiPlus /> Add User
                    </button>
                </div>
            </div>
            <div className="mb-4 text-gray-600 text-sm">
                <span className="font-semibold">
                    {filteredUsers?.length || 0}
                </span>{" "}
                {filteredUsers?.length === 1 ? "user" : "users"}
                {searchTerm && (
                    <span>
                        {" "}
                        matching{" "}
                        <span className="font-mono bg-gray-100 px-1 rounded">
                            {`"${searchTerm}"`}
                        </span>
                    </span>
                )}
            </div>
            {feedback && (
                <div className="mb-4 text-center text-blue-600">{feedback}</div>
            )}
            <div className="bg-white rounded-xl shadow-md p-0 sm:p-4 overflow-x-auto">
                <table className="min-w-full text-sm border-separate border-spacing-y-1">
                    <UserTableHead />
                    <tbody>
                        {filteredUsers?.length ? (
                            filteredUsers.map((user, idx) => (
                                <UserTableRow
                                    key={user.id}
                                    user={user}
                                    idx={idx}
                                    onEdit={handleOpenEdit}
                                    onDelete={setDeleteId}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6}>
                                    <div className="text-gray-500 text-center py-8">
                                        No users found.
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Add/Edit User Dialog */}
            <UserFormDialog
                open={showAdd || showEdit}
                isEdit={showEdit}
                form={form}
                setForm={setForm}
                onClose={() => {
                    setShowAdd(false);
                    setShowEdit(false);
                }}
                onSubmit={showEdit ? handleEditSubmit : handleAddSubmit}
                isPending={
                    showEdit ? updateUser.isPending : createUser.isPending
                }
                isError={showEdit ? updateUser.isError : createUser.isError}
            />
            {/* Delete Confirmation Dialog */}
            <DeleteUserDialog
                open={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onDelete={() => handleDelete(deleteId!)}
                isPending={deleteUser.isPending}
                isError={deleteUser.isError}
            />
        </div>
    );
};

export default Users;
