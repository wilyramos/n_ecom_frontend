// File: frontend/app/staff/layout.tsx
import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import { LayoutDashboard, MonitorSmartphone, LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { logout } from '@/actions/logout-user-action';

export default async function StaffLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();

    // Control de acceso
    const rolesAutorizados = ['administrador', 'vendedor', 'colaborador'];
    if (!user.rol || !rolesAutorizados.includes(user.rol)) {
        redirect("/profile");
    }

    return (
        <div className="min-h-screen bg-neutral-50 flex flex-col">
            {/* TOPBAR */}
            <header className="bg-white border-b border-neutral-200 sticky top-0 z-40 h-16 px-4 sm:px-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Logo className="h-6" />

                    {/* NAVEGACIÓN CONTEXTUAL (Roles) */}
                    <nav className="hidden md:flex items-center gap-1">
                        {user.rol === 'administrador' && (
                            <Link href="/admin" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase text-neutral-600 hover:bg-neutral-100 transition-colors">
                                <LayoutDashboard className="h-3.5 w-3.5" /> Admin
                            </Link>
                        )}
                        {['administrador', 'vendedor'].includes(user.rol!) && (
                            <Link href="/pos" className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-bold uppercase text-neutral-600 hover:bg-neutral-100 transition-colors">
                                <MonitorSmartphone className="h-3.5 w-3.5" /> Punto Venta
                            </Link>
                        )}
                    </nav>
                </div>

                {/* USUARIO Y SESIÓN */}
                <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs font-bold text-neutral-900 leading-none">{user.nombre}</p>
                            <Badge variant="secondary" className="mt-1 text-[9px] uppercase tracking-wider py-0 px-1.5">
                                {user.rol}
                            </Badge>
                        </div>
                    </div>

                    <div className="h-px w-4 bg-neutral-200 rotate-90 hidden sm:block" />

                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition-colors px-2 cursor-pointer rounded-md hover:bg-red-50"
                        >
                            <LogOut className="h-4 w-4" />
                            <span className="hidden sm:inline">Cerrar Sesión</span>
                        </button>
                    </form>
                </div>
            </header>

            {/* CONTENIDO */}
            <main className="flex-1 flex flex-col w-full max-w-7xl mx-auto p-4 sm:p-6 animate-in fade-in duration-500">
                <div className="mb-6 flex items-center gap-2 text-neutral-500">
                </div>
                {children}
            </main>
        </div>
    );
}