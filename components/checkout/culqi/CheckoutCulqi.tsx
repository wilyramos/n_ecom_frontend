// File: frontend/components/checkout/culqi/CheckoutCulqi.tsx
"use client";

import ComponentScriptCulqiCustom from "./ComponentScriptCulqiCustom";
import { Muted } from "@/components/ui/Typography";
import type { TOrder } from "@/src/schemas";

export type CulqiOrderProps = TOrder & { culqiOrderId?: string };

export default function CheckoutCulqi({ order }: { order: CulqiOrderProps }) {
  if (!order) {
    return <Muted className="text-center mt-6 font-bold text-destructive">Orden inválida.</Muted>;
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full flex justify-center">
        <ComponentScriptCulqiCustom order={order} />
      </div>
    </div>
  );
}