import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    dishes: defineTable({
        name: v.string(),
        category: v.string(),
        price: v.number(),
        serving: v.string(),
        rating: v.number(),
        image: v.string(),
        description: v.string(),
        nutrition: v.string(),
        type: v.union(v.literal("veg"), v.literal("nonveg")),
        isAvailable: v.boolean(),
        isDeleted: v.boolean(),
    }),

    categories: defineTable({
        name: v.string(),
        image: v.string(),
        isActive: v.boolean(),
    }),
    users: defineTable({
        email: v.string(),
        name: v.string(),
        role: v.string(),
        createdAt: v.number(),
    }),
});