"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Logo from "@/components/ui/Logo";
import { User } from "@/src/schemas";
import {
  LayoutDashboard,
  ShoppingCart,
  FileText,
  Package,
  Tags,
  Building2,
  GitFork,
  Images,
  Layers,
  Megaphone,
  FileStack,
  Home,
  ShieldAlert,
  BarChart3,
  Users,
  Fingerprint,
  Store,
  ExternalLink,
  PanelLeftClose,
  UserRound,
  Ticket,
  Truck,
  Warehouse,
  LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  isExternal?: boolean;
  /** Opción futura: se muestra desactivada y sin enlace */
  soon?: boolean;
};

type Accent = "blue" | "emerald" | "violet" | "amber" | "rose" | "slate";

type NavSection = {
  title: string;
  accent: Accent;
  items: NavItem[];
};

// Clases completas (no generadas) para que Tailwind las detecte
const accents: Record<Accent, { title: string; icon: string; activeIcon: string; active: string; bar: string }> = {
  blue: {
    title: "text-blue-600",
    icon: "text-blue-500",
    activeIcon: "text-blue-700",
    active: "bg-blue-50 text-blue-900",
    bar: "bg-blue-500",
  },
  emerald: {
    title: "text-emerald-600",
    icon: "text-emerald-500",
    activeIcon: "text-emerald-700",
    active: "bg-emerald-50 text-emerald-900",
    bar: "bg-emerald-500",
  },
  violet: {
    title: "text-violet-600",
    icon: "text-violet-500",
    activeIcon: "text-violet-700",
    active: "bg-violet-50 text-violet-900",
    bar: "bg-violet-500",
  },
  amber: {
    title: "text-amber-600",
    icon: "text-amber-500",
    activeIcon: "text-amber-700",
    active: "bg-amber-50 text-amber-900",
    bar: "bg-amber-500",
  },
  rose: {
    title: "text-rose-600",
    icon: "text-rose-500",
    activeIcon: "text-rose-700",
    active: "bg-rose-50 text-rose-900",
    bar: "bg-rose-500",
  },
  slate: {
    title: "text-zinc-400",
    icon: "text-zinc-500",
    activeIcon: "text-zinc-900",
    active: "bg-zinc-100 text-zinc-900",
    bar: "bg-zinc-900",
  },
};

// Orden según el flujo de trabajo: operar → catálogo → web pública → gestión → accesos
const sections: NavSection[] = [
  {
    title: "Operación",
    accent: "blue",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/admin/pedidos", label: "Pedidos", icon: ShoppingCart },
      { href: "/admin/tickets-v2", label: "Comprobantes", icon: FileText },
      { href: "/admin/cupones", label: "Cupones", icon: Ticket },
    ],
  },
  {
    title: "Catálogo",
    accent: "emerald",
    items: [
      { href: "/admin/products", label: "Productos", icon: Package },
      { href: "/admin/products/category", label: "Categorías", icon: Tags },
      { href: "/admin/brands", label: "Marcas", icon: Building2 },
      { href: "/admin/lines", label: "Líneas", icon: GitFork },
    ],
  },
  {
    title: "Página principal",
    accent: "violet",
    items: [
      { href: "/admin/slider", label: "Banners", icon: Images },
      { href: "/admin/sections", label: "Secciones", icon: Layers },
      { href: "/admin/advertisements", label: "Avisos", icon: Megaphone },
      { href: "/admin/pages", label: "Páginas", icon: FileStack },
    ],
  },
  {
    title: "Gestión",
    accent: "amber",
    items: [
      { href: "/admin/reports", label: "Reportes", icon: BarChart3 },
      { href: "/admin/claims", label: "Reclamaciones", icon: ShieldAlert },
      { href: "/admin/users", label: "Usuarios", icon: Users },
      { href: "/admin/attendance", label: "Asistencias", icon: Fingerprint },
    ],
  },
  {
    title: "Próximamente",
    accent: "slate",
    items: [
      { href: "#", label: "Clientes", icon: UserRound, soon: true },
      { href: "#", label: "Envíos y zonas", icon: Truck, soon: true },
      { href: "#", label: "Inventario", icon: Warehouse, soon: true },
    ],
  },
  {
    title: "Accesos",
    accent: "rose",
    items: [
      { href: "/pos", label: "Punto de venta", icon: Store, isExternal: true },
      { href: "/", label: "Tienda online", icon: Home, isExternal: true },
    ],
  },
];

function initialsOf(user: User) {
  const nombre = user.nombre?.trim() ?? "";
  const apellido = user.apellidos?.trim() ?? "";
  return `${nombre.charAt(0)}${apellido.charAt(0)}`.toUpperCase() || "A";
}

interface SidebarPanelProps {
  user: User;
  /** Móvil: siempre muestra texto. Escritorio: el texto aparece al expandirse (fijada o hover) */
  variant: "mobile" | "desktop";
  /** Escritorio: true cuando la barra está fijada expandida desde el navbar */
  expanded?: boolean;
  onClose?: () => void;
}

