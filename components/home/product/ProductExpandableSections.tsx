// File: frontend/components/home/product/ProductExpandableSections.tsx
"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Package, Ruler } from "lucide-react";
import type { ProductWithCategoryResponse } from "@/src/schemas";

type Props = {
  producto: ProductWithCategoryResponse;
};

export default function ProductExpandableSections({ producto }: Props) {
  const descripcionRaw = producto.descripcion ?? "";
  const hasDescripcion = descripcionRaw.trim().length > 0 && descripcionRaw !== "<p><br></p>";

  const specsArray = producto.especificaciones ?? [];
  const hasWeight = Boolean(producto.weight && producto.weight > 0);
  const hasDimensions = Boolean(
    producto.dimensions?.length ||
    producto.dimensions?.width ||
    producto.dimensions?.height
  );

  const hasSpecs = specsArray.length > 0 || hasWeight || hasDimensions;

  if (!hasDescripcion && !hasSpecs) return null;

  return (
    <Accordion type="multiple" className="w-full space-y-2 bg-surface-primary pt-2">
      {hasDescripcion && (
        <AccordionItem value="info" className="border border-border-default rounded-xl overflow-hidden px-1">
          <AccordionTrigger className="hover:no-underline group px-4 py-4">
            <span className="text-sm font-semibold tracking-tight text-fg-primary">
              Información del producto
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2 px-4">
            <div 
              className="prose prose-sm max-w-none text-fg-primary text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: descripcionRaw }}
            />
          </AccordionContent>
        </AccordionItem>
      )}

      {hasSpecs && (
        <AccordionItem value="specs" className="border border-border-default rounded-xl overflow-hidden px-1">
          <AccordionTrigger className="hover:no-underline group px-4 py-4">
            <span className="text-sm font-semibold tracking-tight text-fg-primary">
              Especificaciones técnicas
            </span>
          </AccordionTrigger>
          <AccordionContent className="pb-6 pt-2 px-4">
            <div className="flex flex-col gap-6 w-full">
              {specsArray.length > 0 && (
                <div className="w-full overflow-hidden border border-border-default rounded-lg bg-surface-primary">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th colSpan={2} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-fg-primary border-b border-border-default bg-surface-secondary/50">
                          Características
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {specsArray.map((spec) => (
                        <tr key={spec.key} className="hover:bg-surface-secondary/30 transition-colors">
                          <td className="px-5 py-3 text-xs font-medium text-fg-muted w-[40%] align-top">{spec.key}</td>
                          <td className="px-5 py-3 text-sm font-semibold text-fg-primary w-[60%] align-top">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {(hasWeight || hasDimensions) && (
                <div className="w-full overflow-hidden border border-border-default rounded-lg bg-surface-primary">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th colSpan={2} className="px-5 py-3 text-xs font-bold uppercase tracking-wider text-fg-primary border-b border-border-default bg-surface-secondary/50">
                          <div className="flex items-center gap-2">
                            <Package size={14} /> Físico y embalaje
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-default">
                      {hasWeight && (
                        <tr className="hover:bg-surface-secondary/30 transition-colors">
                          <td className="px-5 py-3 text-xs font-medium text-fg-muted w-[40%]">Peso</td>
                          <td className="px-5 py-3 text-sm font-semibold text-fg-primary w-[60%]">{producto.weight} kg</td>
                        </tr>
                      )}
                      {hasDimensions && (
                        <tr className="hover:bg-surface-secondary/30 transition-colors">
                          <td className="px-5 py-3 text-xs font-medium text-fg-muted w-[40%]">
                            <div className="flex items-center gap-1.5"><Ruler size={12} /> Dimensiones</div>
                          </td>
                          <td className="px-5 py-3 text-sm font-semibold text-fg-primary w-[60%]">
                            {producto.dimensions?.length} × {producto.dimensions?.width} × {producto.dimensions?.height} cm
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}