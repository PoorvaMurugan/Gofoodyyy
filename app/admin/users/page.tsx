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
    Power,
} from "lucide-react";

import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

import { Skeleton } from "@/components/ui/skeleton";

import { useState, useMemo } from "react";
import { DataTable } from "@/components/admin/table/DataTable";
import SideDrawer from "../dishes/SideDrawer";

export default function AdminUsersPage() {
    const users = useQuery(api.users.getAllUsers);
    const updateUser = useMutation(api.users.updateUser);
    const toggleBlock = useMutation(api.users.toggleBlockUser);
    const deleteUser = useMutation(api.users.deleteUser);

    const [viewUser, setViewUser] = useState<any>(null);
    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");

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

    // ✅ SKELETON LOADING
    if (!users) {
        return (
            <div className="space-y-3 p-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full rounded-md" />
                ))}
            </div>
        );
    }

    type UserType = typeof filteredUsers[number];

    const columns = [
        { header: "Name", accessor: "name" as keyof UserType },
        { header: "Email", accessor: "email" as keyof UserType },

        {
            header: "Role",
            cell: (user: UserType) => (
                <Select
                    value={user.role}
                    onValueChange={(value) =>
                        updateUser({
                            id: user._id as Id<"users">,
                            name: user.name,
                            role: value as any,
                            status: user.status,
                        })
                    }
                >
                    <SelectTrigger className="w-[140px] h-9 text-sm">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="customer">Customer</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                </Select>
            ),
        },

        {
            header: "Status",
            cell: (user: UserType) =>
                user.status === "active" ? (
                    <span className="text-green-600 font-medium">Active</span>
                ) : (
                    <span className="text-gray-500 font-medium">Inactive</span>
                ),
        },

        {
            header: "Blocked",
            cell: (user: UserType) =>
                user.isBlocked ? (
                    <span className="text-red-500 font-medium">Yes</span>
                ) : (
                    <span className="text-green-600 font-medium">No</span>
                ),
        },

        {
            header: "Join Date",
            cell: (user: UserType) =>
                user.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-GB")
                    : "N/A",
        },

        {
            header: "Actions",
            cell: (user: UserType) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition">
                            <MoreVertical size={18} />
                        </button>
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
                                updateUser({
                                    id: user._id as Id<"users">,
                                    name: user.name,
                                    role: user.role,
                                    status:
                                        user.status === "active"
                                            ? "inactive"
                                            : "active",
                                })
                            }
                            className="flex items-center gap-2"
                        >
                            <Power size={16} />
                            {user.status === "active"
                                ? "Deactivate"
                                : "Activate"}
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

                        {/* ✅ SHADCN ALERT DIALOG DELETE */}
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex items-center gap-2 text-red-500"
                                >
                                    <Trash size={16} /> Delete
                                </DropdownMenuItem>
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Delete User?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete{" "}
                                        <span className="font-semibold">
                                            {user.name}
                                        </span>.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>

                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>

                                    <AlertDialogAction
                                        className="bg-red-600 hover:bg-red-700"
                                        onClick={async () => {
                                            await deleteUser({
                                                id: user._id as Id<"users">,
                                            });
                                        }}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">

            {/* FILTERS */}
            <div className="flex flex-wrap gap-4 items-center justify-between">
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border border-gray-200 rounded-md px-4 py-2 w-64 text-sm"
                    />

                    <Select
                        value={roleFilter}
                        onValueChange={(value) => setRoleFilter(value)}
                    >
                        <SelectTrigger className="w-[160px]">
                            <SelectValue placeholder="All Roles" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Roles</SelectItem>
                            <SelectItem value="customer">Customer</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={statusFilter}
                        onValueChange={(value) => setStatusFilter(value)}
                    >
                        <SelectTrigger className="w-[160px] h-10 text-sm">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="text-sm text-gray-600">
                    Showing {filteredUsers.length} of {users.length} users
                </div>
            </div>

            <DataTable<UserType>
                columns={columns}
                data={filteredUsers}
                loading={!users}
            />

            <SideDrawer
                isOpen={!!viewUser}
                onClose={() => setViewUser(null)}
                title="User Details"
            >
                {viewUser && <UserDetailsDrawerContent user={viewUser} />}
            </SideDrawer>
        </div>
    );
}

/* ================= DRAWER CONTENT ================= */

function UserDetailsDrawerContent({ user }: any) {
    const addresses = useQuery(
        api.addresses.getUserAddresses,
        { userId: user._id }
    );

    return (
        <div className="space-y-6">

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

            <div>
                <h3 className="font-semibold mb-3">Addresses</h3>

                {!addresses && (
                    <div className="space-y-2">
                        <Skeleton className="h-16 w-full rounded-md" />
                        <Skeleton className="h-16 w-full rounded-md" />
                    </div>
                )}

                {addresses && addresses.length === 0 && (
                    <p className="text-gray-500 text-sm">
                        No addresses added.
                    </p>
                )}

                {addresses && addresses.map((addr: any) => (
                    <div
                        key={addr._id}
                        className="border border-gray-200 p-3 rounded-md mb-3"
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

        </div>
    );
}