// File: frontend/app/admin/layout.tsx
import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import { Inter } from "next/font/google";
import ToastNotification from "@/components/ui/ToastNotification";
import ScrollToTop from "@/components/navigation/ScrollToTop";
import { AdminShell } from "@/src/components/admin/layout/admin-shell";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await verifySession();
  if (user.rol !== 'administrador') redirect("/profile");

  return (
    <div className={inter.className}>
      <ScrollToTop />
      {/* El Shell maneja toda la estructura (Sidebar + Navbar + Content) */}
      <AdminShell user={user}>
        {children}
      </AdminShell>
      <ToastNotification />
    </div>
  );
}