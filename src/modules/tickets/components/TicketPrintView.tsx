'use client';

/**
 * La impresión ahora se realiza exclusivamente a través de los PDFs generados por el Backend.
 */
export function openTicketPdf(ticketId: string) {
  window.open(`/api/tickets/${ticketId}/pdf`, '_blank', 'width=800,height=900');
}