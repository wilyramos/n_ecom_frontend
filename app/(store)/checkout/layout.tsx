import CheckoutSteps from '@/components/checkout/CheckoutSteps'
import ResumenFinalCarrito from '@/components/cart/ResumenFinalCarrito'


export default async function CheckoutLayout({ children }: { children: React.ReactNode }) {
    return (
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 min-h-screen">
            <div className="mb-4 flex justify-center w-full">
                <CheckoutSteps />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2">{children}</section>
                <aside className="lg:col-span-1">
                    <div className="lg:sticky lg:top-14">
                        <ResumenFinalCarrito />
                    </div>
                </aside>
            </div>
        </main>
    )
}