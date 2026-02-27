"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { UploadCloud, Loader2 } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from "@/components/ui/select";

import { AdminFormLayout } from "@/components/admin/form/AdminFormLayout";
import { AdminFormField } from "@/components/admin/form/AdminFormField";

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
    const [imageType, setImageType] = useState<"url" | "upload">("url");
    const [imageError, setImageError] = useState(false);

    const [form, setForm] = useState({
        name: "",
        categoryId: "",
        price: "",
        serving: "",
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

    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        if (editData) {
            setForm({
                name: editData.name,
                categoryId: editData.categoryId,
                price: String(editData.price),
                serving: editData.serving,
                calories: "",
                protein: "",
                carbs: "",
                description: editData.description,
                stock: String(editData.stock ?? ""),
                threshold: String(editData.threshold ?? ""),
                type: editData.type,
                image: editData.image,
                imageFile: null,
            });
        }
    }, [editData]);

    /* ---------------- VALIDATION ---------------- */

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!form.name.trim())
            newErrors.name = "Dish name is required";

        if (!form.categoryId)
            newErrors.categoryId = "Please select category";

        if (!form.price || Number(form.price) <= 0)
            newErrors.price = "Enter valid price (> 0)";

        if (!form.serving.trim())
            newErrors.serving = "Serving information required";

        if (!form.description.trim())
            newErrors.description = "Description required";

        if (form.stock === "" || Number(form.stock) < 0)
            newErrors.stock = "Enter valid stock quantity";

        if (form.threshold === "" || Number(form.threshold) < 0)
            newErrors.threshold = "Enter valid threshold";

        if (Number(form.calories) < 0)
            newErrors.calories = "Calories cannot be negative";

        if (Number(form.protein) < 0)
            newErrors.protein = "Protein cannot be negative";

        if (Number(form.carbs) < 0)
            newErrors.carbs = "Carbs cannot be negative";

        if (imageType === "url") {
            if (!form.image.trim()) {
                newErrors.image = "Image URL required";
            } else {
                try {
                    new URL(form.image);
                } catch {
                    newErrors.image = "Enter valid image URL";
                }
            }
        }

        if (imageType === "upload" && !form.imageFile) {
            newErrors.image = "Please upload image";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        const finalImage =
            imageType === "upload" && form.imageFile
                ? URL.createObjectURL(form.imageFile)
                : form.image;

        const dishPayload = {
            name: form.name,
            categoryId: form.categoryId as Id<"categories">,
            price: Number(form.price),
            serving: form.serving,
            image: finalImage,
            description: form.description,
            nutrition: `Calories: ${form.calories} | Protein: ${form.protein}g | Carbs: ${form.carbs}g`,
            type: form.type,
            stock: Number(form.stock),
            threshold: Number(form.threshold),
        };

        try {
            setLoading(true);

            if (isEdit) {
                await updateDish({
                    id: editData._id as Id<"dishes">,
                    ...dishPayload,
                });
            } else {
                await addDish(dishPayload);
            }

            onClose?.();
        } finally {
            setLoading(false);
        }
    };

    if (!categories) return <p>Loading categories...</p>;

    const inputClass = (field: string) =>
        errors[field] ? "border-red-500" : "";

    /* ---------------- UI ---------------- */

    return (
        <AdminFormLayout title={isEdit ? "Edit Dish" : "Add Dish"}>
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* BASIC INFO */}
                <div className="grid md:grid-cols-2 gap-6">

                    <AdminFormField label="Dish Name">
                        <Input
                            className={inputClass("name")}
                            value={form.name}
                            onChange={(e) => {
                                setForm({ ...form, name: e.target.value });
                                setErrors({ ...errors, name: "" });
                            }}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                    </AdminFormField>

                    <AdminFormField label="Category">
                        <Select
                            value={form.categoryId}
                            onValueChange={(val) => {
                                setForm({ ...form, categoryId: val });
                                setErrors({ ...errors, categoryId: "" });
                            }}
                        >
                            <SelectTrigger className={inputClass("categoryId")}>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat._id} value={cat._id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                    </AdminFormField>

                    <AdminFormField label="Price">
                        <Input
                            type="number"
                            className={inputClass("price")}
                            value={form.price}
                            onChange={(e) => {
                                setForm({ ...form, price: e.target.value });
                                setErrors({ ...errors, price: "" });
                            }}
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
                    </AdminFormField>

                    <AdminFormField label="Serving">
                        <Input
                            className={inputClass("serving")}
                            value={form.serving}
                            onChange={(e) => {
                                setForm({ ...form, serving: e.target.value });
                                setErrors({ ...errors, serving: "" });
                            }}
                        />
                        {errors.serving && <p className="text-red-500 text-sm mt-1">{errors.serving}</p>}
                    </AdminFormField>

                </div>

                {/* NUTRITION */}
                <div className="grid md:grid-cols-3 gap-6">
                    <AdminFormField label="Calories">
                        <Input
                            type="number"
                            className={inputClass("calories")}
                            value={form.calories}
                            onChange={(e) => {
                                setForm({ ...form, calories: e.target.value });
                                setErrors({ ...errors, calories: "" });
                            }}
                        />
                        {errors.calories && <p className="text-red-500 text-sm mt-1">{errors.calories}</p>}
                    </AdminFormField>

                    <AdminFormField label="Protein (g)">
                        <Input
                            type="number"
                            className={inputClass("protein")}
                            value={form.protein}
                            onChange={(e) => {
                                setForm({ ...form, protein: e.target.value });
                                setErrors({ ...errors, protein: "" });
                            }}
                        />
                        {errors.protein && <p className="text-red-500 text-sm mt-1">{errors.protein}</p>}
                    </AdminFormField>

                    <AdminFormField label="Carbs (g)">
                        <Input
                            type="number"
                            className={inputClass("carbs")}
                            value={form.carbs}
                            onChange={(e) => {
                                setForm({ ...form, carbs: e.target.value });
                                setErrors({ ...errors, carbs: "" });
                            }}
                        />
                        {errors.carbs && <p className="text-red-500 text-sm mt-1">{errors.carbs}</p>}
                    </AdminFormField>
                </div>

                {/* IMAGE SECTION */}
                <AdminFormField label="Dish Image Source">
                    <Select
                        value={imageType}
                        onValueChange={(val: "url" | "upload") => {
                            setImageType(val);
                            setErrors({ ...errors, image: "" });
                        }}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="url">Image URL</SelectItem>
                            <SelectItem value="upload">Upload</SelectItem>
                        </SelectContent>
                    </Select>
                </AdminFormField>

                {imageType === "url" && (
                    <AdminFormField label="Image URL">
                        <Input
                            className={inputClass("image")}
                            value={form.image}
                            onChange={(e) => {
                                setForm({ ...form, image: e.target.value });
                                setErrors({ ...errors, image: "" });
                            }}
                        />
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

                        {form.image && !errors.image && (
                            <div className="mt-4">
                                <img
                                    src={form.image}
                                    onError={() => setImageError(true)}
                                    className="h-40 rounded-md object-cover border"
                                />
                                {imageError && (
                                    <p className="text-red-500 text-sm mt-2">
                                        Image not reachable
                                    </p>
                                )}
                            </div>
                        )}
                    </AdminFormField>
                )}

                {imageType === "upload" && (
                    <AdminFormField label="Upload Image">
                        <div className={`border border-dashed p-6 rounded-md text-center relative cursor-pointer hover:bg-gray-50 ${inputClass("image")}`}>
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0"
                                onChange={(e) => {
                                    setForm({
                                        ...form,
                                        imageFile: e.target.files?.[0] || null,
                                    });
                                    setErrors({ ...errors, image: "" });
                                }}
                            />

                            {!form.imageFile ? (
                                <>
                                    <UploadCloud className="mx-auto mb-2 text-gray-500" />
                                    <p>Click to upload</p>
                                </>
                            ) : (
                                <img
                                    src={URL.createObjectURL(form.imageFile)}
                                    className="h-40 mx-auto rounded-md object-cover"
                                />
                            )}
                        </div>
                        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
                    </AdminFormField>
                )}

                {/* STOCK */}
                <div className="grid md:grid-cols-2 gap-6">
                    <AdminFormField label="Stock">
                        <Input
                            type="number"
                            className={inputClass("stock")}
                            value={form.stock}
                            onChange={(e) => {
                                setForm({ ...form, stock: e.target.value });
                                setErrors({ ...errors, stock: "" });
                            }}
                        />
                        {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
                    </AdminFormField>

                    <AdminFormField label="Low Stock Threshold">
                        <Input
                            type="number"
                            className={inputClass("threshold")}
                            value={form.threshold}
                            onChange={(e) => {
                                setForm({ ...form, threshold: e.target.value });
                                setErrors({ ...errors, threshold: "" });
                            }}
                        />
                        {errors.threshold && <p className="text-red-500 text-sm mt-1">{errors.threshold}</p>}
                    </AdminFormField>
                </div>

                {/* DESCRIPTION */}
                <AdminFormField label="Description">
                    <Textarea
                        rows={4}
                        className={inputClass("description")}
                        value={form.description}
                        onChange={(e) => {
                            setForm({ ...form, description: e.target.value });
                            setErrors({ ...errors, description: "" });
                        }}
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </AdminFormField>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-6 border-t">
                    {onClose && (
                        <Button type="button" variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 animate-spin" size={16} />}
                        {isEdit ? "Save Changes" : "Add Dish"}
                    </Button>
                </div>

            </form>
        </AdminFormLayout>
    );
}