//File: frontend/src/services/orders.ts

import "server-only"

import { getTokenOptional } from "@/src/auth/dal"
import {
    OrdersByCitySchema,
    OrdersByStatusSchema,
    OrdersListResponseSchema,
    OrdersOverTimeSchema,
    OrdersSummarySchema,
    OrderPopulatedSchema
} from "@/src/schemas";

type GetOrdersParams = {
    page?: number;
    limit?: number;
    pedido?: string;
    fecha?: string;
    fechaFin?: string;
    estadoPago?: string;
    estadoEnvio?: string;
    montoMin?: string;
    montoMax?: string;
}

export const getOrders = async ({
    page = 1,
    limit = 25,
    ...filters
}: GetOrdersParams) => {
    const token = await getTokenOptional();

    const params = new URLSearchParams();

    // Agregar filtros dinámicamente
    Object.entries(filters).forEach(([key, value]) => {
        if (value && String(value).trim() !== '') {
            params.append(key, String(value));
        }
    });

    params.set('page', page.toString());
    params.set('limit', limit.toString());

    const url = `${process.env.API_URL}/orders?${params.toString()}`;

    const req = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const orders = OrdersListResponseSchema.parse(json);
    return orders;
}

export const getOrder = async (id: string) => {
    const token = await getTokenOptional();

    const url = `${process.env.API_URL}/orders/${id}`;

    const req = await fetch(url, {
        method: 'GET',
        cache: 'no-store',

        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const order = OrderPopulatedSchema.parse(json);
    return order;
}

export const getOrdersByUser = async ({ page = 1, limit = 5 }) => {
    const token = await getTokenOptional();
    const url = `${process.env.API_URL}/orders/user/me?page=${page}&limit=${limit}`;

    const req = await fetch(url, {
        method: 'GET',
        cache: 'no-store',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if (!req.ok) {
        return null;
    }

    const json = await req.json();
    const orders = OrdersListResponseSchema.parse(json);
    return orders;
}

interface GetOrdersReportsParams {
    fechaInicio?: string;
    fechaFin?: string;
}

export const getSummaryOrders = async (params: GetOrdersReportsParams) => {
    try {
        const token = await getTokenOptional();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);

        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/orders/reports/sales-summary?${queryParams.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!req.ok) {
            return null;
        }

        const json = await req.json();
        const summary = OrdersSummarySchema.parse(json);
        return summary;
    } catch (error) {
        console.error("Error fetching sales summary:", error);
        return null;
    }
}

export const getOrdersOverTime = async (params: GetOrdersReportsParams) => {
    try {
        const token = await getTokenOptional();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);

        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/orders/reports/sales-over-time?${queryParams.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!req.ok) {
            return [];
        }

        const json = await req.json();
        const ordersOverTime = OrdersOverTimeSchema.array().parse(json);
        return ordersOverTime;
    } catch (error) {
        console.error("Error fetching sales over time:", error);
        return [];
    }
}

export const getReportOrdersByStatus = async (params: GetOrdersReportsParams) => {
    try {
        const token = await getTokenOptional();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);

        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/orders/reports/orders-by-status?${queryParams.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!req.ok) {
            return [];
        }

        const json = await req.json();
        const ordersByStatus = OrdersByStatusSchema.array().parse(json);
        return ordersByStatus;
    } catch (error) {
        console.error("Error fetching orders by status:", error);
        return [];
    }
}

export const getReportOrdersByCity = async (params: GetOrdersReportsParams) => {
    try {
        const token = await getTokenOptional();
        let { fechaInicio, fechaFin } = params;

        const getDate = (daysAgo = 0) => {
            const date = new Date();
            date.setDate(date.getDate() - daysAgo);
            return date.toISOString().split("T")[0];
        };

        if (!fechaInicio) fechaInicio = getDate(7);
        if (!fechaFin) fechaFin = getDate(0);

        const queryParams = new URLSearchParams();
        if (fechaInicio) {
            queryParams.append('fechaInicio', fechaInicio);
        }
        if (fechaFin) {
            queryParams.append('fechaFin', fechaFin);
        }

        const url = `${process.env.API_URL}/orders/reports/orders-by-city?${queryParams.toString()}`;

        const req = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!req.ok) {
            return [];
        }

        const json = await req.json();
        const ordersByCity = OrdersByCitySchema.array().parse(json);
        return ordersByCity;
    } catch (error) {
        console.error("Error fetching orders by city:", error);
        return [];
    }
}

export const updateOrderStatus = async (id: string, status: string) => {
    try {
        const token = await getTokenOptional();

        const url = `${process.env.API_URL}/orders/${id}/status`;

        const req = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const json = await req.json();

        if (!req.ok) {
            throw new Error(json.message || 'Error al actualizar el estado');
        }

        return { success: true, data: json };
    } catch (error) {
        return { success: false, error: (error as Error).message };
    }
}