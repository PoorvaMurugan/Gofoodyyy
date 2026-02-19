import { query } from "./_generated/server";

export const getMenu = query({
    handler: async (ctx) => {
        return await ctx.db.query("menuItems").collect();
    },
});
