"use client";

import { useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, UploadCloud } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { AdminFormLayout } from "@/components/admin/form/AdminFormLayout";
import { AdminFormField } from "@/components/admin/form/AdminFormField";

interface Props {
    editData?: any;
    onClose?: () => void;
}

export default function AddCategoryForm({
    editData,
    onClose,
}: Props) {
    const addCategory = useMutation(api.categories.addCategory);
    const updateCategory = useMutation(api.categories.updateCategory);
    const categories = useQuery(api.categories.getCategories);

    const isEdit = !!editData;

    const [name, setName] = useState("");
    const [imageType, setImageType] = useState<"url" | "upload">("url");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const [errors, setErrors] = useState<{
        name?: string;
        image?: string;
    }>({});

    /* ---------------- RESET + PREFILL ---------------- */

    useEffect(() => {
        if (editData) {
            // Prefill for edit
            setName(editData.name || "");
            setImageUrl(editData.image || "");
            setImageType("url"); // Existing image always treated as URL
            setImageFile(null);
        } else {
            // Reset for add mode
            setName("");
            setImageUrl("");
            setImageFile(null);
            setImageType("url");
        }

        setErrors({});
        setImageError(false);
    }, [editData]);

    /* ---------------- NORMALIZE ---------------- */

    const normalize = (str: string) =>
        str.toLowerCase().trim().replace(/\s+/g, "");

    /* ---------------- VALIDATION ---------------- */

    const validate = () => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = "Category name is required";
        }

        if (categories && name.trim()) {
            const newName = normalize(name);

            const alreadyExists = categories.some((cat) => {
                const existingName = normalize(cat.name);

                return (
                    existingName === newName &&
                    (!isEdit || cat._id !== editData?._id)
                );
            });

            if (alreadyExists) {
                newErrors.name = "Category already exists";
            }
        }

        if (imageType === "url") {
            if (!imageUrl.trim()) {
                newErrors.image = "Image URL is required";
            } else {
                try {
                    new URL(imageUrl);
                } catch {
                    newErrors.image = "Enter a valid image link";
                }
            }
        }

        if (imageType === "upload" && !imageFile) {
            newErrors.image = "Please upload an image";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    /* ---------------- SUBMIT ---------------- */

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validate()) return;

        let finalImage = imageUrl;

        if (imageType === "upload" && imageFile) {
            finalImage = URL.createObjectURL(imageFile);
        }

        try {
            setLoading(true);

            if (isEdit) {
                await updateCategory({
                    id: editData._id as Id<"categories">,
                    name: name.trim(),
                    image: finalImage,
                });
            } else {
                await addCategory({
                    name: name.trim(),
                    image: finalImage,
                });
            }

            if (onClose) onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminFormLayout
            title={isEdit ? "Edit Category" : "Add Category"}
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* CATEGORY NAME */}
                <AdminFormField label="Category Name">
                    <Input
                        placeholder="Pizza, Burger..."
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setErrors((prev) => ({ ...prev, name: undefined }));
                        }}
                        className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 mt-1">
                            {errors.name}
                        </p>
                    )}
                </AdminFormField>

                {/* IMAGE SOURCE */}
                <AdminFormField label="Image Source">
                    <Select
                        value={imageType}
                        onValueChange={(val) =>
                            setImageType(val as "url" | "upload")
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="url">Image URL</SelectItem>
                            <SelectItem value="upload">Upload Image</SelectItem>
                        </SelectContent>
                    </Select>
                </AdminFormField>

                {/* IMAGE URL */}
                {imageType === "url" && (
                    <AdminFormField label="Image URL">
                        <Input
                            placeholder="Paste valid image link"
                            value={imageUrl}
                            onChange={(e) => {
                                setImageUrl(e.target.value);
                                setImageError(false);
                                setErrors((prev) => ({ ...prev, image: undefined }));
                            }}
                            className={errors.image ? "border-red-500" : ""}
                        />

                        {errors.image && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.image}
                            </p>
                        )}

                        {imageUrl && !errors.image && (
                            <div className="mt-4">
                                {!imageError ? (
                                    <img
                                        src={imageUrl}
                                        alt="Preview"
                                        onError={() => setImageError(true)}
                                        className="h-32 rounded-md object-cover border"
                                    />
                                ) : (
                                    <p className="text-sm text-red-500">
                                        Image not reachable or invalid source
                                    </p>
                                )}
                            </div>
                        )}
                    </AdminFormField>
                )}

                {/* IMAGE UPLOAD */}
                {imageType === "upload" && (
                    <AdminFormField label="Upload Image">
                        <div className="border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition relative">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    setImageFile(e.target.files?.[0] || null);
                                    setErrors((prev) => ({ ...prev, image: undefined }));
                                }}
                            />

                            {!imageFile ? (
                                <>
                                    <UploadCloud
                                        size={36}
                                        className="mx-auto mb-2 text-gray-500"
                                    />
                                    <p className="text-sm text-gray-600">
                                        Click to upload image
                                    </p>
                                </>
                            ) : (
                                <>
                                    <img
                                        src={URL.createObjectURL(imageFile)}
                                        className="h-32 mx-auto rounded-md object-cover"
                                    />
                                    <p className="text-sm text-green-600 mt-2">
                                        Image uploaded successfully
                                    </p>
                                </>
                            )}
                        </div>

                        {errors.image && (
                            <p className="text-sm text-red-500 mt-1">
                                {errors.image}
                            </p>
                        )}
                    </AdminFormField>
                )}

                {/* BUTTONS */}
                <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                    {onClose && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button type="submit" disabled={loading}>
                        {loading && (
                            <Loader2
                                className="mr-2 animate-spin"
                                size={16}
                            />
                        )}
                        {isEdit ? "Save Changes" : "Add Category"}
                    </Button>
                </div>

            </form>
        </AdminFormLayout>
    );
}