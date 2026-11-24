import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import ToastNotification from "@/components/ui/ToastNotification";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import { AdminShell } from "@/src/components/admin/layout/admin-shell";
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/site";

// Área privada: nunca debe indexarse (robots.txt solo impide rastreo, no indexación).
export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await verifySession();
  if (user.rol !== 'administrador') redirect("/profile");

  return (
    <div className="font-[family-name:var(--font-inter)]">
      <ScrollToTop />
      <AdminShell user={user}>
        {children}
      </AdminShell>
      <ToastNotification />
    </div>
  );
}