//File: frontend/app/admin/reports/sales/layout.tsx


import SalesButtonsFilter from "@/components/admin/reports/sales/SalesButtonsFilter";
export default function SalesReportLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-6 p-4 md:p-6 lg:p-8">
            <SalesButtonsFilter />
            <main className="flex-1 ">
                {children}
            </main>
        </div>
    );
}