//File: frontend/app/admin/layout.tsx

import { verifySession } from '@/src/auth/dal';
import AdminSidebar from "@/components/admin/AdminSidebar";
import MobileSidebar from '@/components/admin/MobileSidebar';
import ToastNotification from "@/components/ui/ToastNotification";
import { redirect } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import { Inter } from "next/font/google"; // [!] Importar nueva fuente

const inter = Inter({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();
    if (user.rol !== 'administrador') redirect("/profile");

    return (
        // [!] Aplicar la clase de la fuente en el contenedor raíz del administrador
        <div className={inter.className}>
            {/* MOBILE TOPBAR FIXED */}
            <div className="md:hidden fixed top-0 inset-x-0 z-40 h-12 px-2 border-b flex items-center justify-between">
                <div className="flex items-center">
                    <MobileSidebar user={user} />
                </div>

                <div className="flex-1 flex justify-center">
                    <Logo />
                </div>

                <div className="w-6" />
            </div>

            {/* DESKTOP LAYOUT */}
            <div className="hidden md:grid grid-cols-[auto_1fr] ">
                <div className="border-r border-border h-screen sticky top-0">
                    <AdminSidebar user={user} />
                </div>
                <main className="overflow-y-auto ">{children}</main>
            </div>

            {/* MOBILE CONTENT (OFFSET POR TOPBAR) */}
            <div className="md:hidden pt-14 p-2">
                {children}
            </div>

            <ToastNotification />
        </div>
    );
}