"use client";

import { useUser } from "@stackframe/stack";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import AddressSection from "./AddressSection";
import PersonalInformationSection from "@/components/PersonalInformationSection";

export default function ProfilePage() {
    const user: any = useUser();

    const email =
        user?.email ||
        user?.primaryEmail ||
        user?.primaryEmailAddress?.email ||
        user?.emails?.[0]?.email ||
        null;

    const convexUser = useQuery(
        api.users.getUserByEmail,
        email ? { email } : "skip"
    );

    // 🔒 Not logged in
    if (!user) {
        return (
            <div className="p-10 text-center">
                Please sign in to view your profile.
            </div>
        );
    }

    // ⏳ Still loading
    if (!convexUser) {
        return <div className="p-6">Loading...</div>;
    }

    // 🚫 Blocked user
    if (convexUser.isBlocked || convexUser.status === "inactive") {
        return (
            <div className="p-10 text-center text-red-600 font-semibold">
                Your account is disabled.
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">

            {/* Header Card */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
                <h1 className="text-2xl font-bold">{convexUser.name}</h1>
                <p className="text-gray-500">{convexUser.email}</p>
            </div>

            {/* 🟣 Personal Information Section */}
            <PersonalInformationSection user={convexUser} />

            {/* 🟣 Address Section */}
            <AddressSection userId={convexUser._id} />

        </div>
    );
}