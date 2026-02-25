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

export default function AddCategoryForm({ editData, onClose }: Props) {
    const addCategory = useMutation(api.categories.addCategory);
    const updateCategory = useMutation(api.categories.updateCategory);

    const isEdit = !!editData;

    const [name, setName] = useState("");
    const [imageType, setImageType] = useState<"url" | "upload">("url");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    // Prefill data in edit mode
    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setImageUrl(editData.image);
            setImageType("url");
        }
    }, [editData]);

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        let finalImage = imageUrl;

        if (!name) {
            alert("Category name is required");
            return;
        }

        if (imageType === "url" && !imageUrl) {
            alert("Please enter image URL");
            return;
        }

        if (imageType === "upload" && !imageFile) {
            alert("Please upload an image");
            return;
        }

        if (imageType === "upload" && imageFile) {
            finalImage = URL.createObjectURL(imageFile);
        }

        try {
            setLoading(true);

            if (isEdit) {
                await updateCategory({
                    id: editData._id as Id<"categories">,
                    name,
                    image: finalImage,
                });
            } else {
                await addCategory({
                    name,
                    image: finalImage,
                });
            }

            if (onClose) onClose();

            // Reset form (only if adding)
            if (!isEdit) {
                setName("");
                setImageUrl("");
                setImageFile(null);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md">
            <h2 className="text-xl font-semibold mb-6">
                {isEdit ? "✏️ Edit Category" : "➕ Add New Category"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Category Name */}
                <input
                    type="text"
                    placeholder="Category Name (Pizza, Burger...)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border p-3 rounded-xl"
                />

                {/* Image Toggle */}
                <div>
                    <label className="block mb-2 font-medium">
                        Category Image *
                    </label>

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

                    {/* URL Input */}
                    {imageType === "url" ? (
                        <input
                            type="text"
                            placeholder="Enter image URL"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full border p-3 rounded-xl"
                        />
                    ) : (
                        <div className="border-2 border-dashed rounded-xl p-6 text-center relative cursor-pointer hover:bg-gray-50 transition">
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) =>
                                    setImageFile(e.target.files?.[0] || null)
                                }
                            />

                            {!imageFile ? (
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
                                        src={URL.createObjectURL(imageFile)}
                                        className="h-40 mx-auto rounded-lg object-cover"
                                    />
                                    <p className="text-green-600 mt-2 font-medium">
                                        Image uploaded successfully ✅
                                    </p>
                                </>
                            )}
                        </div>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-600 text-white py-3 rounded-xl hover:bg-purple-700 transition flex items-center justify-center gap-2"
                >
                    {loading && <Loader2 className="animate-spin" size={18} />}
                    {isEdit ? "Save Changes" : "Add Category"}
                </button>
            </form>
        </div>
    );
}