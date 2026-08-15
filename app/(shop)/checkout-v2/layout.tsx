// File: frontend/app/(shop)/checkout-v2/layout.tsx
import React from "react";
import Link from "next/link";
import Logo from "@/components/ui/Logo";
import { HiOutlineShoppingBag } from "react-icons/hi2";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header minimalista estilo Shopify */}
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-50">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/" className="flex items-center h-8 w-32 sm:w-40 transition-opacity hover:opacity-80">
            <Logo color="black" className="h-full w-full object-contain" />
          </Link>

          <Link
            href="/carrito"
            className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors"
          >
            <HiOutlineShoppingBag size={18} />
            <span className="hidden sm:inline">Volver al carrito</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex w-full">
        {children}
      </main>
    </div>
  );
}