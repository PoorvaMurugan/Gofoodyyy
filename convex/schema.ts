import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

    // =========================
    // DISHES TABLE
    // =========================
    dishes: defineTable({
        name: v.string(),
        categoryId: v.id("categories"),
        price: v.number(),
        serving: v.string(),

        // ✅ Rating is now optional
        rating: v.optional(v.number()),

        image: v.string(),
        description: v.string(),
        nutrition: v.string(),
        type: v.union(
            v.literal("veg"),
            v.literal("nonveg")
        ),
        isAvailable: v.boolean(),
        isDeleted: v.boolean(),
        stock: v.number(),
        threshold: v.number(),
    }).index("by_category", ["categoryId"]),

    // =========================
    // CATEGORIES TABLE
    // =========================
    categories: defineTable({
        name: v.string(),
        image: v.string(),
        isActive: v.boolean(),
    }),

    // =========================
    // USERS TABLE
    // =========================
    users: defineTable({
        email: v.string(),
        name: v.string(),

        phone: v.optional(v.string()),
        gender: v.optional(v.string()),
        dob: v.optional(v.string()),
        bio: v.optional(v.string()),
        updatedAt: v.optional(v.number()),

        role: v.union(
            v.literal("admin"),
            v.literal("customer")
        ),

        status: v.union(
            v.literal("active"),
            v.literal("inactive")
        ),

        isBlocked: v.boolean(),

        createdAt: v.number(),
    }).index("by_email", ["email"]),

    // =========================
    // ADDRESSES TABLE
    // =========================
    addresses: defineTable({
        userId: v.id("users"),
        label: v.string(),
        street: v.string(),
        city: v.string(),
        state: v.string(),
        pincode: v.string(),
        isDefault: v.boolean(),
    }).index("by_user", ["userId"]),

});