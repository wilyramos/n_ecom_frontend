import { z } from 'zod';

export const ticketItemSchema = z.object({
  descripcion: z.string().min(1, 'La descripción es obligatoria'),
  unidadMedida: z.string().default('NIU'),
  cantidad: z.coerce.number().min(1, 'La cantidad mínima es 1'),
  precioUnitario: z.coerce.number().min(0, 'El precio unitario no puede ser negativo'),
  total: z.coerce.number().min(0, 'El total no puede ser negativo'),
});

export const ticketFormSchema = z.object({
  tipoComprobante: z.string().optional().default('NOTA DE VENTA'),
  numeroNota: z.string().min(1, 'El número de comprobante es requerido'),
  empresa: z.string().optional().default(''),
  rucEmpresa: z.string().optional().default(''),
  telefonoEmpresa: z.string().optional().default(''),
  direccionEmpresa: z.string().optional().default(''),
  cliente: z.string().min(1, 'El nombre del cliente es requerido'),
  documentoCliente: z.string().optional().default(''),
  telefonoCliente: z.string().optional().default(''),
  direccionCliente: z.string().optional().default(''),
  fecha: z.string().optional().default(''),
  hora: z.string().optional().default(''),
  cajero: z.string().optional().default(''),
  caja: z.string().optional().default(''),
  items: z.array(ticketItemSchema).min(1, 'Debe contener al menos un producto'),
  subtotal: z.coerce.number().optional().default(0),
  igv: z.coerce.number().optional().default(0),
  monto: z.coerce.number().min(0, 'El monto total no puede ser negativo'),
  filename: z.string().optional(),
});

export type TicketFormValues = z.infer<typeof ticketFormSchema>;