import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ===============================
// CREATE USER (Auto on Login)
// ===============================
export const createUser = mutation({
    args: {
        email: v.string(),
        name: v.string(),
    },
    handler: async (ctx, args) => {
        const existing = await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if (existing) return existing._id;

        return await ctx.db.insert("users", {
            email: args.email,
            name: args.name,
            role: "customer",
            status: "active",
            isBlocked: false,
            createdAt: Date.now(),
        });
    },
});

// ===============================
// GET USER BY EMAIL
// ===============================
export const getUserByEmail = query({
    args: {
        email: v.string(),
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("users")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();
    },
});

// ===============================
// GET ALL USERS (Admin)
// ===============================
export const getAllUsers = query({
    handler: async (ctx) => {
        return await ctx.db.query("users").collect();
    },
});

// ===============================
// UPDATE USER (Admin Edit)
// ===============================
export const updateUser = mutation({
    args: {
        id: v.id("users"),
        name: v.string(),
        role: v.union(v.literal("admin"), v.literal("customer")),
        status: v.union(v.literal("active"), v.literal("inactive")),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            name: args.name,
            role: args.role,
            status: args.status,
        });
    },
});

// ===============================
// TOGGLE BLOCK USER (Admin)
// ===============================
export const toggleBlockUser = mutation({
    args: {
        id: v.id("users"),
        isBlocked: v.boolean(),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            isBlocked: args.isBlocked,
        });
    },
});
// ===============================
// DELETE USER (Admin)
// ===============================
export const deleteUser = mutation({
    args: {
        id: v.id("users"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

export const updateProfile = mutation({
    args: {
        userId: v.id("users"),
        phone: v.string(),
        gender: v.string(),
        dob: v.string(),
        bio: v.optional(v.string()), // ✅ bio optional
    },
    handler: async (ctx, args) => {
        if (!args.phone.trim()) throw new Error("Phone is required");
        if (!args.gender.trim()) throw new Error("Gender is required");
        if (!args.dob.trim()) throw new Error("Date of birth is required");

        await ctx.db.patch(args.userId, {
            phone: args.phone,
            gender: args.gender,
            dob: args.dob,
            bio: args.bio || undefined, // ✅ save only if exists
            updatedAt: Date.now(),
        });
    },
});