import OrdersFiltersReport from "@/components/admin/reports/orders/OrdersFiltersReport"


export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <div className='flex flex-col'>


            <div>
                <OrdersFiltersReport />
            </div>

            <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>

        </div>
    )
}
