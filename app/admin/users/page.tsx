"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import {
    MoreVertical,
    Eye,
    Trash,
    Ban,
    CheckCircle,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useState, useMemo } from "react";

export default function AdminUsersPage() {

    const users = useQuery(api.users.getAllUsers);
    const updateUser = useMutation(api.users.updateUser);
    const toggleBlock = useMutation(api.users.toggleBlockUser);
    const deleteUser = useMutation(api.users.deleteUser);

    const [viewUser, setViewUser] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

    // ✅ Always run hooks
    const filteredUsers = useMemo(() => {
        if (!users) return [];

        return users.filter((user) => {
            const matchesSearch =
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase());

            const matchesRole =
                roleFilter === "all" || user.role === roleFilter;

            const matchesStatus =
                statusFilter === "all" || user.status === statusFilter;

            return matchesSearch && matchesRole && matchesStatus;
        });
    }, [users, search, roleFilter, statusFilter]);

    // ✅ AFTER hooks
    if (!users) return <div className="p-6">Loading...</div>;

    return (
        <div className="p-8 space-y-6">

            {/* SEARCH + FILTERS */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border rounded px-4 py-2 w-64"
                    />

                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">All Roles</option>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="border rounded px-3 py-2"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>

                <div className="text-sm text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto bg-white rounded-xl shadow">
                <table className="min-w-full table-fixed border-collapse text-sm">
                    <thead className="bg-violet-50">
                        <tr>
                            <th className="px-6 py-4 text-left font-semibold">Name</th>
                            <th className="px-6 py-4 text-left font-semibold">Email</th>
                            <th className="px-6 py-4 text-left font-semibold">Role</th>
                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                            <th className="px-6 py-4 text-left font-semibold">Blocked</th>
                            <th className="px-6 py-4 text-left font-semibold">Join Date</th>
                            <th className="px-6 py-4 text-center font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user._id}
                                className="border-t hover:bg-violet-50 transition"
                            >
                                <td className="px-6 py-4 font-medium">
                                    {user.name}
                                </td>

                                <td className="px-6 py-4">
                                    {user.email}
                                </td>

                                <td className="px-6 py-4">
                                    <select
                                        value={user.role}
                                        onChange={(e) =>
                                            updateUser({
                                                id: user._id as Id<"users">,
                                                name: user.name,
                                                role: e.target.value as any,
                                                status: user.status,
                                            })
                                        }
                                        className="border rounded px-3 py-1.5 text-sm w-full"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>

                                <td className="px-6 py-4">
                                    <select
                                        value={user.status}
                                        onChange={(e) =>
                                            updateUser({
                                                id: user._id as Id<"users">,
                                                name: user.name,
                                                role: user.role,
                                                status: e.target.value as any,
                                            })
                                        }
                                        className="border rounded px-3 py-1.5 text-sm w-full"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </td>

                                <td className="px-6 py-4">
                                    {user.isBlocked ? (
                                        <span className="text-red-500 font-medium">Yes</span>
                                    ) : (
                                        <span className="text-green-600 font-medium">No</span>
                                    )}
                                </td>

                                <td className="px-6 py-4">
                                    {user.createdAt
                                        ? new Date(user.createdAt).toLocaleDateString("en-GB")
                                        : "N/A"}
                                </td>

                                <td className="px-6 py-4 text-center">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                            <MoreVertical className="cursor-pointer mx-auto" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => setViewUser(user)}
                                                className="flex items-center gap-2"
                                            >
                                                <Eye size={16} /> View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    toggleBlock({
                                                        id: user._id as Id<"users">,
                                                        isBlocked: !user.isBlocked,
                                                    })
                                                }
                                                className="flex items-center gap-2"
                                            >
                                                {user.isBlocked ? (
                                                    <>
                                                        <CheckCircle size={16} /> Unblock
                                                    </>
                                                ) : (
                                                    <>
                                                        <Ban size={16} /> Block
                                                    </>
                                                )}
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() =>
                                                    deleteUser({
                                                        id: user._id as Id<"users">,
                                                    })
                                                }
                                                className="flex items-center gap-2 text-red-500"
                                            >
                                                <Trash size={16} /> Delete
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {viewUser && (
                <UserDetailsModal
                    user={viewUser}
                    onClose={() => setViewUser(null)}
                />
            )}
        </div>
    );
}


/* ========================= MODAL ========================= */

function UserDetailsModal({ user, onClose }: any) {

    const addresses = useQuery(
        api.addresses.getUserAddresses,
        { userId: user._id }
    );

    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl w-[500px] max-h-[80vh] overflow-y-auto shadow-xl">

                <h2 className="text-lg font-semibold mb-4">
                    User Details
                </h2>

                <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone || "Not added"}</p>
                    <p><strong>Gender:</strong> {user.gender || "Not added"}</p>
                    <p><strong>DOB:</strong> {user.dob || "Not added"}</p>
                    <p><strong>Bio:</strong> {user.bio || "Not added"}</p>
                    <p><strong>Join Date:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleString("en-GB") : "N/A"}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Status:</strong> {user.status}</p>
                    <p><strong>Blocked:</strong> {user.isBlocked ? "Yes" : "No"}</p>
                </div>

                <div className="mt-6">
                    <h3 className="font-semibold mb-3">Addresses</h3>

                    {!addresses && <p>Loading...</p>}

                    {addresses && addresses.length === 0 && (
                        <p className="text-gray-500 text-sm">
                            No addresses added.
                        </p>
                    )}

                    {addresses && addresses.map((addr: any) => (
                        <div
                            key={addr._id}
                            className="border p-3 rounded-lg mb-3"
                        >
                            <p className="font-medium">
                                {addr.label}
                                {addr.isDefault && (
                                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                        Default
                                    </span>
                                )}
                            </p>

                            <p className="text-sm text-gray-600">
                                {addr.street}
                            </p>
                            <p className="text-sm text-gray-600">
                                {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        onClick={onClose}
                        className="bg-purple-600 text-white px-4 py-2 rounded"
                    >
                        Close
                    </button>
                </div>

            </div>
        </div>
    );
}