"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UploadCloud, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Props {
    editData?: any;
    onClose?: () => void;
}

export default function AddDishForm({ editData, onClose }: Props) {
    const addDish = useMutation(api.dishes.addDish);
    const updateDish = useMutation(api.dishes.updateDish);

    const isEdit = !!editData;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imageType, setImageType] = useState<"url" | "upload">("url");

    const [form, setForm] = useState({
        name: "",
        category: "",
        price: "",
        serving: "",
        rating: "",
        calories: "",
        protein: "",
        carbs: "",
        description: "",
        type: "veg" as "veg" | "nonveg",
        image: "",
        imageFile: null as File | null,
    });

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name,
                category: editData.category,
                price: String(editData.price),
                serving: editData.serving,
                rating: String(editData.rating),
                calories: "",
                protein: "",
                carbs: "",
                description: editData.description,
                type: editData.type,
                image: editData.image,
                imageFile: null,
            });
        }
    }, [editData]);

    const handleSubmit = async () => {
        if (
            !form.name ||
            !form.category ||
            !form.price ||
            !form.serving ||
            !form.rating ||
            !form.description ||
            (imageType === "url" && !form.image) ||
            (imageType === "upload" && !form.imageFile)
        ) {
            alert("Fill all required fields!");
            return;
        }

        setLoading(true);
        setSuccess(false);

        let finalImage = form.image;

        // ⚠️ Local preview only (works for now)
        if (imageType === "upload" && form.imageFile) {
            finalImage = URL.createObjectURL(form.imageFile);
        }

        try {
            if (isEdit) {
                await updateDish({
                    id: editData._id as Id<"dishes">,
                    name: form.name,
                    category: form.category,
                    price: Number(form.price),
                    serving: form.serving,
                    rating: Number(form.rating),
                    image: finalImage,
                    description: form.description,
                    nutrition: editData.nutrition,
                    type: form.type,
                });
            } else {
                await addDish({
                    name: form.name,
                    category: form.category,
                    price: Number(form.price),
                    serving: form.serving,
                    rating: Number(form.rating),
                    image: finalImage,
                    description: form.description,
                    nutrition: `Calories: ${form.calories} | Protein: ${form.protein}g | Carbs: ${form.carbs}g`,
                    type: form.type,
                });
            }

            setSuccess(true);

            // Auto clear form only when adding new dish
            if (!isEdit) {
                setForm({
                    name: "",
                    category: "",
                    price: "",
                    serving: "",
                    rating: "",
                    calories: "",
                    protein: "",
                    carbs: "",
                    description: "",
                    type: "veg",
                    image: "",
                    imageFile: null,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl">

            {/* HEADER WITH CLOSE BUTTON */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">
                    {isEdit ? "Edit Dish" : "Add New Dish"}
                </h2>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
                    >
                        Close ✕
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input
                    label="Dish Name *"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                />

                <div>
                    <label className="block mb-2 font-medium">Category *</label>
                    <select
                        value={form.category}
                        onChange={(e) =>
                            setForm({ ...form, category: e.target.value })
                        }
                        className="w-full border p-3 rounded-xl"
                    >
                        <option value="">Select Category</option>
                        <option>Pizza</option>
                        <option>Burger</option>
                        <option>Pasta</option>
                        <option>Dessert</option>
                        <option>Drinks</option>
                    </select>
                </div>

                <Input
                    label="Price *"
                    type="number"
                    value={form.price}
                    onChange={(v) => setForm({ ...form, price: v })}
                />

                <Input
                    label="Serving *"
                    value={form.serving}
                    onChange={(v) => setForm({ ...form, serving: v })}
                />

                <Input
                    label="Rating *"
                    type="number"
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })}
                />

                <div>
                    <label className="block mb-2 font-medium">Type *</label>
                    <select
                        value={form.type}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                type: e.target.value as "veg" | "nonveg",
                            })
                        }
                        className="w-full border p-3 rounded-xl"
                    >
                        <option value="veg">Veg</option>
                        <option value="nonveg">Non-Veg</option>
                    </select>
                </div>

                {/* NUTRITION */}
                <div className="md:col-span-2 grid grid-cols-3 gap-4">
                    <Input
                        label="Calories"
                        value={form.calories}
                        onChange={(v) => setForm({ ...form, calories: v })}
                    />
                    <Input
                        label="Protein (g)"
                        value={form.protein}
                        onChange={(v) => setForm({ ...form, protein: v })}
                    />
                    <Input
                        label="Carbs (g)"
                        value={form.carbs}
                        onChange={(v) => setForm({ ...form, carbs: v })}
                    />
                </div>

                {/* IMAGE SECTION */}
                <div className="md:col-span-2">
                    <div className="flex gap-4 mb-3">
                        <button
                            type="button"
                            onClick={() => setImageType("url")}
                            className={`px-4 py-2 rounded-lg border transition ${imageType === "url"
                                    ? "bg-purple-600 text-white"
                                    : ""
                                }`}
                        >
                            Image URL
                        </button>

                        <button
                            type="button"
                            onClick={() => setImageType("upload")}
                            className={`px-4 py-2 rounded-lg border transition ${imageType === "upload"
                                    ? "bg-purple-600 text-white"
                                    : ""
                                }`}
                        >
                            Upload
                        </button>
                    </div>

                    {imageType === "url" ? (
                        <Input
                            label="Image URL *"
                            value={form.image}
                            onChange={(v) =>
                                setForm({ ...form, image: v })
                            }
                        />
                    ) : (
                        <div className="border-2 border-dashed rounded-xl p-6 text-center relative cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        imageFile:
                                            e.target.files?.[0] || null,
                                    })
                                }
                            />

                            {!form.imageFile ? (
                                <>
                                    <UploadCloud
                                        size={40}
                                        className="mx-auto mb-2 text-gray-500"
                                    />
                                    <p className="text-gray-600">
                                        Click to upload image
                                    </p>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={URL.createObjectURL(
                                            form.imageFile
                                        )}
                                        className="h-48 mx-auto rounded-lg object-cover"
                                    />
                                    <p className="text-green-600 mt-2 font-medium">
                                        Image uploaded successfully ✅
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">
                        Description *
                    </label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                        className="w-full border p-3 rounded-xl"
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-8 w-full bg-purple-600 hover:bg-purple-700 transition text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
            >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {isEdit ? "Save Changes" : "Add Dish"}
            </button>

            {success && (
                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center font-medium">
                    Dish successfully {isEdit ? "updated" : "added"} 🎉
                </div>
            )}
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    type = "text",
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    type?: string;
}) {
    return (
        <div>
            <label className="block mb-2 font-medium">{label}</label>
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border p-3 rounded-xl"
            />
        </div>
    );
}