"use server";

import { TicketService } from "@/src/services/ticket.service";
import { TicketDataSchema, type TicketActionState } from "@/src/schemas/ticket.schema";

export async function createManualTicketAction(prevState: TicketActionState, formData: FormData): Promise<TicketActionState> {
  try {
    const rawData = {
      ticketSize: formData.get("ticketSize") as "58mm" | "80mm",
      storeName: formData.get("storeName") as string,
      address: formData.get("address") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      website: formData.get("website") as string,
      date: formData.get("date") as string,
      productName: formData.get("productName") as string,
      partNumber: formData.get("partNumber") as string,
      serialNumber: formData.get("serialNumber") as string,
      imei1: formData.get("imei1") as string,
      imei2: formData.get("imei2") as string,
      returnDate: formData.get("returnDate") as string,
      subTotal: parseFloat(formData.get("subTotal") as string) || 0,
      tax: parseFloat(formData.get("tax") as string) || 0,
      total: parseFloat(formData.get("total") as string) || 0,
      paymentMethod: formData.get("paymentMethod") as string,
      cardNumber: formData.get("cardNumber") as string,
      transactionId: formData.get("transactionId") as string,
      barcodeValue: formData.get("barcodeValue") as string,
    };

    const validationResult = TicketDataSchema.safeParse(rawData);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Por favor corrige las anomalías del formulario.",
        errors: validationResult.error.flatten().fieldErrors,
      };
    }

    const arrayBuffer = await TicketService.generateManualTicketBinary(validationResult.data);
    const base64Pdf = Buffer.from(arrayBuffer).toString("base64");

    return {
      success: true,
      message: "Comprobante procesado por Express correctamente.",
      data: base64Pdf,
    };
  } catch (error: unknown) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Fallo inesperado al conectar con el microservicio.",
    };
  }
}