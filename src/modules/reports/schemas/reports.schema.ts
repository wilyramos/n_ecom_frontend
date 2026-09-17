// File: frontend/src/modules/reports/schemas/reports.schema.ts

import { z } from 'zod';

export const reporteFiltrosSchema = z
  .object({
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.dateFrom && data.dateTo) {
        return new Date(data.dateFrom) <= new Date(data.dateTo);
      }
      return true;
    },
    { message: 'La fecha de inicio debe ser menor o igual a la fecha de fin', path: ['dateFrom'] }
  );

export const reporteAvanzadoFiltrosSchema = reporteFiltrosSchema.and(
  z.object({
    groupBy: z.enum(['daily', 'monthly', 'yearly']).optional(),
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
  })
);

export type ReporteFiltrosData = z.infer<typeof reporteFiltrosSchema>;
export type ReporteAvanzadoFiltrosData = z.infer<typeof reporteAvanzadoFiltrosSchema>;