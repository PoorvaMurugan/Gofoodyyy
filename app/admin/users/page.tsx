"use client";

import { Mail } from "lucide-react";

export default function AdminUsers() {
    const users = [
        { id: 1, name: "Swathi", email: "swathi@gmail.com" },
        { id: 2, name: "Ravi", email: "ravi@gmail.com" },
        { id: 3, name: "Arjun", email: "arjun@gmail.com" },
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">
                    Users
                </h1>

                <div className="space-y-4">
                    {users.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center justify-between p-5 rounded-xl border border-gray-100 hover:shadow-md transition"
                        >
                            {/* Left Section */}
                            <div className="flex items-center gap-4">
                                {/* Avatar */}
                                <div className="w-12 h-12 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-semibold text-lg">
                                    {user.name.charAt(0)}
                                </div>

                                {/* Name + Email */}
                                <div>
                                    <p className="font-semibold text-gray-800">
                                        {user.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Mail size={14} />
                                        {user.email}
                                    </div>
                                </div>
                            </div>

                            {/* Right Section */}
                            <button className="text-sm bg-violet-100 text-[#7C3AED] px-4 py-2 rounded-full font-medium hover:bg-violet-200 transition">
                                View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}