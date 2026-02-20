import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
    args: {
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .filter((q) => q.eq(q.field("email"), args.email))
            .first();

        if (existing) return existing._id;

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            role: "user",
            createdAt: Date.now(),
        });
    },
});