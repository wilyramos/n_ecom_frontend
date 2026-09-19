// File: frontend/actions/auth/get-token-action.ts
"use server";

import { getTokenOptional } from "@/src/auth/dal";

export async function getClientToken() {
    const token = await getTokenOptional();
    return token;
}