import { z } from "zod";

export const TicketDataSchema = z.object({
    ticketSize: z.enum(["58mm", "80mm"]),
    storeName: z.string().min(1, "Nombre de tienda obligatorio"),
    address: z.string().min(1, "Dirección obligatoria"),
    email: z.string().email("Correo electrónico inválido"),
    phone: z.string().min(1, "Teléfono obligatorio"),
    website: z.string().min(1, "Sitio web obligatorio"),
    date: z.string().min(1, "Fecha obligatoria"),
    productName: z.string().min(1, "La descripción del producto es obligatoria"),
    partNumber: z.string().min(1, "Part number obligatorio"),
    serialNumber: z.string().min(1, "Número de serie obligatorio"),
    imei1: z.string().min(1, "IMEI 1 obligatorio"),
    imei2: z.string().min(1, "IMEI 2 obligatorio"),
    returnDate: z.string().min(1, "Fecha de retorno obligatoria"),
    subTotal: z.number().min(0, "Debe ser mayor o igual a 0"),
    tax: z.number().min(0, "Debe ser mayor o igual a 0"),
    total: z.number().min(0, "Debe ser mayor o igual a 0"),
    paymentMethod: z.string().min(1, "Método de pago obligatorio"),
    cardNumber: z.string().min(1, "Campo de tarjeta obligatorio"),
    transactionId: z.string().min(1, "ID de transacción obligatorio"),
    barcodeValue: z.string().min(1, "Código de barras obligatorio"),
});

export type TicketData = z.infer<typeof TicketDataSchema>;

export interface TicketActionState {
    success: boolean | null;
    message: string | null;
    errors?: Record<string, string[]>;
    data?: string; // String Base64 del PDF resultante
}