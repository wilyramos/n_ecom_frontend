// File: frontend/app/admin/page.tsx

import Link from "next/link";
import {
  Truck, ReceiptText,
  Boxes,
  Tags,
  Building2,
  GitFork,
  TrendingUp,
  ShieldAlert,
  Images,
  Layers,
  Megaphone, Users,
  Fingerprint,
  Store,
  ArrowUpRight,
  ExternalLink
} from "lucide-react";
import { AdminPageContainer } from "@/src/components/admin/layout/admin-page-container";
import { AdminPageHeader } from "@/src/components/admin/layout/admin-page-header";

interface NavCardItem {
  href: string;
  label: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  isExternal?: boolean;
  tag?: string;
}

interface GroupSection {
  title: string;
  colorClass: string;
  iconBgClass: string;
  items: NavCardItem[];
}

const groups: GroupSection[] = [
  {
    title: "Operaciones & Ventas",
    colorClass: "border-slate-200 hover:border-slate-300",
    iconBgClass: "bg-sky-50 text-sky-600",
    items: [
      { href: "/admin/pedidos", label: "Pedidos Ecommerce", desc: "Gestión de compras online y pasarelas", icon: Truck, tag: "BNPL" },
      { href: "/admin/tickets-v2", label: "Comprobantes", desc: "Boletas y facturas electrónicas", icon: ReceiptText },
      { href: "/admin/reports/sales", label: "Reportes", desc: "Métricas de ventas y recaudación", icon: TrendingUp },
    ],
  },
  {
    title: "Catálogo & Stock",
    colorClass: "border-slate-200 hover:border-slate-300",
    iconBgClass: "bg-emerald-50 text-emerald-600",
    items: [
      { href: "/admin/products", label: "Productos", desc: "Catálogo, precios e inventario", icon: Boxes },
      { href: "/admin/products/category", label: "Categorías", desc: "Estructura del catálogo", icon: Tags },
      { href: "/admin/brands", label: "Marcas", desc: "Fabricantes asociados", icon: Building2 },
      { href: "/admin/lines", label: "Líneas", desc: "Segmentos de dispositivos", icon: GitFork },
    ],
  },
  {
    title: "Marketing & Web",
    colorClass: "border-slate-200 hover:border-slate-300",
    iconBgClass: "bg-amber-50 text-amber-600",
    items: [
      { href: "/admin/slider", label: "Banners", desc: "Sliders de portada y promociones", icon: Images },
      { href: "/admin/sections", label: "Secciones", desc: "Bloques destacados de la Home", icon: Layers },
      { href: "/admin/advertisements", label: "Avisos", desc: "Barras superiores y popups", icon: Megaphone },
      { href: "/admin/claims", label: "Reclamaciones", desc: "Libro de reclamaciones virtual", icon: ShieldAlert },
    ],
  },
  {
    title: "Sistema & Accesos",
    colorClass: "border-slate-200 hover:border-slate-300",
    iconBgClass: "bg-indigo-50 text-indigo-600",
    items: [
      { href: "/admin/users", label: "Usuarios", desc: "Permisos y credenciales", icon: Users },
      { href: "/staff/attendance", label: "Asistencia", desc: "Marcación de colaboradores", icon: Fingerprint, isExternal: true },
      { href: "/pos", label: "Punto de Venta", desc: "Sistema POS para tienda física", icon: Store, isExternal: true },
      { href: "/", label: "Ver Tienda", desc: "Acceso al storefront público", icon: ExternalLink, isExternal: true },
    ],
  },
];

export default async function AdminPage() {
  return (
    <AdminPageContainer maxWidth="default" padding="default" spacing="default">
      <AdminPageHeader
        title="Panel de Admin."
      />

      <div className="space-y-6">
        {groups.map((group) => (
          <section key={group.title} className="space-y-2.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {group.title}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.isExternal ? "_blank" : undefined}
                    className={`group relative flex items-center gap-3 p-3 rounded-xl border bg-white hover:shadow-sm transition-all ${group.colorClass}`}
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${group.iconBgClass}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-slate-900 group-hover:text-slate-950 truncate">
                          {item.label}
                        </span>
                        {item.tag && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-700">
                            {item.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 truncate">
                        {item.desc}
                      </p>
                    </div>

                    <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </AdminPageContainer>
  );
}