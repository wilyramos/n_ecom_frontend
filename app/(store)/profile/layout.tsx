// File: frontend/app/(store)/profile/layout.tsx

import { verifySession } from '@/src/auth/dal';
import { redirect } from 'next/navigation';
import { logout } from '@/actions/logout-user-action';
import { LogOut } from 'lucide-react';
import SidebarProfileNav from '@/components/profile/SidebarProfileNav';

export default async function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await verifySession();

  // 1. Verificación de autenticación
  if (!session?.user) {
    redirect('/auth/login?redirect=/profile');
  }

  const user = session.user;

  // 2. Redirección por roles operativos/administrativos
  if (user.rol === 'administrador') {
    redirect('/admin');
  }

  if (user.rol === 'vendedor') {
    redirect('/pos');
  }

  if (user.rol === 'colaborador') {
    redirect('/staff/attendance');
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-background border-t border-border">
      <div className="flex flex-col md:flex-row max-w-6xl mx-auto min-h-full">
        {/* Sidebar */}
        <aside className="w-full md:w-64 p-6 md:py-10 md:pr-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-border shrink-0">
          <div className="space-y-6">
            {/* Cabecera del usuario */}
            <div className="space-y-1">
              <p className="text-sm font-semibold tracking-tight text-foreground">
                {user.nombre} {user.apellidos || ''}
              </p>
              <p className="text-xs text-muted-foreground truncate" title={user.email}>
                {user.email}
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium tracking-wide uppercase bg-secondary text-muted-foreground rounded-full border border-border">
                </span>
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            {/* Navegación interna */}
            <SidebarProfileNav />
          </div>

          {/* Acción de salida */}
          <div className="pt-8 md:pt-0">
            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer group select-none"
              >
                <LogOut className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
                <span>Cerrar sesión</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-6 md:p-10 lg:p-12 bg-background">
          <div className="max-w-3xl mx-auto animate-in fade-in duration-300">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}