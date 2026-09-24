// File: frontend/src/modules/checkout/schemas/checkout.schema.ts

import { z } from 'zod';

const celularPeruRegex = /^9\d{8}$/;
const dniRegex = /^\d{8}$/;
const rucRegex = /^(10|20)\d{9}$/;

export const checkoutSchema = z
  .object({
    customerProfile: z.object({
      nombre: z
        .string()
        .trim()
        .min(1, { message: 'El nombre es obligatorio' })
        .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
      apellidos: z
        .string()
        .trim()
        .min(1, { message: 'Los apellidos son obligatorios' })
        .min(2, { message: 'Los apellidos deben tener al menos 2 caracteres' }),
      email: z
        .string()
        .trim()
        .min(1, { message: 'El correo electrónico es obligatorio' })
        .email({ message: 'Ingresa un correo electrónico válido' }),
      telefono: z
        .string()
        .trim()
        .min(1, { message: 'El número de celular es obligatorio' })
        .regex(celularPeruRegex, {
          message: 'Debe ser un celular válido de 9 dígitos que empiece con 9',
        }),
      tipoDocumento: z.enum(['DNI', 'CE', 'RUC', 'PASAPORTE'], {
        errorMap: () => ({ message: 'Selecciona un tipo de documento válido' }),
      }),
      numeroDocumento: z
        .string()
        .trim()
        .min(1, { message: 'El número de documento es obligatorio' }),
    }),

    hasDifferentReceiver: z.boolean().default(false),
    receiverInfo: z
      .object({
        nombre: z.string().optional(),
        apellidos: z.string().optional(),
        telefono: z.string().optional(),
        tipoDocumento: z.enum(['DNI', 'CE', 'RUC', 'PASAPORTE']).optional(),
        numeroDocumento: z.string().optional(),
      })
      .optional(),
    deliveryNotes: z
      .string()
      .max(300, { message: 'Las notas no pueden superar los 300 caracteres' })
      .optional(),

    deliveryMethod: z.enum(['shipping', 'pickup'], {
      errorMap: () => ({ message: 'Selecciona un método de entrega' }),
    }),
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
        type: z.enum(['boleta', 'factura'], {
          errorMap: () => ({ message: 'Selecciona el comprobante' }),
        }),
        documentNumber: z.string().optional(),
        businessName: z.string().optional(),
        address: z.string().optional(),
      })
      .refine(
        (data) => {
          if (data.type === 'factura' && !data.documentNumber?.trim()) return false;
          return true;
        },
        { message: 'El número de RUC es obligatorio para Factura', path: ['documentNumber'] }
      )
      .refine(
        (data) => {
          if (data.type === 'factura' && data.documentNumber?.trim()) {
            return rucRegex.test(data.documentNumber.trim());
          }
          return true;
        },
        { message: 'Ingresa un RUC válido de 11 dígitos (iniciando con 10 o 20)', path: ['documentNumber'] }
      )
      .refine(
        (data) => {
          if (data.type === 'factura' && !data.businessName?.trim()) return false;
          return true;
        },
        { message: 'La razón social es obligatoria para Factura', path: ['businessName'] }
      )
      .optional(),

    payment: z.object({
      provider: z
        .string()
        .trim()
        .min(1, { message: 'Selecciona una pasarela de pago' }),
      method: z.string().optional(),
      paymentCode: z.string().optional(),
    }),

    acceptTerms: z.literal(true, {
      errorMap: () => ({ message: 'Debes aceptar los términos y condiciones para continuar' }),
    }),
  })
  .superRefine((data, ctx) => {
    const docCliente = data.customerProfile.numeroDocumento.trim();
    if (data.customerProfile.tipoDocumento === 'DNI' && !dniRegex.test(docCliente)) {
      ctx.addIssue({
        path: ['customerProfile', 'numeroDocumento'],
        message: 'El DNI debe tener exactamente 8 dígitos numéricos',
        code: z.ZodIssueCode.custom,
      });
    } else if (data.customerProfile.tipoDocumento === 'RUC' && !rucRegex.test(docCliente)) {
      ctx.addIssue({
        path: ['customerProfile', 'numeroDocumento'],
        message: 'El RUC debe tener 11 dígitos y empezar con 10 o 20',
        code: z.ZodIssueCode.custom,
      });
    } else if (docCliente.length < 4) {
      ctx.addIssue({
        path: ['customerProfile', 'numeroDocumento'],
        message: 'Ingresa un documento válido (mínimo 4 caracteres)',
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.deliveryMethod === 'shipping') {
      if (!data.shippingAddress?.departamento?.trim()) {
        ctx.addIssue({
          path: ['shippingAddress', 'departamento'],
          message: 'Selecciona el departamento de entrega',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.shippingAddress?.provincia?.trim()) {
        ctx.addIssue({
          path: ['shippingAddress', 'provincia'],
          message: 'Selecciona la provincia de entrega',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.shippingAddress?.distrito?.trim()) {
        ctx.addIssue({
          path: ['shippingAddress', 'distrito'],
          message: 'Selecciona el distrito de entrega',
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.shippingAddress?.direccion?.trim()) {
        ctx.addIssue({
          path: ['shippingAddress', 'direccion'],
          message: 'Ingresa la dirección y número de entrega',
          code: z.ZodIssueCode.custom,
        });
      } else if (data.shippingAddress.direccion.trim().length < 5) {
        ctx.addIssue({
          path: ['shippingAddress', 'direccion'],
          message: 'Ingresa una dirección más detallada (mínimo 5 caracteres)',
          code: z.ZodIssueCode.custom,
        });
      }
    }

    if (data.hasDifferentReceiver) {
      if (!data.receiverInfo?.nombre?.trim()) {
        ctx.addIssue({
          path: ['receiverInfo', 'nombre'],
          message: 'Ingresa los nombres de quien recibe',
          code: z.ZodIssueCode.custom,
        });
      }

      if (!data.receiverInfo?.apellidos?.trim()) {
        ctx.addIssue({
          path: ['receiverInfo', 'apellidos'],
          message: 'Ingresa los apellidos de quien recibe',
          code: z.ZodIssueCode.custom,
        });
      }

      const telReceptor = data.receiverInfo?.telefono?.trim() || '';
      if (!telReceptor) {
        ctx.addIssue({
          path: ['receiverInfo', 'telefono'],
          message: 'El número de celular del receptor es obligatorio',
          code: z.ZodIssueCode.custom,
        });
      } else if (!celularPeruRegex.test(telReceptor)) {
        ctx.addIssue({
          path: ['receiverInfo', 'telefono'],
          message: 'Debe ser un celular válido de 9 dígitos que empiece con 9',
          code: z.ZodIssueCode.custom,
        });
      }

      const docReceptor = data.receiverInfo?.numeroDocumento?.trim() || '';
      if (data.deliveryMethod === 'pickup') {
        if (!docReceptor) {
          ctx.addIssue({
            path: ['receiverInfo', 'numeroDocumento'],
            message: 'El documento es obligatorio para retiro en tienda',
            code: z.ZodIssueCode.custom,
          });
        } else if (data.receiverInfo?.tipoDocumento === 'DNI' && !dniRegex.test(docReceptor)) {
          ctx.addIssue({
            path: ['receiverInfo', 'numeroDocumento'],
            message: 'El DNI del receptor debe tener 8 dígitos numéricos',
            code: z.ZodIssueCode.custom,
          });
        }
      } else if (docReceptor && data.receiverInfo?.tipoDocumento === 'DNI' && !dniRegex.test(docReceptor)) {
        ctx.addIssue({
          path: ['receiverInfo', 'numeroDocumento'],
          message: 'El DNI debe tener 8 dígitos numéricos',
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export type CheckoutFormData = z.infer<typeof checkoutSchema>;