function SidebarPanel({ user, variant, expanded = false, onClose }: SidebarPanelProps) {
  const pathname = usePathname();
  const isDesktop = variant === "desktop";
  const collapsedDesktop = isDesktop && !expanded;

  const isActive = (href: string) =>
    href === "/admin"
      ? pathname === "/admin"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Texto visible si está fijada, o si el contenedor está en hover (solo escritorio colapsado)
  const textReveal = collapsedDesktop ? "md:opacity-0 md:group-hover:opacity-100" : "opacity-100";
  const iconOnly = collapsedDesktop ? "md:justify-center md:group-hover:justify-start" : "";

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Cabecera: misma altura que el navbar (h-14) */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200/80 px-4">
        <Link href="/admin" className="flex min-w-0 items-center">
          {collapsedDesktop && (
            <Logo version="icono" className="h-6 w-6 shrink-0 md:block md:group-hover:hidden" />
          )}
          <Logo
            version="completa"
            className={cn("h-6 w-28", collapsedDesktop ? "hidden md:group-hover:block" : "block")}
          />
        </Link>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar menú"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Navegación */}
      <nav aria-label="Menú de administración" className="flex-1 space-y-2.5 overflow-y-auto overflow-x-hidden px-2 py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => {
          const acc = accents[section.accent];
          return (
          <div key={section.title} className="space-y-px">
            <p
              className={cn(
                "whitespace-nowrap px-2 pb-0.5 text-[9px] font-semibold uppercase tracking-wider transition-opacity duration-150",
                acc.title,
                textReveal
              )}
            >
              {section.title}
            </p>

            {section.items.map((item) => {
              const Icon = item.icon;
              const active = !item.isExternal && isActive(item.href);

              if (item.soon) {
                return (
                  <div
                    key={`${section.title}-${item.label}`}
                    aria-disabled="true"
                    title={isDesktop ? `${item.label} · Próximamente` : undefined}
                    className={cn(
                      "flex cursor-not-allowed items-center gap-2.5 rounded-md px-2 py-1.5 text-xs text-zinc-400",
                      iconOnly
                    )}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-300" />
                    <span className={cn("flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap transition-opacity duration-150", textReveal)}>
                      <span className="truncate">{item.label}</span>
                      <span className="ml-auto rounded-full border border-zinc-200 px-1.5 text-[8px] font-normal uppercase text-zinc-400">
                        No disponible
                      </span>
                    </span>
                  </div>
                );
              }

              return (
                <Link
                  key={`${section.title}-${item.label}`}
                  href={item.href}
                  target={item.isExternal ? "_blank" : undefined}
                  rel={item.isExternal ? "noopener noreferrer" : undefined}
                  aria-current={active ? "page" : undefined}
                  title={isDesktop ? item.label : undefined}
                  className={cn(
                    "relative flex items-center gap-2.5 rounded-md px-2 py-1.5 text-xs transition-colors duration-150",
                    iconOnly,
                    active
                      ? cn("font-semibold", acc.active)
                      : "font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                  )}
                >
                  {active && (
                    <span className={cn("absolute inset-y-1.5 left-0 w-0.5 rounded-full", acc.bar)} aria-hidden />
                  )}

                  <Icon className={cn("h-3.5 w-3.5 shrink-0", active ? acc.activeIcon : acc.icon)} />

                  <span
                    className={cn(
                      "flex min-w-0 flex-1 items-center gap-2 whitespace-nowrap transition-opacity duration-150",
                      textReveal
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.isExternal && <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-zinc-400" />}
                  </span>
                </Link>
              );
            })}
          </div>
          );
        })}
      </nav>

      {/* Pie: usuario conectado */}
      <div className="shrink-0 border-t border-zinc-200/80 p-2">
        <div className={cn("flex items-center gap-2 rounded-md px-1 py-1", iconOnly)}>
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-600 text-[10px] font-bold text-white">
            {initialsOf(user)}
          </div>
          <div className={cn("min-w-0 whitespace-nowrap transition-opacity duration-150", textReveal)}>
            <p className="truncate text-xs font-medium text-zinc-900">{user.nombre}</p>
            <p className="truncate text-[10px] text-zinc-500">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  user: User;
}

/**
 * Escritorio: la barra ocupa su ancho en el layout (w-16). Al pasar el mouse el
 * contenedor se ensancha a w-60 y el contenido de la página se reduce a la par.
 * Móvil: drawer deslizable controlado por `isOpen`.
 */
export function AdminSidebar({ isOpen, onToggle, user }: AdminSidebarProps) {
  return (
    <>
      {/* Escritorio: empuja el contenido. Fijada (isOpen) o expandida al pasar el mouse */}
      <div
        className={cn(
          "group relative z-40 hidden h-full shrink-0 border-r border-zinc-200/80 bg-white md:block",
          "transition-[width] duration-150 ease-out",
          isOpen ? "md:w-52" : "md:w-16 md:hover:w-52"
        )}
      >
        <div className="absolute inset-y-0 left-0 w-full overflow-hidden">
          <SidebarPanel user={user} variant="desktop" expanded={isOpen} />
        </div>
      </div>

      {/* Móvil: drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-52 border-r border-zinc-200/80 shadow-xl md:hidden",
          "transition-transform duration-200 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarPanel user={user} variant="mobile" onClose={onToggle} />
      </aside>
    </>
  );
}
