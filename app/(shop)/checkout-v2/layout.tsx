// File: frontend/app/(shop)/checkout-v2/layout.tsx

import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { ArrowLeft } from "lucide-react";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 antialiased font-[family-name:var(--font-inter),sans-serif]">
      {/* Header Seguro y Minimalista */}
      <header className="bg-white border-b border-neutral-200 py-3 sticky top-0 z-40">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center h-6 w-28 sm:w-32 transition-opacity hover:opacity-80">
            <Logo color="black" className="h-full w-full object-contain" />
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/carrito"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Volver al carrito</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 flex w-full">
        {children}
      </main>
    </div>
  );
}