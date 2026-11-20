// File: frontend/src/modules/cupones/schemas/cupon.schema.ts

import { z } from 'zod';

const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const cuponFormSchema = z
  .object({
    codigo: z
      .string()
      .trim()
      .min(3, { message: 'El código debe tener al menos 3 caracteres' })
      .max(30, { message: 'El código no puede superar 30 caracteres' })
      .regex(/^[A-Za-z0-9_-]+$/, { message: 'Solo letras, números, guion y guion bajo' }),
    descripcion: z.string().trim().max(200, { message: 'Máximo 200 caracteres' }).optional(),
    tipo: z.enum(['porcentaje', 'monto'], { errorMap: () => ({ message: 'Selecciona el tipo' }) }),
    valor: z
      .number({ invalid_type_error: 'Ingresa un valor' })
      .positive({ message: 'El valor debe ser mayor a 0' }),
    montoMinimo: z.number({ invalid_type_error: 'Ingresa un monto' }).nonnegative({
      message: 'No puede ser negativo',
    }),
    aplicaA: z.enum(['todos', 'categorias', 'productos']),
    categorias: z.array(z.string().regex(objectIdRegex)),
    productos: z.array(z.string().regex(objectIdRegex)),
    usosMaximos: z.number().int().positive({ message: 'Debe ser mayor a 0' }).nullable(),
    usosPorCliente: z.number().int().positive({ message: 'Debe ser mayor a 0' }).nullable(),
    fechaInicio: z.string().nullable(),
    fechaFin: z.string().nullable(),
    activo: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (data.tipo === 'porcentaje' && data.valor > 100) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['valor'], message: 'El porcentaje no puede superar 100' });
    }
    if (data.aplicaA === 'categorias' && data.categorias.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['categorias'], message: 'Selecciona al menos una categoría' });
    }
    if (data.aplicaA === 'productos' && data.productos.length === 0) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['productos'], message: 'Selecciona al menos un producto' });
    }
    if (data.fechaInicio && data.fechaFin && data.fechaFin < data.fechaInicio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['fechaFin'],
        message: 'La fecha de fin debe ser posterior a la de inicio',
      });
    }
  });

export type CuponFormValues = z.infer<typeof cuponFormSchema>;
