import "server-only";
import { getTokenOptional } from "@/src/auth/dal";
import { type TicketData } from "@/src/schemas/ticket.schema";

const API_URL = process.env.API_URL;

export const TicketService = {
  generateManualTicketBinary: async (ticketData: TicketData): Promise<ArrayBuffer> => {
    const token = await getTokenOptional();
    if (!token) throw new Error("No se localizó una sesión activa de administrador.");

    const res = await fetch(`${API_URL}/sales/v2/manual-ticket`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(ticketData),
      cache: "no-store",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      throw new Error(json.message ?? "Error en el pipeline del generador del backend.");
    }

    return await res.arrayBuffer();
  }
};