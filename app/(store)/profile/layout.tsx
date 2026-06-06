import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/logout-user-action';
import { FiLogOut } from 'react-icons/fi';
import SidebarProfileNav from '@/components/profile/SidebarProfileNav';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
    const { user } = await verifySession();

    // Validar que el usuario exista
    if (!user) {
        redirect('/auth/login');
    }

    // Redireccionar a admin si el usuario es administrador
    if (user.rol === 'administrador') {
        redirect('/admin');
    }

    return (
        <div className="flex flex-col md:flex-row max-w-7xl mx-auto min-h-screen">
            {/* Sidebar */}
            <aside className="w-full md:w-80 bg-[var(--color-bg-secondary)] p-8 flex flex-col justify-between border-r border-[var(--color-border-subtle)] min-h-[auto] md:min-h-screen">
                <div className="space-y-10">
                    {/* Perfil de Usuario */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <p className="text-xl font-bold text-[var(--color-text-primary)] tracking-tight">
                                {user.nombre} {user.apellidos}
                            </p>
                            <p className="text-xs font-medium text-[var(--color-text-tertiary)] truncate">
                                {user.email}
                            </p>
                            {/* Badge del rol */}
                            <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]">
                                {user.rol === 'cliente' ? 'Cliente' : user.rol === 'vendedor' ? 'Vendedor' : user.rol}
                            </span>
                        </div>

                        {/* Botón Cerrar Sesión */}
                        <form action={logout}>
                            <button
                                type="submit"
                                className="flex items-center gap-2 text-[var(--color-error)] text-xs font-bold uppercase tracking-widest hover:text-[var(--color-error)] hover:opacity-80 transition-all cursor-pointer group"
                            >
                                <FiLogOut className="text-base transition-transform group-hover:-translate-x-1" />
                                <span>Cerrar sesión</span>
                            </button>
                        </form>
                    </div>

                    {/* Separador Sutil */}
                    <div className="h-px bg-[var(--color-border-default)] w-full" />

                    {/* Navegación */}
                    <nav className="space-y-1">
                        <SidebarProfileNav />
                    </nav>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 p-6 md:p-12 lg:p-16 min-h-screen bg-[var(--color-bg-primary)]">
                <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}