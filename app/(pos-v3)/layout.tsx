/* File: frontend/app/(pos-v3)/layout.tsx 
    @Author: whramos 
    @Description: Global shell for POS v3 with RBAC and session protection.
*/

import { redirect } from "next/navigation";
import { verifySession } from "@/src/auth/dal";
import { Sidebar } from "@/src/components/shared/Sidebar";
import { Header } from "@/src/components/shared/Header";
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/site";

// Punto de venta: área privada, no indexar.
export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default async function PosV3Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user } = await verifySession();

    if (!user?.nombre || !user?.rol ) {
        redirect("/auth/login");
    }

    const allowedRoles = ["administrador", "vendedor"];
    if (!allowedRoles.includes(user.rol)) {
        redirect("/auth/login");
    }

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <Sidebar user={user} />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header user={user} />

                {/* CAMBIO AQUÍ: Cambiamos overflow-hidden por overflow-y-auto */}
                <main className="relative flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}