"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader2, UploadCloud } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from "@/components/ui/tabs";

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

    const isEdit = !!editData;

    const [name, setName] = useState("");
    const [imageType, setImageType] = useState<"url" | "upload">("url");
    const [imageUrl, setImageUrl] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (editData) {
            setName(editData.name);
            setImageUrl(editData.image);
            setImageType("url");
        }
    }, [editData]);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
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
        <AdminFormLayout
            title={isEdit ? "Edit Category" : "Add Category"}
        >
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* CATEGORY NAME */}
                <AdminFormField label="Category Name">
                    <Input
                        placeholder="Pizza, Burger..."
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </AdminFormField>

                {/* IMAGE SECTION */}
                <AdminFormField label="Category Image">
                    <Tabs
                        value={imageType}
                        onValueChange={(val: string) =>
                            setImageType(val as "url" | "upload")
                        }
                    >
                        <TabsList className="grid grid-cols-2">
                            <TabsTrigger value="url">
                                Image URL
                            </TabsTrigger>
                            <TabsTrigger value="upload">
                                Upload
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="url" className="mt-4">
                            <Input
                                placeholder="https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </TabsContent>

                        <TabsContent value="upload" className="mt-4">
                            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:bg-gray-50 transition relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={(e) =>
                                        setImageFile(
                                            e.target.files?.[0] || null
                                        )
                                    }
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
                                            Image uploaded
                                        </p>
                                    </>
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </AdminFormField>

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