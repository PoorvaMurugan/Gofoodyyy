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

export default function AddDishForm({ editData, onClose }: Props) {
    const addDish = useMutation(api.dishes.addDish);
    const updateDish = useMutation(api.dishes.updateDish);
    const categories = useQuery(api.categories.getCategories);

    const isEdit = !!editData;

    const [loading, setLoading] = useState(false);
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
            setForm({
                name: editData.name,
                categoryId: editData.categoryId,
                price: String(editData.price),
                serving: editData.serving,
                rating: String(editData.rating),
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

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        const dishPayload = {
            name: form.name,
            categoryId: form.categoryId as Id<"categories">,
            price: Number(form.price),
            serving: form.serving,
            rating: Number(form.rating),
            image:
                imageType === "upload" && form.imageFile
                    ? URL.createObjectURL(form.imageFile)
                    : form.image,
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

    return (
        <AdminFormLayout
            title={isEdit ? "Edit Dish" : "Add Dish"}
        >
            <form onSubmit={handleSubmit} className="space-y-8">

                {/* BASIC INFO */}
                <div className="grid md:grid-cols-2 gap-6">

                    <AdminFormField label="Dish Name">
                        <Input
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Category">
                        <Select
                            value={form.categoryId}
                            onValueChange={(val) =>
                                setForm({ ...form, categoryId: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem
                                        key={cat._id}
                                        value={cat._id}
                                    >
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </AdminFormField>

                    <AdminFormField label="Price">
                        <Input
                            type="number"
                            value={form.price}
                            onChange={(e) =>
                                setForm({ ...form, price: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Serving">
                        <Input
                            value={form.serving}
                            onChange={(e) =>
                                setForm({ ...form, serving: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Rating">
                        <Input
                            type="number"
                            value={form.rating}
                            onChange={(e) =>
                                setForm({ ...form, rating: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Type">
                        <Select
                            value={form.type}
                            onValueChange={(val: "veg" | "nonveg") =>
                                setForm({ ...form, type: val })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="veg">
                                    Veg
                                </SelectItem>
                                <SelectItem value="nonveg">
                                    Non-Veg
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </AdminFormField>

                </div>

                {/* NUTRITION */}
                <div className="grid md:grid-cols-3 gap-6">

                    <AdminFormField label="Calories">
                        <Input
                            type="number"
                            value={form.calories}
                            onChange={(e) =>
                                setForm({ ...form, calories: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Protein (g)">
                        <Input
                            type="number"
                            value={form.protein}
                            onChange={(e) =>
                                setForm({ ...form, protein: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Carbs (g)">
                        <Input
                            type="number"
                            value={form.carbs}
                            onChange={(e) =>
                                setForm({ ...form, carbs: e.target.value })
                            }
                        />
                    </AdminFormField>

                </div>

                {/* STOCK */}
                <div className="grid md:grid-cols-2 gap-6">

                    <AdminFormField label="Stock">
                        <Input
                            type="number"
                            value={form.stock}
                            onChange={(e) =>
                                setForm({ ...form, stock: e.target.value })
                            }
                        />
                    </AdminFormField>

                    <AdminFormField label="Low Stock Threshold">
                        <Input
                            type="number"
                            value={form.threshold}
                            onChange={(e) =>
                                setForm({ ...form, threshold: e.target.value })
                            }
                        />
                    </AdminFormField>

                </div>

                {/* IMAGE */}
                <AdminFormField label="Dish Image">
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
                                value={form.image}
                                onChange={(e) =>
                                    setForm({ ...form, image: e.target.value })
                                }
                            />
                        </TabsContent>

                        <TabsContent value="upload" className="mt-4">
                            <div className="border border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer relative hover:bg-gray-50 transition">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0"
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
                                        <UploadCloud className="mx-auto mb-2 text-gray-500" />
                                        <p className="text-sm text-gray-600">
                                            Click to upload image
                                        </p>
                                    </>
                                ) : (
                                    <img
                                        src={URL.createObjectURL(
                                            form.imageFile
                                        )}
                                        className="h-40 mx-auto rounded-md object-cover"
                                    />
                                )}
                            </div>
                        </TabsContent>
                    </Tabs>
                </AdminFormField>

                {/* DESCRIPTION */}
                <AdminFormField label="Description">
                    <Textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) =>
                            setForm({
                                ...form,
                                description: e.target.value,
                            })
                        }
                    />
                </AdminFormField>

                {/* ACTIONS */}
                <div className="flex justify-end gap-2 pt-6 border-t border-gray-200">
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
                            <Loader2 className="mr-2 animate-spin" size={16} />
                        )}
                        {isEdit ? "Save Changes" : "Add Dish"}
                    </Button>
                </div>

            </form>
        </AdminFormLayout>
    );
}