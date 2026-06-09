// File: frontend/app/admin/reports/orders/payment-status/page.tsx

import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import DonutChartsOrders from '@/components/admin/reports/orders/DonutChartsOrders';
import { getReportOrdersByPaymentStatus } from '@/src/services/orders';
import { HeadingH2 } from '@/components/ui/Heading';

type PaymentStatusPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function OrdersPaymentStatusPage({ searchParams }: PaymentStatusPageProps) {
    const { startDate, endDate } = await searchParams;

    const dataPaymentStatus = await getReportOrdersByPaymentStatus({
        fechaInicio: startDate,
        fechaFin: endDate,
    });

    return (
        <div className="space-y-6">
            <header>
                <HeadingH2>Estado de Pagos</HeadingH2>
                <p className="text-sm text-gray-500">
                    Resumen de transacciones: Aprobadas, Pendientes y Rechazadas.
                </p>
            </header>

            <Suspense fallback={<SpinnerLoading />}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm max-w-2xl mx-auto">
                    {dataPaymentStatus.length > 0 ? (
                        <DonutChartsOrders data={dataPaymentStatus} />
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No hay información de pagos en el rango seleccionado.
                        </div>
                    )}
                </div>
            </Suspense>
        </div>
    );
}