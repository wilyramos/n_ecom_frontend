import { getMetricsSales, getSummarySales } from "@/src/services/sales";
import ChartsSales from "./ChartsSales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FiDollarSign, FiTrendingUp, FiPackage, FiShoppingCart } from "react-icons/fi";
import { formatCurrency } from "@/src/utils/formatCurrency";

interface SalesReportsResultsAdminProps {
    startDate?: string;
    endDate?: string;
}

export default async function SalesReportsResultsAdmin({ startDate, endDate }: SalesReportsResultsAdminProps) {
    const salesSummary = await getSummarySales({ fechaInicio: startDate, fechaFin: endDate });
    const data = await getMetricsSales({ fechaInicio: startDate, fechaFin: endDate });

    const summaryItems = [
        { label: "Ventas Totales", value: formatCurrency(salesSummary?.totalSales || 0), icon: <FiDollarSign /> },
        { label: "Nº de Ventas", value: salesSummary?.numberSales || 0, icon: <FiPackage /> },
        { label: "Margen", value: formatCurrency(salesSummary?.margin || 0), icon: <FiTrendingUp /> },
        { label: "Unidades Vendidas", value: salesSummary?.totalUnitsSold || 0, icon: <FiShoppingCart /> },
    ];

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {summaryItems.map((item, idx) => (
                    <Card key={idx}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">{item.label}</CardTitle>
                            <div className="text-primary">{item.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {data ? (
                <ChartsSales data={data} />
            ) : (
                <Card className="p-8 text-center text-muted-foreground">No hay datos disponibles.</Card>
            )}
        </div>
    );
}