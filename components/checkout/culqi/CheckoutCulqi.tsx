"use client";

import ComponentScriptCulqiCustom from "./ComponentScriptCulqiCustom";
import { Muted } from "@/components/ui/Typography";
import type { TOrder } from "@/src/schemas";

export type CulqiOrderProps = TOrder & { culqiOrderId?: string };

export default function CheckoutCulqi({ order }: { order: CulqiOrderProps }) {
  if (!order) {
    return <Muted className="text-center py-2 font-bold text-destructive">Orden inválida.</Muted>;
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-full">
        <ComponentScriptCulqiCustom order={order} />
      </div>
    </div>
  );
}