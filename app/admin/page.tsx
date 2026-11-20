// File: frontend/app/admin/page.tsx

import Link from "next/link";
import {
  ShoppingCart,
  Package,
  Images,
  Home,
  ArrowUpRight,
  ExternalLink,
  LucideIcon,
  Truck,
  ReceiptText,
  TrendingUp,
  Boxes,
  Tags,
  Building2,
  GitFork,
  Layers,
  Megaphone,
  FileStack,
  ShieldAlert,
  Users,
  Fingerprint,
  Store,
} from "lucide-react";

type Item = {
  href: string;
  label: string;
  desc: string;
  icon: LucideIcon;
  isExternal?: boolean;
  tag?: string;
};

type Section = {
  title: string;
  items: Item[];
};

// Accesos rápidos: las tareas que más se repiten
const quickActions: Item[] = [
  { href: "/admin/pedidos", label: "Pedidos", desc: "Ver y gestionar compras", icon: ShoppingCart, tag: "NUEVO" },
  { href: "/admin/products/new", label: "Nuevo producto", desc: "Agregar al catálogo", icon: Package },
  { href: "/admin/slider", label: "Banners", desc: "Portada y promociones", icon: Images },
  { href: "/", label: "Ver página principal", desc: "Abrir la tienda", icon: Home, isExternal: true },
];

const sections: Section[] = [
  {
    title: "Ventas",
    items: [
      { href: "/admin/pedidos", label: "Pedidos ecommerce", desc: "Compras online y pasarelas", icon: Truck },
      { href: "/admin/tickets-v2", label: "Comprobantes", desc: "Boletas y facturas", icon: ReceiptText },
      { href: "/admin/reports", label: "Reportes", desc: "Ventas y recaudación", icon: TrendingUp },
    ],
  },
  {
    title: "Catálogo",
    items: [
      { href: "/admin/products", label: "Productos", desc: "Precios, stock y variantes", icon: Boxes },
      { href: "/admin/products/category", label: "Categorías", desc: "Estructura del catálogo", icon: Tags },
      { href: "/admin/brands", label: "Marcas", desc: "Fabricantes", icon: Building2 },
      { href: "/admin/lines", label: "Líneas", desc: "Segmentos de dispositivos", icon: GitFork },
    ],
  },
  {
    title: "Página principal",
    items: [
      { href: "/admin/slider", label: "Banners", desc: "Sliders de portada", icon: Images },
      { href: "/admin/sections", label: "Secciones", desc: "Bloques destacados", icon: Layers },
      { href: "/admin/advertisements", label: "Avisos", desc: "Barras superiores y popups", icon: Megaphone },
      { href: "/admin/pages", label: "Páginas", desc: "Contenido institucional", icon: FileStack },
    ],
  },
  {
    title: "Gestión",
    items: [
      { href: "/admin/claims", label: "Reclamaciones", desc: "Libro de reclamaciones", icon: ShieldAlert },
      { href: "/admin/users", label: "Usuarios", desc: "Permisos y accesos", icon: Users },
      { href: "/admin/attendance", label: "Asistencias", desc: "Marcación de colaboradores", icon: Fingerprint },
    ],
  },
  {
    title: "Accesos",
    items: [
      { href: "/pos", label: "Punto de venta", desc: "POS para tienda física", icon: Store, isExternal: true },
      { href: "/", label: "Tienda online", desc: "Storefront público", icon: ExternalLink, isExternal: true },
    ],
  },
];

function QuickAction({ item }: { item: Item }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      target={item.isExternal ? "_blank" : undefined}
      rel={item.isExternal ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-semibold text-zinc-900">{item.label}</span>
          {item.tag && (
            <span className="rounded-full bg-amber-100 px-1.5 text-[9px] font-bold text-amber-700">{item.tag}</span>
          )}
        </span>
        <span className="block truncate text-[11px] text-zinc-500">{item.desc}</span>
      </span>
    </Link>
  );
}

function SectionCard({ section }: { section: Section }) {
  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <header className="border-b border-zinc-100 px-4 py-2.5">
        <h2 className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{section.title}</h2>
      </header>

      <ul className="divide-y divide-zinc-100">
        {section.items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={`${section.title}-${item.label}`}>
              <Link
                href={item.href}
                target={item.isExternal ? "_blank" : undefined}
                rel={item.isExternal ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-zinc-50"
              >
                <Icon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-800" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-zinc-800">{item.label}</span>
                  <span className="block truncate text-[11px] text-zinc-500">{item.desc}</span>
                </span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-zinc-300 transition-colors group-hover:text-zinc-600" />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default async function AdminPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6">
      <header>
        <h1 className="text-lg font-semibold text-zinc-900">Panel de administración</h1>
        <p className="text-xs text-zinc-500">Accesos rápidos y módulos del sistema</p>
      </header>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 xl:grid-cols-4">
        {quickActions.map((item) => (
          <QuickAction key={item.href + item.label} item={item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <SectionCard key={section.title} section={section} />
        ))}
      </div>
    </div>
  );
}
