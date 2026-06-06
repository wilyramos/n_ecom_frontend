// File: frontend/actions/order/create-order-action.ts
"use server";

import type { TCreateOrder, TOrder } from "@/src/schemas";
import getToken from "@/src/auth/token";

type CreateOrderResponse =
    | { ok: true; message: string; order: TOrder; culqiOrderId?: string }
    | { ok: false; message: string };

export async function createOrderAction(order: TCreateOrder): Promise<CreateOrderResponse> {
    const token = await getToken();
    const url = `${process.env.API_URL}/orders`;

    try {
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const res = await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(order),
            cache: "no-store",
        });

        const json = await res.json();

        if (!res.ok) {
            return {
                ok: false,
                message: json.message || "Error al crear la orden"
            };
        }

        // Retornamos de forma explícita el culqiOrderId devuelto por la API del Backend
        return {
            ok: true,
            message: json.message,
            order: json.order as TOrder,
            culqiOrderId: json.culqiOrderId // <--- Propagación crucial para multipago
        };

    } catch (e) {
        console.error("❌ CREATE ORDER ACTION ERROR:", e);
        return {
            ok: false,
            message: "Error de conexión con el servidor"
        };
    }
}