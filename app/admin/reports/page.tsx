import { Suspense } from 'react'
import AdminPageWrapper from '@/components/admin/AdminPageWrapper'
import SalesReportsCards from '@/components/admin/reports/SalesReportsCards'
import GeneralView from '@/components/admin/reports/GeneralView'
import SpinnerLoading from '@/components/ui/SpinnerLoading'

export default function ReportsAdminPage() {
    return (
        <AdminPageWrapper
            title="Reportes"
            breadcrumbCurrent="Reportes"
        >
            <div className="space-y-8">
                <Suspense fallback={<SpinnerLoading />}>
                    <SalesReportsCards />
                </Suspense>
                
                <Suspense fallback={<SpinnerLoading />}>
                    <GeneralView />
                </Suspense>

               
            </div>
        </AdminPageWrapper>
    )
}