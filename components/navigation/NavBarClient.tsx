"use client";

import { ReactNode } from "react";

export default function NavBarClient({ children }: { children: ReactNode }) {
    return (
        <div className="w-full">
            {children}
        </div>
    );
}