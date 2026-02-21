import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getCategories = query({
    handler: async (ctx) => {
        return await ctx.db.query("categories").collect();
    },
});

export const addCategory = mutation({
    args: {
        name: v.string(),
        image: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("categories", {
            ...args,
            isActive: true,
        });
    },
});