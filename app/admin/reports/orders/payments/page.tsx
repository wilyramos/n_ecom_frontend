// File: frontend/app/admin/reports/orders/payments/page.tsx

import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';
import PaymentMethodsChart from '@/components/admin/reports/orders/PaymentMethodsChart';
import { getReportOrdersByPaymentMethod } from '@/src/services/orders';
import { HeadingH2 } from '@/components/ui/Heading';

type OrdersPaymentsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function OrdersPaymentsPage({ searchParams }: OrdersPaymentsPageProps) {
    const { startDate, endDate } = await searchParams;

    // Obtenemos los datos filtrados para métodos de pago
    const dataPaymentMethods = await getReportOrdersByPaymentMethod({
        fechaInicio: startDate,
        fechaFin: endDate,
    });

    return (
        <div className="space-y-6">
            <header>
                <HeadingH2>Reporte por Método de Pago</HeadingH2>
                <p className="text-sm text-gray-500">
                    Análisis de las preferencias de pago de tus clientes.
                </p>
            </header>

            <Suspense fallback={<SpinnerLoading />}>
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    {dataPaymentMethods.length > 0 ? (
                        <div className="max-w-3xl mx-auto">
                            <PaymentMethodsChart data={dataPaymentMethods} />
                        </div>
                    ) : (
                        <div className="text-center py-10 text-gray-500">
                            No se encontraron datos de transacciones para este periodo.
                        </div>
                    )}
                </div>
            </Suspense>
        </div>
    );
}