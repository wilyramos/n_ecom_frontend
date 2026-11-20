// File: frontend/components/home/product/ProductPriceOptions.tsx
"use client";

import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import PowerpayPdp from "@/src/components/powerpay/PowerpayPdp";
import PaymentMethods from "../PaymentMethods";

// Descuento fijo en efectivo para productos de la categoría iPhone
const CASH_DISCOUNT_IPHONE = 100;

type Props = {
  precio: number;
  precioComparativo: number | null;
  /** true cuando aún no se eligió variante y se muestra el precio mínimo */
  esDesde?: boolean;
  categoriaNombre?: string | null;
  categoriaSlug?: string | null;
};

const normalize = (value?: string | null) =>
  (value ?? "").toLowerCase().replace(/[\s\-_]+/g, "");

const isIphoneCategory = (nombre?: string | null, slug?: string | null) =>
  normalize(nombre).includes("iphone") || normalize(slug).includes("iphone");

export default function ProductPriceOptions({
  precio,
  precioComparativo,
  esDesde = false,
  categoriaNombre,
  categoriaSlug,
}: Props) {
  const hasDiscount = precioComparativo !== null && precioComparativo > precio;
  const porcentajeDescuento = hasDiscount
    ? Math.round(((precioComparativo! - precio) / precioComparativo!) * 100)
    : 0;

  const clientId = process.env.NEXT_PUBLIC_POWERPAY_CLIENT_ID;
  const showPowerpay = Boolean(clientId) && precio > 0;

  const showCash =
    isIphoneCategory(categoriaNombre, categoriaSlug) && precio > CASH_DISCOUNT_IPHONE;
  const precioContado = precio - CASH_DISCOUNT_IPHONE;

  return (
    <div className="space-y-2 min-w-0 w-full max-w-full">
      {/* Tarjeta PowerPay */}
      {showPowerpay && (
        <div className="flex flex-col justify-center min-w-0 max-w-full overflow-hidden">
          <PowerpayPdp price={precio} />
        </div>
      )}

      {/* Tarjeta: precio con tarjeta + bancos */}
      <div className="flex flex-col gap-3 p-3 rounded-xl border border-brand-silver-border bg-background min-w-0 overflow-hidden">
        {/* Precio con tarjeta */}
        <div className="flex flex-col justify-center gap-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-gris">
            Precio con tarjeta
          </p>

          <div className="flex flex-nowrap items-center gap-x-2 sm:gap-x-3 whitespace-nowrap text-brand-charcoal">
            {esDesde && <span className="text-xs font-medium text-brand-gris">Desde</span>}
            <span className="text-sm sm:text-base font-medium">S/</span>
            <span className="text-base sm:text-lg md:text-xl font-semibold tracking-tight leading-none">
              {precio.toFixed(2)}
            </span>
            {hasDiscount && (
              <>
                <span className="text-base sm:text-lg md:text-xl font-medium text-brand-gris line-through leading-none">
                  S/ {precioComparativo!.toFixed(2)}
                </span>
                <span className="text-xs font-semibold px-1.5 sm:px-2 py-0.5 rounded-sm bg-destructive text-destructive-foreground">
                  −{porcentajeDescuento}%
                </span>
              </>
            )}
          </div>
        </div>

        {/* Bancos participantes */}
        <div className="space-y-1.5 pt-2.5 border-t border-brand-silver-border">
          <p className="text-[11px] text-brand-gris">*Bancos participantes:</p>
          <PaymentMethods size="md" className="w-full justify-between" />
        </div>
      </div>

      {/* Precio al contado (solo iPhone) */}
      {showCash && (
        <div className="flex flex-col gap-1.5 px-3 py-2.5 rounded-xl bg-black text-white shadow-sm">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
              Precio especial por transferencia o efectivo
            </p>
            <span className="text-[11px] opacity-80 whitespace-nowrap">
              Ahorras <span className="font-bold opacity-100">S/ {CASH_DISCOUNT_IPHONE.toFixed(2)}</span>
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 text-white">
            {esDesde && <span className="text-[10px] opacity-80">Desde</span>}
            <span className="text-sm font-medium">S/</span>
            <span className="text-lg md:text-xl font-bold tracking-tight leading-none">
              {precioContado.toFixed(2)}
            </span>
          </div>

          <div className="pt-1 border-t border-white/20">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="pago-al-contado" className="border-white/20">
                <AccordionTrigger className="py-1 text-[11px] font-semibold hover:no-underline text-white">
                  ¿Necesitas más información?
                </AccordionTrigger>
                <AccordionContent className="text-[11px] leading-snug text-white/90">
                  <p>
                    Aprovecha un precio exclusivo pagando por transferencia bancaria o efectivo.
                  </p>
                  <p className="mt-1.5">
                    Al finalizar tu compra, selecciona esta modalidad de pago y nuestro equipo
                    se comunicará contigo por WhatsApp para coordinar el pago y confirmar tu pedido.
                  </p>
                  <p className="mt-2">
                    <span className="font-semibold">Ten en cuenta:</span> este precio especial
                    aplica únicamente para pagos en efectivo o transferencia bancaria. Si
                    prefieres pagar con tarjeta de crédito o en cuotas, se aplicará el precio
                    correspondiente a dicha modalidad.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
}
