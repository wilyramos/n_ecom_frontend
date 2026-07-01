"use client";

import React, { useState, useActionState, useEffect, useRef } from "react";
import { Receipt } from "lucide-react";
import { TicketForm } from "@/components/admin/tickets/TicketForm";
import { ThermalTicket } from "@/components/admin/tickets/ThermalTicket";
import AdminPageWrapper from "@/components/admin/AdminPageWrapper";
import { createManualTicketAction } from "@/actions/ticket-action";
import { type TicketData, type TicketActionState } from "@/src/schemas/ticket.schema";
import { useReactToPrint } from "react-to-print";

const initialActionState: TicketActionState = {
  success: null,
  message: null,
};

export default function AdminTicketsPage() {
  const [ticketSize, setTicketSize] = useState<"58mm" | "80mm">("80mm");
  const ticketRef = useRef<HTMLDivElement>(null);
  
  const [state, formAction, isPending] = useActionState(createManualTicketAction, initialActionState);

  const [data, setData] = useState<TicketData>({
    ticketSize: "80mm",
    storeName: "neoshop",
    address: "Av. Benavides 1234, Miraflores, Lima",
    email: "contacto@neoshop.com",
    phone: "(01) 444-5566",
    website: "www.neoshop.com",
    date: "Jan 14, 2026 16:34 PM",
    productName: "IPHONE 16 PRO MAX Black Titanium 1TB",
    partNumber: "MYX43ZP/A",
    serialNumber: "FPF799CYG3",
    imei1: "359844764014542",
    imei2: "359844766347916",
    returnDate: "Jan 28, 2026",
    subTotal: 2590.0,
    tax: 259.0,
    total: 2849.0,
    paymentMethod: "Visa(Chip)",
    cardNumber: "************2083",
    transactionId: "3993374526003",
    barcodeValue: "NEO51957266",
  });

  useEffect(() => {
    if (state.success && state.data) {
      window.open(`/api/sales/ticket-download?data=${encodeURIComponent(state.data)}`, "_blank");
    }
  }, [state]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData((prev) => {
      const updated = {
        ...prev,
        [name]: name.includes("subTotal") || name.includes("tax") || name.includes("total")
          ? parseFloat(value) || 0
          : value,
      };

      if (name === "subTotal" || name === "tax") {
        updated.total = updated.subTotal + updated.tax;
      }
      return updated;
    });
  };

  const handleSizeChange = (size: "58mm" | "80mm") => {
    setTicketSize(size);
    setData(prev => ({ ...prev, ticketSize: size }));
  };

  const handleLocalPrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: `Preview_${data.transactionId}`,
  });

  const renderActions = (
    <div className="flex items-center gap-2 bg-white border border-gray-200 p-1 rounded-lg shadow-sm">
      <button
        type="button"
        onClick={() => handleSizeChange("80mm")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
          ticketSize === "80mm" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Formato 80mm
      </button>
      <button
        type="button"
        onClick={() => handleSizeChange("58mm")}
        className={`px-3 py-1.5 text-xs font-semibold rounded-md transition cursor-pointer ${
          ticketSize === "58mm" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100"
        }`}
      >
        Formato 58mm
      </button>
    </div>
  );

  return (
    <AdminPageWrapper
      title="Tickets manuales"
      showBackButton={false}
      actions={renderActions}
    >
      <form action={formAction} className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        <div className="xl:col-span-7">
          <TicketForm 
            data={data} 
            onChange={handleInputChange} 
            isPending={isPending} 
            errors={state.errors} 
          />
          {state.message && !state.success && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">{state.message}</div>
          )}
        </div>

        <div className="xl:col-span-5 flex flex-col items-center">
          <div className="w-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-gray-500" />
                <span className="font-semibold text-sm uppercase tracking-wider text-gray-600">
                  Previsualización
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleLocalPrint()}
                className="text-xs text-blue-600 font-medium hover:underline bg-transparent border-none cursor-pointer"
              >
                Impresión
              </button>
            </div>
          </div>

          <div className="bg-white p-6 shadow-xl border border-gray-300 rounded-sm overflow-x-auto max-w-full">
            <ThermalTicket ref={ticketRef} data={data} ticketSize={ticketSize} />
          </div>
        </div>
      </form>
    </AdminPageWrapper>
  );
}