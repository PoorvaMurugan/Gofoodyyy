import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

/* GET ALL ACTIVE */
export const getCategories = query({
    handler: async (ctx) => {
        return await ctx.db
            .query("categories")
            .filter((q) => q.eq(q.field("isActive"), true))
            .collect();
    },
});

/* GET ALL (ADMIN VIEW) */
export const getAllCategories = query({
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

/* ADD */
export const addCategory = mutation({
    args: {
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("categories", {
            name: args.name,
            image: args.image,
            isActive: true, // 🔥 important
        });
    },
});

/* UPDATE */
export const updateCategory = mutation({
    args: {
        id: v.id("categories"),
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            name: args.name,
            image: args.image,
        });
    },
});

/* SOFT DELETE (Recommended Instead of Hard Delete) */
export const deleteCategory = mutation({
    args: { id: v.id("categories") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            isActive: false,
        });
    },
});