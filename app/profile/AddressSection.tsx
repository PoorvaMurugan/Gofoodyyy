"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";

export default function AddressSection({ userId }: any) {
    const addresses = useQuery(api.addresses.getUserAddresses, { userId });
    const addAddress = useMutation(api.addresses.addAddress);
    const setDefault = useMutation(api.addresses.setDefaultAddress);

    const [form, setForm] = useState({
        label: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
    });

    if (!addresses) return <div>Loading...</div>;

    const handleAdd = async () => {
        await addAddress({ userId, ...form });
        setForm({
            label: "",
            street: "",
            city: "",
            state: "",
            pincode: "",
        });
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-semibold mb-6">My Addresses</h2>

            <div className="space-y-4">
                {addresses.map((addr: any) => (
                    <div
                        key={addr._id}
                        className="border rounded-xl p-4 flex justify-between"
                    >
                        <div>
                            <h3 className="font-semibold">
                                {addr.label}
                                {addr.isDefault && (
                                    <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                        Default
                                    </span>
                                )}
                            </h3>

                            <p className="text-sm text-gray-600">
                                {addr.street}, {addr.city}, {addr.state} - {addr.pincode}
                            </p>
                        </div>

                        {!addr.isDefault && (
                            <button
                                onClick={() =>
                                    setDefault({
                                        userId,
                                        addressId: addr._id,
                                    })
                                }
                                className="text-sm text-violet-600"
                            >
                                Set Default
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Add Form */}
            <div className="mt-6 space-y-3">
                <input
                    placeholder="Label (Home, Work)"
                    className="w-full border p-2 rounded"
                    value={form.label}
                    onChange={(e) =>
                        setForm({ ...form, label: e.target.value })
                    }
                />
                <input
                    placeholder="Street"
                    className="w-full border p-2 rounded"
                    value={form.street}
                    onChange={(e) =>
                        setForm({ ...form, street: e.target.value })
                    }
                />
                <input
                    placeholder="City"
                    className="w-full border p-2 rounded"
                    value={form.city}
                    onChange={(e) =>
                        setForm({ ...form, city: e.target.value })
                    }
                />
                <input
                    placeholder="State"
                    className="w-full border p-2 rounded"
                    value={form.state}
                    onChange={(e) =>
                        setForm({ ...form, state: e.target.value })
                    }
                />
                <input
                    placeholder="Pincode"
                    className="w-full border p-2 rounded"
                    value={form.pincode}
                    onChange={(e) =>
                        setForm({ ...form, pincode: e.target.value })
                    }
                />

                <button
                    onClick={handleAdd}
                    className="bg-violet-600 text-white px-5 py-2 rounded-full"
                >
                    Add Address
                </button>
            </div>
        </div>
    );
}