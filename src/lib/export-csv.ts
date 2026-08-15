import { IPedido } from '@/src/modules/checkout/types/pedido.types';

/**
 * Mapeo legible de estados de pedido para exportación
 */
const ESTADO_PEDIDO_LABELS: Record<string, string> = {
    awaiting_payment: 'Esperando Pago',
    processing: 'En Proceso',
    shipped: 'Enviado',
    delivered: 'Entregado',
    canceled: 'Cancelado',
    paid_but_out_of_stock: 'Sin Stock',
};

/**
 * Mapeo legible de estados de pago
 */
const ESTADO_PAGO_LABELS: Record<string, string> = {
    pending: 'Pendiente',
    approved: 'Aprobado',
    rejected: 'Rechazado',
    refunded: 'Reembolsado',
};

/**
 * Exporta un arreglo de IPedido a un archivo CSV descargable
 * @param pedidos Arreglo de pedidos a exportar
 * @param filename Nombre del archivo .csv generado (opcional)
 */
export function exportPedidosToCSV(pedidos: IPedido[], filename?: string): void {
    if (!pedidos || pedidos.length === 0) {
        console.warn('[exportPedidosToCSV] No hay registros para exportar.');
        return;
    }

    // Encabezados de la tabla CSV
    const headers = [
        'N° Orden',
        'Fecha Registro',
        'Cliente',
        'Tipo Documento',
        'N° Documento',
        'Email',
        'Teléfono',
        'Método Entrega',
        'Dirección de Envío',
        'Distrito',
        'Provincia',
        'Departamento',
        'Proveedor Pago',
        'Estado Pago',
        'Estado Pedido',
        'Subtotal (S/)',
        'IGV (S/)',
        'Costo Envío (S/)',
        'Recargo Financiero (S/)',
        'Total Final (S/)',
        'ID Transacción',
    ];

    // Mapear cada pedido a una fila del CSV
    const rows = pedidos.map((p) => {
        const fecha = p.createdAt
            ? new Date(p.createdAt).toLocaleString('es-PE', {
                dateStyle: 'short',
                timeStyle: 'medium',
            })
            : '';

        const cliente = `${p.customerProfile?.nombre || ''} ${p.customerProfile?.apellidos || ''}`.trim();
        const direccion = p.shippingAddress?.direccion || '';
        const distrito = p.shippingAddress?.distrito || '';
        const provincia = p.shippingAddress?.provincia || '';
        const departamento = p.shippingAddress?.departamento || '';
        const metodoEntrega = p.deliveryMethod === 'shipping' ? 'Envío a Domicilio' : 'Recojo en Tienda';
        const estadoPedidoLabel = ESTADO_PEDIDO_LABELS[p.status] || p.status;
        const estadoPagoLabel = ESTADO_PAGO_LABELS[p.payment?.status] || p.payment?.status || '';

        return [
            `"${p.orderNumber || ''}"`,
            `"${fecha}"`,
            `"${cliente.replace(/"/g, '""')}"`,
            `"${p.customerProfile?.tipoDocumento || ''}"`,
            `"${p.customerProfile?.numeroDocumento || ''}"`,
            `"${p.customerProfile?.email || ''}"`,
            `"${p.customerProfile?.telefono || ''}"`,
            `"${metodoEntrega}"`,
            `"${direccion.replace(/"/g, '""')}"`,
            `"${distrito}"`,
            `"${provincia}"`,
            `"${departamento}"`,
            `"${(p.payment?.provider || '').toUpperCase()}"`,
            `"${estadoPagoLabel}"`,
            `"${estadoPedidoLabel}"`,
            (p.subtotal || 0).toFixed(2),
            (p.igv || 0).toFixed(2),
            (p.shippingCost || 0).toFixed(2),
            (p.recargoFinanciero || 0).toFixed(2),
            (p.totalPrice || 0).toFixed(2),
            `"${p.payment?.transactionId || ''}"`,
        ];
    });

    // Generar contenido CSV con BOM (\uFEFF) para abrir correctamente acentos en Excel
    const csvString = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob(['\uFEFF' + csvString], { type: 'text/csv;charset=utf-8;' });

    // Nombre de archivo por defecto con fecha actual si no se proporciona uno
    const name =
        filename ||
        `pedidos_export_${new Date().toISOString().slice(0, 10)}_${Date.now()}.csv`;

    // Disparar descarga programática
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', name);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}