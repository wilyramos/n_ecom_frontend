// Punto de venta (legacy): área privada, no indexar.
import type { Metadata } from "next";
import { NOINDEX_ROBOTS } from "@/lib/site";

export const metadata: Metadata = {
  robots: NOINDEX_ROBOTS,
};

export default function PosLegacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
