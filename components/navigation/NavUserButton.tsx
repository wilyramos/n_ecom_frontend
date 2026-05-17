"use client";

import Link from "next/link";
import { User } from "lucide-react";

export default function NavUserButton() {
    return (
        <Link
            href="/auth/registro"
            className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-fg-primary/5 transition-colors text-fg-primary"
            aria-label="Cuenta de usuario"
        >
            <User size={20} strokeWidth={1.5} />
        </Link>
    );
}