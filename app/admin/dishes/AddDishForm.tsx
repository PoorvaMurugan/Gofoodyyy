"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
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
    const categories = useQuery(api.categories.getCategories);

    const isEdit = !!editData;

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imageType, setImageType] = useState<"url" | "upload">("url");

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        price: "",
        serving: "",
        rating: "",
        calories: "",
        protein: "",
        carbs: "",
        description: "",
        stock: "",
        threshold: "",
        type: "veg" as "veg" | "nonveg",
        image: "",
        imageFile: null as File | null,
    });

    useEffect(() => {
        if (editData) {
            const nutrition = editData.nutrition || "";

            const caloriesMatch = nutrition.match(/Calories:\s*(\d+)/);
            const proteinMatch = nutrition.match(/Protein:\s*(\d+)/);
            const carbsMatch = nutrition.match(/Carbs:\s*(\d+)/);

            setForm({
                name: editData.name,
                categoryId: editData.categoryId,
                price: String(editData.price),
                serving: editData.serving,
                rating: String(editData.rating),
                calories: caloriesMatch ? caloriesMatch[1] : "",
                protein: proteinMatch ? proteinMatch[1] : "",
                carbs: carbsMatch ? carbsMatch[1] : "",
                description: editData.description,
                stock: String(editData.stock ?? ""),
                threshold: String(editData.threshold ?? ""),
                type: editData.type,
                image: editData.image,
                imageFile: null,
            });
        }
    }, [editData]);

    const handleSubmit = async () => {
        console.log("FORM DATA:", form);

        const priceNumber = Number(form.price);
        const ratingNumber = Number(form.rating);
        const stockNumber = Number(form.stock);
        const thresholdNumber = Number(form.threshold);

        if (
            form.name.trim() === "" ||
            form.categoryId.trim() === "" ||
            form.serving.trim() === "" ||
            form.calories.trim() === "" ||
            form.protein.trim() === "" ||
            form.carbs.trim() === "" ||
            form.description.trim() === "" ||
            isNaN(priceNumber) ||
            isNaN(ratingNumber) ||
            isNaN(stockNumber) ||
            isNaN(thresholdNumber) ||
            (imageType === "url" && form.image.trim() === "") ||
            (imageType === "upload" && !form.imageFile)
        ) {
            alert("Fill all required fields correctly!");
            return;
        }

        setLoading(true);
        setSuccess(false);

        let finalImage = form.image;

        if (imageType === "upload" && form.imageFile) {
            finalImage = URL.createObjectURL(form.imageFile);
        }

        const dishPayload = {
            name: form.name,
            categoryId: form.categoryId as Id<"categories">,
            price: priceNumber,
            serving: form.serving,
            rating: ratingNumber,
            image: finalImage,
            description: form.description,
            nutrition: `Calories: ${form.calories} | Protein: ${form.protein}g | Carbs: ${form.carbs}g`,
            type: form.type,
            stock: stockNumber,
            threshold: thresholdNumber,
        };

        try {
            if (isEdit) {
                await updateDish({
                    id: editData._id as Id<"dishes">,
                    ...dishPayload,
                });
            } else {
                await addDish(dishPayload);
            }

            setSuccess(true);

            if (!isEdit) {
                setForm({
                    name: "",
                    categoryId: "",
                    price: "",
                    serving: "",
                    rating: "",
                    calories: "",
                    protein: "",
                    carbs: "",
                    description: "",
                    stock: "",
                    threshold: "",
                    type: "veg",
                    image: "",
                    imageFile: null,
                });
            }

            onClose?.();
        } finally {
            setLoading(false);
        }
    };

    if (!categories) return <p>Loading categories...</p>;

    return (
        <div className="bg-white rounded-2xl p-2">
            <h2 className="text-2xl font-bold mb-6">
                {isEdit ? "Edit Dish" : "Add New Dish"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <Input label="Dish Name *" value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })} />

                <div>
                    <label className="block mb-2 font-medium">Category *</label>
                    <select
                        value={form.categoryId}
                        onChange={(e) =>
                            setForm({ ...form, categoryId: e.target.value })
                        }
                        className="w-full border p-3 rounded-xl"
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat._id} value={cat._id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <Input label="Price *" type="number"
                    value={form.price}
                    onChange={(v) => setForm({ ...form, price: v })} />

                <Input label="Serving *"
                    value={form.serving}
                    onChange={(v) => setForm({ ...form, serving: v })} />

                <Input label="Calories *" type="number"
                    value={form.calories}
                    onChange={(v) => setForm({ ...form, calories: v })} />

                <Input label="Protein (g) *" type="number"
                    value={form.protein}
                    onChange={(v) => setForm({ ...form, protein: v })} />

                <Input label="Carbs (g) *" type="number"
                    value={form.carbs}
                    onChange={(v) => setForm({ ...form, carbs: v })} />

                <Input label="Rating *" type="number"
                    value={form.rating}
                    onChange={(v) => setForm({ ...form, rating: v })} />

                <Input label="Stock *" type="number"
                    value={form.stock}
                    onChange={(v) => setForm({ ...form, stock: v })} />

                <Input label="Low Stock Threshold *" type="number"
                    value={form.threshold}
                    onChange={(v) => setForm({ ...form, threshold: v })} />

                <div>
                    <label className="block mb-2 font-medium">Type *</label>
                    <select
                        value={form.type}
                        onChange={(e) =>
                            setForm({ ...form, type: e.target.value as "veg" | "nonveg" })
                        }
                        className="w-full border p-3 rounded-xl"
                    >
                        <option value="veg">Veg</option>
                        <option value="nonveg">Non-Veg</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">Dish Image *</label>

                    <div className="flex gap-4 mb-3">
                        <button
                            type="button"
                            onClick={() => setImageType("url")}
                            className={`px-4 py-2 rounded-lg border ${imageType === "url" ? "bg-purple-600 text-white" : ""}`}
                        >
                            Image URL
                        </button>

                        <button
                            type="button"
                            onClick={() => setImageType("upload")}
                            className={`px-4 py-2 rounded-lg border ${imageType === "upload" ? "bg-purple-600 text-white" : ""}`}
                        >
                            Upload
                        </button>
                    </div>

                    {imageType === "url" ? (
                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={form.image}
                            onChange={(e) =>
                                setForm({ ...form, image: e.target.value })
                            }
                            className="w-full border p-3 rounded-xl"
                        />
                    ) : (
                        <div className="border-2 border-dashed rounded-xl p-6 text-center relative cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        imageFile: e.target.files?.[0] || null,
                                    })
                                }
                            />

                            {!form.imageFile ? (
                                <>
                                    <UploadCloud className="mx-auto mb-2 text-gray-500" />
                                    <p>Click to upload image</p>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={URL.createObjectURL(form.imageFile)}
                                        className="h-48 mx-auto rounded-lg object-cover"
                                    />
                                    <p className="text-green-600 mt-2">
                                        Image uploaded successfully ✅
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block mb-2 font-medium">Description *</label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({ ...form, description: e.target.value })
                        }
                        className="w-full border p-3 rounded-xl"
                    />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="mt-8 w-full bg-purple-600 text-white py-3 rounded-xl flex justify-center items-center gap-2"
            >
                {loading && <Loader2 className="animate-spin" size={18} />}
                {isEdit ? "Save Changes" : "Add Dish"}
            </button>

            {success && (
                <div className="mt-4 bg-green-100 text-green-700 p-3 rounded-lg text-center">
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