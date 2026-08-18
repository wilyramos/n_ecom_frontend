// frontend/src/modules/tickets/ticket.types.ts
export interface ITicketItem {
  _id?: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

export interface ITicket {
  _id: string;
  tipoComprobante?: string;
  numeroNota: string;
  empresa?: string;
  rucEmpresa?: string;
  telefonoEmpresa?: string;
  direccionEmpresa?: string;
  cliente: string;
  documentoCliente?: string;
  telefonoCliente?: string;
  direccionCliente?: string;
  fecha?: string;
  hora?: string;
  cajero?: string;
  caja?: string;
  items: ITicketItem[];
  subtotal?: number;
  igv?: number;
  monto: number;
  filename?: string;
  originalFilename?: string;
  fechaDigitalizacion?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IExtractedTicketData {
  tipoComprobante: string;
  numeroNota: string;
  empresa: string;
  rucEmpresa: string;
  telefonoEmpresa: string;
  direccionEmpresa: string;
  cliente: string;
  documentoCliente: string;
  telefonoCliente: string;
  direccionCliente: string;
  fecha: string;
  hora: string;
  cajero: string;
  caja: string;
  items: ITicketItem[];
  subtotal: number;
  igv: number;
  monto: number;
  filename?: string;
  originalFilename?: string;
}

export interface ITicketsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IAdminTicketsResponse {
  success: boolean;
  data: ITicket[];
  pagination: ITicketsPagination;
}