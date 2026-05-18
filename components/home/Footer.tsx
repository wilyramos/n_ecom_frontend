"use client";

import Link from "next/link";
import { ArrowUpRight, BookOpen, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import Logo from "../ui/Logo";
import PaymentMethods from "./PaymentMethods";
import { routes } from "@/lib/routes";

const navigation = {
    tienda: [
        { label: "Explorar catálogo", href: routes.catalog() },
        { label: "Novedades", href: "/novedades" },
        { label: "Ofertas exclusivas", href: "/ofertas" },
        { label: "Iphones", href: "/catalogo/iphone" },
    ],
    soporte: [
        { label: "Centro de ayuda", href: "/hc/contacto-y-soporte" },
        { label: "Garantías", href: "/hc/garantias-y-devoluciones" },
        { label: "Soporte técnico", href: "/hc/soporte-tecnico" },
        { label: "Preguntas frecuentes", href: "/hc/preguntas-frecuentes" },
    ],
    legal: [
        { label: "Política de privacidad", href: "/hc/politicas-de-privacidad" },
        { label: "Términos y condiciones", href: "/terminos" },
    ],
};

const social = [
    { label: "Instagram", href: "https://instagram.com/neoshop", icon: <FaInstagram size={14} /> },
    { label: "Facebook", href: "https://facebook.com/neoshop", icon: <FaFacebookF size={14} /> },
    { label: "WhatsApp", href: "https://wa.me/51902900653", icon: <FaWhatsapp size={14} /> },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden border-t border-border-default bg-surface-secondary text-fg-primary">
            <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
                <div className="grid gap-16 lg:grid-cols-[1.2fr_1fr]">
                    <div className="flex flex-col justify-between gap-12">
                        <div className="space-y-6">
                            <div className="w-36">
                                <Logo color="black" />
                            </div>
                            <p className="max-w-md text-sm leading-6 text-fg-primary/65">
                                Smartphones, accesorios y dispositivos cuidadosamente seleccionados para quienes valoran diseño, rendimiento y autenticidad.
                            </p>
                        </div>

                        <div className="flex flex-col gap-4 text-sm text-fg-primary/80 sm:gap-6">
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-border-default/40 text-action-primary">
                                    <MapPin size={16} />
                                </span>
                                <p>Av. Caminos del Inca 257 · Piso 3 · Surco</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-border-default/40 text-action-primary">
                                    <Mail size={16} />
                                </span>
                                <a href="mailto:neoshopimportaciones@gmail.com" className="transition-colors hover:text-action-primary">
                                    neoshopimportaciones@gmail.com
                                </a>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-border-default/40 text-action-primary">
                                    <Phone size={16} />
                                </span>
                                <a href="https://wa.me/51902900653" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-action-primary">
                                    +51 902 900 653
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-12 sm:grid-cols-2">
                        <div className="grid gap-12">
                            <FooterLinks title="Tienda" links={navigation.tienda} />
                            
                            <div className="space-y-4">
                                <SectionTitle>Social</SectionTitle>
                                <div className="flex flex-col gap-2.5">
                                    {social.map((item) => (
                                        <a 
                                            key={item.label} 
                                            href={item.href} 
                                            target="_blank" 
                                            rel="noopener noreferrer" 
                                            className="group flex items-center justify-between border-b border-border-default/50 pb-2.5 text-sm text-fg-primary/70 transition-colors hover:text-fg-primary"
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-default transition-all group-hover:border-action-primary group-hover:bg-action-primary group-hover:text-fg-inverse">
                                                    {item.icon}
                                                </span>
                                                <span>{item.label}</span>
                                            </div>
                                            <ArrowUpRight size={14} className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-12">
                            <FooterLinks title="Soporte" links={navigation.soporte} />

                            <div className="space-y-4">
                                <SectionTitle>Legal</SectionTitle>
                                <nav className="flex flex-col gap-2.5">
                                    {navigation.legal.map((link) => (
                                        <Link key={link.href} href={link.href} className="w-fit text-sm text-fg-primary/70 transition-colors hover:text-fg-primary">
                                            {link.label}
                                        </Link>
                                    ))}
                                </nav>
                                <div className="pt-2">
                                    <Link href="/hc/libro-de-reclamaciones" className="inline-flex items-center gap-2 rounded-full border border-border-default px-4 py-2 text-xs font-medium tracking-wide text-fg-primary/75 transition-all hover:border-action-primary hover:bg-action-primary hover:text-fg-inverse">
                                        <BookOpen size={14} />
                                        Libro de Reclamaciones
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-20 flex flex-col gap-8 border-t border-border-default pt-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="space-y-2">
                        <p className="text-xs uppercase tracking-[0.16em] text-fg-primary/45">Neoshop Importaciones</p>
                        <p className="max-w-md text-xs leading-5 text-fg-primary/60">
                            Distribuidor independiente de tecnología y accesorios premium con garantía oficial en Perú.
                        </p>
                    </div>
                    <div className="flex flex-col items-start gap-6 lg:items-end">
                        <div className="opacity-80 transition-opacity hover:opacity-100">
                            <PaymentMethods />
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.14em] text-fg-primary/40">© 2026 · Todos los derechos reservados</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-fg-primary">{children}</h3>;
}

function FooterLinks({ title, links }: { title: string; links: { label: string; href: string }[] }) {
    return (
        <div className="space-y-4">
            <SectionTitle>{title}</SectionTitle>
            <nav className="flex flex-col gap-2.5">
                {links.map((link) => (
                    <Link key={link.href} href={link.href} className="w-fit text-sm transition-all hover:translate-x-1 hover:text-action-primary text-fg-primary/70">
                        {link.label}
                    </Link>
                ))}
            </nav>
        </div>
    );
}