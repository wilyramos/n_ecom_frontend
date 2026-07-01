"use client";

import React, { forwardRef } from "react";
import { Libre_Barcode_39 } from "next/font/google";

const barcodeFont = Libre_Barcode_39({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

interface TicketData {
  storeName: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  date: string;
  productName: string;
  partNumber: string;
  serialNumber: string;
  imei1: string;
  imei2: string;
  returnDate: string;
  subTotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cardNumber: string;
  transactionId: string;
  barcodeValue: string;
}

interface ThermalTicketProps {
  data: TicketData;
  ticketSize: "58mm" | "80mm";
}

export const ThermalTicket = forwardRef<HTMLDivElement, ThermalTicketProps>(
  ({ data, ticketSize }, ref) => {
    const formattedBarcode = `*${data.barcodeValue.trim()}*`;

    return (
      <div
        ref={ref}
        className="ticket-print font-mono text-black bg-white select-none"
        style={{
          width: ticketSize === "80mm" ? "80mm" : "58mm",
          padding: ticketSize === "80mm" ? "8mm" : "4mm",
          fontSize: "11px",
          lineHeight: "1.35",
        }}
      >
        {/* Inyección de CSS de impresión configurado para generación de PDF sin cortes de página A4 */}
        <style dangerouslySetInnerHTML={{ __html: `
          @media print {
            @page {
              margin: 0;
              /* Fuerza al generador PDF a usar las dimensiones reales del ticket */
              size: ${ticketSize} auto; 
            }
            body {
              background: white;
              color: black;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .ticket-print {
              width: ${ticketSize} !important;
              padding: ${ticketSize === '80mm' ? '8mm' : '3mm'} !important;
              font-family: monospace !important;
              font-size: 11px !important;
              box-shadow: none !important;
              margin: 0 !important;
              display: block !important;
            }
          }
        `}} />

        {/* Encabezado Corporativo */}
        <div className="text-start mb-3">
          <div className="text-xl font-bold uppercase tracking-wider">{data.storeName}</div>
          <div className="text-[10px] mt-0.5 leading-tight">{data.address}</div>
          <div className="text-[10px]">{data.email}</div>
          <div className="text-[10px]">{data.phone}</div>
          <div className="text-[10px]">{data.website}</div>
        </div>

        <div className="border-b border-black my-2 w-full" />
        <div className="text-[10px] text-left px-1">{data.date}</div>
        <div className="border-b border-black my-2 w-full" />

        {/* Descripción del Ítem */}
        <div className="font-bold uppercase tracking-wide text-xs px-1 mb-2 break-words">
          {data.productName}
        </div>

        {/* Trazabilidad técnica / IMEIs */}
        <div className="space-y-0.5 text-[10px] px-1">
          <div className="flex justify-between"><span>Part Number:</span> <span className="font-bold">{data.partNumber}</span></div>
          <div className="flex justify-between"><span>Serial Number:</span> <span className="font-bold">{data.serialNumber}</span></div>
          <div className="flex justify-between"><span>IMEI 1:</span> <span>{data.imei1}</span></div>
          <div className="flex justify-between"><span>IMEI 2:</span> <span>{data.imei2}</span></div>
          <div className="flex justify-between"><span>Return Date:</span> <span>{data.returnDate}</span></div>
        </div>

        {/* Términos de Garantía y Devolución */}
        <div className="text-[9px] mt-4 px-1 text-justify leading-tight space-y-2">
          <p>Use of device constitutes acceptance of the terms and conditions found in the original packaging or at {data.website}/legal.</p>
          <p>The sales tax varies by state and region and is calculated based on the purchase values.</p>
          <p>If you are not fully satisfied, you can return your undamaged product within 14 days for a full refund.</p>
        </div>

        <div className="border-b border-black my-3 w-full" />

        {/* Bloque Económico */}
        <div className="space-y-0.5 text-xs px-1">
          <div className="flex justify-between">
            <span>Sub Total</span>
            <span>${data.subTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos (IGV/TAX)</span>
            <span>${data.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-sm border-t border-black pt-1 mt-1">
            <span>Total</span>
            <span>${data.total.toFixed(2)}</span>
          </div>
        </div>

        {/* Información del Pago */}
        <div className="mt-4 text-[10px] px-1 space-y-0.5">
          <div className="font-bold">Payment Method</div>
          <div>{data.paymentMethod}</div>
          <div>{data.cardNumber}</div>
          <div className="mt-1 font-bold">Trans. ID: {data.transactionId}</div>
        </div>

        <div className="text-[9px] mt-4 px-1 text-justify leading-tight text-gray-700">
          Gift card remaining balance may exclude any pending orders placed through the NeoShop online store of neoshop.
        </div>
        
        <div className="border-b border-black my-2 w-full" />

        {/* Generador de Código de Barras Real */}
        <div className="mt-5 flex flex-col items-center justify-center">
          <div 
            className={`${barcodeFont.className} text-4xl tracking-normal my-1 select-none`}
            style={{ fontSize: ticketSize === "58mm" ? "32px" : "42px" }}
          >
            {formattedBarcode}
          </div>
          <div className="text-[10px] tracking-[3px] font-mono font-bold">{data.barcodeValue}</div>
        </div>

      </div>
    );
  }
);

ThermalTicket.displayName = "ThermalTicket";