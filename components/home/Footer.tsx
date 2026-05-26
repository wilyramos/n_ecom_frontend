"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import PaymentMethods from "./PaymentMethods";
import { routes } from "@/lib/routes";

const navigation = {
    tienda: [
        { label: "Explorar catálogo", href: routes.catalog() },
        { label: "Iphones", href: "/catalogo/iphone" },
    ],
    soporte: [
        { label: "Centro de ayuda", href: "/hc/contacto-y-soporte" },
        { label: "Garantías", href: "/hc/garantias-y-devoluciones" },
        { label: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
    ],
    legal: [
        { label: "Política de privacidad", href: "/hc/politicas-de-privacidad" },
        { label: "Términos y condiciones", href: "/terminos" },
        { label: "Política de cambios y devoluciones", href: "/cambios-devoluciones" },
    ],
};

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-border-default bg-fg-secondary/50 text-fg-primary">
            <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
                <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr]">
                    <div className="flex flex-col gap-6">
                        <div className="w-32">
                            {/* <Logo color="white" /> */}
                        </div>
                        <p className="max-w-xs text-xs leading-5 text-fg-primary">
                            Smartphones, accesorios y dispositivos cuidadosamente seleccionados para quienes valoran diseño, rendimiento y autenticidad.
                        </p>
                    </div>

                    <div className="grid gap-8 sm:grid-cols-3">
                        <FooterLinks title="Tienda" links={navigation.tienda} />
                        <FooterLinks title="Soporte" links={navigation.soporte} />
                        
                        <div className="space-y-3">
                            <SectionTitle>Legal</SectionTitle>
                            <nav className="flex flex-col gap-2">
                                {navigation.legal.map((link) => (
                                    <Link key={link.href} href={link.href} className="w-fit text-xs text-fg-primary transition-colors hover:text-action-primary-hover">
                                        {link.label}
                                    </Link>
                                ))}
                            </nav>
                            <div className="pt-1">
                                <Link href="/hc/libro-de-reclamaciones" className="inline-flex items-center gap-2 rounded-md border border-border-default px-3 py-1.5 text-xs font-medium text-fg-primary transition-all hover:bg-action-primary-hover hover:text-fg-inverse">
                                    <BookOpen size={12} />
                                    Libro de Reclamaciones
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-6 border-t border-border-default pt-6 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-fg-primary font-semibold">Neoshop Importaciones</p>
                       
                    </div>
                    <div className="flex flex-col items-start gap-4 lg:items-end">
                        <div className="opacity-90 hover:opacity-100 transition-opacity">
                            <PaymentMethods />
                        </div>
                        <p className="text-[10px] uppercase tracking-wider text-fg-primary">© 2026 · Todos los derechos reservados</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-[10px] font-semibold uppercase tracking-wider text-fg-primary">{children}</h3>;
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    return (
        <div className="space-y-3">
            <SectionTitle>{title}</SectionTitle>
            <nav className="flex flex-col gap-2">
                {links.map((link) => (
                    <Link key={link.href} href={link.href} className="w-fit text-xs text-fg-primary transition-all hover:translate-x-0.5 hover:text-action-primary-hover">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}