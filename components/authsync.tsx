"use client";

import { useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AuthSync() {
    const user = useUser();
    const createUser = useMutation(api.users.createUser);

    useEffect(() => {
        if (user && user.primaryEmail) {
            createUser({
                name: user.displayName || "User",
                email: user.primaryEmail,
            });
        }
    }, [user, createUser]);

    return null;
}
