// File: frontend/src/modules/checkout/schemas/checkout.schema.ts

import { z } from 'zod';

export const checkoutSchema = z
  .object({
    customerProfile: z.object({
      nombre: z.string().min(2, { message: 'Ingresa tu nombre' }),
      apellidos: z.string().min(2, { message: 'Ingresa tus apellidos' }),
      email: z.string().email({ message: 'Email inválido' }),
      telefono: z.string().min(7, { message: 'Teléfono inválido' }),
      tipoDocumento: z.enum(['DNI', 'CE', 'RUC', 'PASAPORTE', 'OTRO']),
      numeroDocumento: z.string().min(8, { message: 'Documento inválido' }),
    }),
    deliveryMethod: z.enum(['shipping', 'pickup']),
    shippingAddress: z
      .object({
        departamento: z.string().optional(),
        provincia: z.string().optional(),
        distrito: z.string().optional(),
        direccion: z.string().optional(),
        numero: z.string().optional(),
        pisoDpto: z.string().optional(),
        referencia: z.string().optional(),
      })
      .optional(),
    invoiceInfo: z
      .object({
        type: z.enum(['boleta', 'factura']),
        documentNumber: z.string().optional(),
        businessName: z.string().optional(),
      })
      .refine(
        (data) => {
          if (data.type === 'factura' && !data.businessName?.trim()) return false;
          return true;
        },
        { message: 'Razón social requerida para factura', path: ['businessName'] }
      )
      .refine(
        (data) => {
          if (data.type === 'factura' && !data.documentNumber?.trim()) return false;
          return true;
        },
        { message: 'RUC requerido para factura', path: ['documentNumber'] }
      )
      .optional(),
    payment: z.object({
      provider: z.string().min(1, { message: 'Selecciona una pasarela de pago' }),
      method: z.string().optional(),
      paymentCode: z.string().optional(),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.deliveryMethod === 'shipping') {
      if (!data.shippingAddress?.departamento?.trim()) {
        ctx.addIssue({ path: ['shippingAddress', 'departamento'], message: 'Requerido', code: z.ZodIssueCode.custom });
      }
      if (!data.shippingAddress?.provincia?.trim()) {
        ctx.addIssue({ path: ['shippingAddress', 'provincia'], message: 'Requerido', code: z.ZodIssueCode.custom });
      }
      if (!data.shippingAddress?.distrito?.trim()) {
        ctx.addIssue({ path: ['shippingAddress', 'distrito'], message: 'Requerido', code: z.ZodIssueCode.custom });
      }
      if (!data.shippingAddress?.direccion?.trim()) {
        ctx.addIssue({ path: ['shippingAddress', 'direccion'], message: 'Requerido', code: z.ZodIssueCode.custom });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutSchema>;