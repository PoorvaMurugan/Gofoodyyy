import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        role: v.union(
            v.literal("customer"),
            v.literal("admin"),
            v.literal("delivery")
        ),
        createdAt: v.number(),
    }),

    menuItems: defineTable({
        name: v.string(),
        description: v.string(),
        price: v.number(),
        imageUrl: v.string(),
        category: v.string(),
        isAvailable: v.boolean(),
    }),

    cartItems: defineTable({
        userId: v.id("users"),
        menuItemId: v.id("menuItems"),
        quantity: v.number(),
        createdAt: v.number(),
    }),


});
