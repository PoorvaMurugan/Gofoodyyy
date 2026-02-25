import { query } from "./_generated/server";

export const getDashboardStats = query({
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();

        return {
            totalUsers: users.length,
            totalOrders: 0,   // temporary
            totalRevenue: 0,  // temporary
        };
    },
});