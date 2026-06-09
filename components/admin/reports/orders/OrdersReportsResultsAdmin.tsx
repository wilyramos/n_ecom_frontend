import RechardOrdersSales from "./RechardOrdersSales";
import DonutChartsOrders from "./DonutChartsOrders";
import PaymentMethodsChart from "./PaymentMethodsChart";
import SalesByRegionChart from "./SalesByRegionChart";
import KpiCardsOrders from "./KpiCardsOrders";

import { getOrdersOverTime, getReportOrdersByCity, getReportOrdersByStatus, getSummaryOrders, getReportOrdersByPaymentMethod } from "@/src/services/orders";

type OrdersReportsResultsAdminProps = {
    startDate?: string;
    endDate?: string;
};

export default async function OrdersReportsResultsAdmin({
    startDate,
    endDate,
}: OrdersReportsResultsAdminProps) {

    // Paralelización de peticiones para mejor performance
    const [dataSummary, dataRechardsOrders, dataStatusOrders, dataCityOrders, dataPaymentMethods] = await Promise.all([
        getSummaryOrders({ fechaInicio: startDate, fechaFin: endDate }),
        getOrdersOverTime({ fechaInicio: startDate, fechaFin: endDate }),
        getReportOrdersByStatus({ fechaInicio: startDate, fechaFin: endDate }),
        getReportOrdersByCity({ fechaInicio: startDate, fechaFin: endDate }),
        getReportOrdersByPaymentMethod({ fechaInicio: startDate, fechaFin: endDate }),
    ]);

    return (
        <div className="space-y-6 pb-8 animate-in fade-in duration-500">
            {/* Header: Mejorado con mejor contraste y espaciado */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4">
                <h1 className="text-lg font-bold text-gray-900">Dashboard de Ventas</h1>
                <div className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full border">
                    <span className="font-medium text-gray-700">Rango:</span> {startDate ?? 'Inicio'} — {endDate ?? 'Hoy'}
                </div>
            </header>

            {/* KPI CARDS: Grid flexible con mejor margen */}
            <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {dataSummary && <KpiCardsOrders kpis={dataSummary} />}
            </section>

            {/* Gráfico Principal: Card con padding y sombra */}
            <section className="bg-white p-4 sm:p-6  border border-gray-100">
                <RechardOrdersSales data={dataRechardsOrders} />
            </section>

            {/* GRID CHARTS: Ajuste responsivo de 1 a 3 columnas */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {[
                    { title: "Distribución por Estado", component: <DonutChartsOrders data={dataStatusOrders} /> },
                    { title: "Métodos de Pago", component: <PaymentMethodsChart data={dataPaymentMethods} /> },
                    { title: "Ventas por Región", component: <SalesByRegionChart data={dataCityOrders} /> }
                ].map((chart, idx) => (
                    <div key={idx} className="bg-white p-5 border border-gray-100 ">
                        <h2 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">{chart.title}</h2>
                        {chart.component}
                    </div>
                ))}
            </section>
        </div>
    );
}