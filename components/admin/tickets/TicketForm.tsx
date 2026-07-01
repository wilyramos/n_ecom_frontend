"use client";

import React from "react";
import { Sliders, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { type TicketData } from "@/src/schemas/ticket.schema";

interface TicketFormProps {
  data: TicketData;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPending: boolean;
  errors?: Record<string, string[]>;
}

export const TicketForm: React.FC<TicketFormProps> = ({ data, onChange, isPending, errors }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header del Formulario */}
      <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <Sliders className="w-4 h-4 text-gray-500" />
        <h2 className="font-semibold text-sm uppercase tracking-wider text-gray-600">Datos del Ticket</h2>
      </div>

      {/* Input oculto indispensable para enviar el tamaño seleccionado al Server Action */}
      <input type="hidden" name="ticketSize" value={data.ticketSize} />
      
      <div className="p-6 space-y-6">
        {/* BLOQUE 1: DATOS DE CABECERA */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Datos de Cabecera</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="storeName">Nombre de Tienda</Label>
              <Input type="text" id="storeName" name="storeName" value={data.storeName} onChange={onChange} />
              {errors?.storeName && <p className="text-xs text-red-500 mt-1">{errors.storeName[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="address">Dirección</Label>
              <Input type="text" id="address" name="address" value={data.address} onChange={onChange} />
              {errors?.address && <p className="text-xs text-red-500 mt-1">{errors.address[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email">Email de Contacto</Label>
              <Input type="email" id="email" name="email" value={data.email} onChange={onChange} />
              {errors?.email && <p className="text-xs text-red-500 mt-1">{errors.email[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone">Teléfono</Label>
              <Input type="text" id="phone" name="phone" value={data.phone} onChange={onChange} />
              {errors?.phone && <p className="text-xs text-red-500 mt-1">{errors.phone[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website">Sitio Web</Label>
              <Input type="text" id="website" name="website" value={data.website} onChange={onChange} />
              {errors?.website && <p className="text-xs text-red-500 mt-1">{errors.website[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Fecha Emisión</Label>
              <Input type="text" id="date" name="date" value={data.date} onChange={onChange} />
              {errors?.date && <p className="text-xs text-red-500 mt-1">{errors.date[0]}</p>}
            </div>
          </div>
        </div>

        {/* BLOQUE 2: ESPECIFICACIONES DEL PRODUCTO */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Especificaciones del Ítem</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="productName">Producto</Label>
              <Input type="text" id="productName" name="productName" value={data.productName} onChange={onChange} />
              {errors?.productName && <p className="text-xs text-red-500 mt-1">{errors.productName[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="partNumber">Part Number</Label>
              <Input type="text" id="partNumber" name="partNumber" value={data.partNumber} onChange={onChange} />
              {errors?.partNumber && <p className="text-xs text-red-500 mt-1">{errors.partNumber[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input type="text" id="serialNumber" name="serialNumber" value={data.serialNumber} onChange={onChange} />
              {errors?.serialNumber && <p className="text-xs text-red-500 mt-1">{errors.serialNumber[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imei1">IMEI 1</Label>
              <Input type="text" id="imei1" name="imei1" value={data.imei1} onChange={onChange} />
              {errors?.imei1 && <p className="text-xs text-red-500 mt-1">{errors.imei1[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="imei2">IMEI 2</Label>
              <Input type="text" id="imei2" name="imei2" value={data.imei2} onChange={onChange} />
              {errors?.imei2 && <p className="text-xs text-red-500 mt-1">{errors.imei2[0]}</p>}
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="returnDate">Fecha Límite Devolución</Label>
              <Input type="text" id="returnDate" name="returnDate" value={data.returnDate} onChange={onChange} />
              {errors?.returnDate && <p className="text-xs text-red-500 mt-1">{errors.returnDate[0]}</p>}
            </div>
          </div>
        </div>

        {/* BLOQUE 3: FINANZAS Y AUDITORÍA */}
        <div className="border-t border-gray-100 pt-6 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Finanzas y Auditoría</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="subTotal">Sub Total ($)</Label>
              <Input type="number" step="0.01" id="subTotal" name="subTotal" value={data.subTotal} onChange={onChange} />
              {errors?.subTotal && <p className="text-xs text-red-500 mt-1">{errors.subTotal[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tax">Impuestos ($)</Label>
              <Input type="number" step="0.01" id="tax" name="tax" value={data.tax} onChange={onChange} />
              {errors?.tax && <p className="text-xs text-red-500 mt-1">{errors.tax[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="total">Total ($)</Label>
              <Input type="number" step="0.01" id="total" name="total" value={data.total} className="bg-gray-50 font-bold text-gray-700" readOnly />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="paymentMethod">Método de Pago</Label>
              <Input type="text" id="paymentMethod" name="paymentMethod" value={data.paymentMethod} onChange={onChange} />
              {errors?.paymentMethod && <p className="text-xs text-red-500 mt-1">{errors.paymentMethod[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cardNumber">Tarjeta / Cuenta</Label>
              <Input type="text" id="cardNumber" name="cardNumber" value={data.cardNumber} onChange={onChange} />
              {errors?.cardNumber && <p className="text-xs text-red-500 mt-1">{errors.cardNumber[0]}</p>}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="transactionId">ID Transacción</Label>
              <Input type="text" id="transactionId" name="transactionId" value={data.transactionId} onChange={onChange} />
              {errors?.transactionId && <p className="text-xs text-red-500 mt-1">{errors.transactionId[0]}</p>}
            </div>
            <div className="md:col-span-3 space-y-1.5">
              <Label htmlFor="barcodeValue">Código de Barras (Contenido)</Label>
              <Input type="text" id="barcodeValue" name="barcodeValue" value={data.barcodeValue} onChange={onChange} placeholder="Escribe el código alfanumérico para el escáner" />
              {errors?.barcodeValue && <p className="text-xs text-red-500 mt-1">{errors.barcodeValue[0]}</p>}
            </div>
          </div>
        </div>
      </div>

      {/* Footer con el botón de envío conectado al estado de carga de la Action de Next.js */}
      <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-lg text-sm font-medium shadow hover:bg-gray-800 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Printer className="w-4 h-4" /> {isPending ? "Procesando en Express..." : "Imprimir Ticket PDF"}
        </Button>
      </div>
    </div>
  );
};