"use client";

import Image from "next/image";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";

interface SortableImageItemProps {
  id: string;
  isFirst: boolean;
  onRemove: (id: string) => void;
}

export default function SortableImageItem({ id, isFirst, onRemove }: SortableImageItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative aspect-square border rounded-lg bg-white overflow-hidden group shadow-2xs select-none ${
        isDragging ? "border-slate-900 ring-2 ring-slate-900/20" : "border-slate-200"
      }`}
    >
      <Image
        src={id}
        alt="Product"
        fill
        sizes="(max-width: 768px) 33vw, 15vw"
        className="object-cover pointer-events-none"
        unoptimized
      />

      {isFirst && (
        <span className="absolute bottom-1 left-1 bg-slate-900/80 text-white text-[9px] font-medium px-1 rounded z-10">
          Principal
        </span>
      )}

      {/* Grip Handle para arrastrar */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 bg-slate-900/70 hover:bg-slate-900 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-10"
        title="Arrastrar para ordenar"
      >
        <GripVertical size={12} />
      </div>

      {/* Botón eliminar */}
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="absolute top-1 right-1 bg-slate-900/70 hover:bg-rose-600 text-white p-1 rounded-md opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
        title="Eliminar archivo"
      >
        <X size={12} />
      </button>

      <input type="hidden" name="imagenes[]" value={id} />
    </div>
  );
}