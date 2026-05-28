//File: frontend/app/admin/reports/sales/page.tsx

import SalesReportsResultsAdmin from '@/components/admin/reports/SalesReportsResultsAdmin';
import { Suspense } from 'react';
import SpinnerLoading from '@/components/ui/SpinnerLoading';


type SalesReportsPageProps = {
    searchParams: Promise<{
        startDate?: string;
        endDate?: string;
    }>;
};

export default async function SalesReportsPage({ searchParams }: SalesReportsPageProps) {
    const { startDate, endDate } = await searchParams;

    return (
        <div className="space-y-6">
        
            {/* Resumen de métricas */}
            <Suspense fallback={<SpinnerLoading />}>
                <SalesReportsResultsAdmin
                    startDate={startDate}
                    endDate={endDate}
                />
            </Suspense>
        </div>
    );
}
