"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function PersonalInformationSection({ user }: any) {
    const updateProfile = useMutation(api.users.updateProfile);

    // Profile incomplete if required fields missing
    const isIncomplete =
        !user.phone || !user.gender || !user.dob;

    const [editing, setEditing] = useState(isIncomplete);

    const [form, setForm] = useState({
        phone: user.phone || "",
        gender: user.gender || "",
        dob: user.dob || "",
        bio: user.bio || "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setError("");

        // 🔴 Required validation
        if (!form.phone.trim()) {
            setError("Phone is required.");
            return;
        }

        if (!form.gender.trim()) {
            setError("Gender is required.");
            return;
        }

        if (!form.dob.trim()) {
            setError("Date of Birth is required.");
            return;
        }

        try {
            setLoading(true);

            await updateProfile({
                userId: user._id,
                phone: form.phone,
                gender: form.gender,
                dob: form.dob,
                bio: form.bio || undefined, // bio optional
            });

            setEditing(false);
        } catch (err: any) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
            <h2 className="text-xl font-semibold">Your Information</h2>

            {!editing ? (
                <>
                    <div className="space-y-2 text-gray-700">
                        <p><strong>Phone:</strong> {user.phone}</p>
                        <p><strong>Gender:</strong> {user.gender}</p>
                        <p><strong>Date of Birth:</strong> {user.dob}</p>
                        {user.bio && (
                            <p><strong>Bio:</strong> {user.bio}</p>
                        )}
                    </div>

                    <button
                        onClick={() => setEditing(true)}
                        className="mt-4 px-5 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition"
                    >
                        Edit
                    </button>
                </>
            ) : (
                <>
                    <div className="space-y-3">
                        <input
                            placeholder="Phone"
                            className="w-full border p-2 rounded"
                            value={form.phone}
                            onChange={(e) =>
                                setForm({ ...form, phone: e.target.value })
                            }
                        />

                        <select
                            className="w-full border p-2 rounded"
                            value={form.gender}
                            onChange={(e) =>
                                setForm({ ...form, gender: e.target.value })
                            }
                        >
                            <option value="">Select Gender</option>
                            <option value="Female">Female</option>
                            <option value="Male">Male</option>
                            <option value="Other">Other</option>
                        </select>

                        <input
                            type="date"
                            className="w-full border p-2 rounded"
                            value={form.dob}
                            onChange={(e) =>
                                setForm({ ...form, dob: e.target.value })
                            }
                        />

                        <textarea
                            placeholder="Short Bio (Optional)"
                            className="w-full border p-2 rounded"
                            value={form.bio}
                            onChange={(e) =>
                                setForm({ ...form, bio: e.target.value })
                            }
                        />

                        {error && (
                            <p className="text-red-500 text-sm">{error}</p>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="bg-violet-600 text-white px-5 py-2 rounded-full disabled:opacity-50 hover:bg-violet-700 transition"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}