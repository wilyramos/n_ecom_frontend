// File: frontend/src/modules/cupones/components/CuponesTable.tsx

'use client';

import { useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Pencil, Power, Trash2 } from 'lucide-react';
import {
  AdminTable,
  AdminTableHead,
  AdminTableHeaderCell,
  AdminTableCell,
  AdminTableEmpty,
} from '@/src/components/admin/layout/admin-table';
import { AdminTablePagination } from '@/src/components/admin/layout/admin-table-pagination';
import { AdminTableActions, type ActionItem } from '@/src/components/admin/layout/admin-table-actions';
import { AdminInput, AdminSelect } from '@/src/components/admin/layout/admin-form-group';
import type { ICupon, ICuponesPaginados } from '../types/cupon.types';
import {
  cambiarEstadoCuponAction,
  eliminarCuponAction,
} from '../actions/cupones.actions';

export const formatearValor = (c: Pick<ICupon, 'tipo' | 'valor'>) =>
  c.tipo === 'porcentaje' ? `${c.valor}%` : `S/ ${c.valor.toFixed(2)}`;

export const etiquetaAlcance = (c: Pick<ICupon, 'aplicaA' | 'categorias' | 'productos'>) => {
  if (c.aplicaA === 'categorias') return `${c.categorias.length} categoría(s)`;
  if (c.aplicaA === 'productos') return `${c.productos.length} producto(s)`;
  return 'Todo el catálogo';
};

const formatearFecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' }) : null;

function vigencia(c: ICupon) {
  const inicio = formatearFecha(c.fechaInicio);
  const fin = formatearFecha(c.fechaFin);
  if (!inicio && !fin) return 'Sin límite';
  if (inicio && fin) return `${inicio} → ${fin}`;
  return inicio ? `Desde ${inicio}` : `Hasta ${fin}`;
}

interface Props {
  cupones: ICuponesPaginados;
}

export default function CuponesTable({ cupones }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const actualizarUrl = (cambios: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(cambios).forEach(([k, v]) => (v ? params.set(k, v) : params.delete(k)));
    if (!('page' in cambios)) params.set('page', '1');
    router.push(`${pathname}?${params.toString()}`);
  };

  const ejecutar = (fn: () => Promise<{ success: boolean; message?: string }>) => {
    startTransition(async () => {
      const res = await fn();
      if (res.success) {
        toast.success(res.message ?? 'Operación realizada');
        router.refresh();
      } else {
        toast.error(res.message ?? 'No se pudo completar la operación');
      }
    });
  };

  const accionesDe = (c: ICupon): ActionItem[] => [
    { label: 'Editar', icon: Pencil, onClick: () => router.push(`/admin/cupones/${c._id}`) },
    {
      label: c.activo ? 'Desactivar' : 'Activar',
      icon: Power,
      onClick: () => ejecutar(() => cambiarEstadoCuponAction(c._id)),
    },
    {
      label: 'Eliminar',
      icon: Trash2,
      variant: 'destructive',
      onClick: () => {
        if (window.confirm(`¿Eliminar el cupón ${c.codigo}? Esta acción no se puede deshacer.`)) {
          ejecutar(() => eliminarCuponAction(c._id));
        }
      },
    },
  ];

  const { data, pagination } = cupones;

  return (
    <div className={`flex flex-col ${pending ? 'opacity-70' : ''}`}>
      {/* Filtros */}
      <div className="flex flex-wrap items-center gap-2 border-b border-zinc-200/80 bg-white p-2.5">
        <AdminInput
          defaultValue={searchParams.get('search') ?? ''}
          placeholder="Buscar por código…"
          className="h-8 w-56"
          onKeyDown={(e) => {
            if (e.key === 'Enter') actualizarUrl({ search: e.currentTarget.value.trim() || null });
          }}
        />
        <AdminSelect
          value={searchParams.get('estado') ?? ''}
          onChange={(e) => actualizarUrl({ estado: e.target.value || null })}
          className="h-8 w-40"
        >
          <option value="">Estado: todos</option>
          <option value="activo">Activos</option>
          <option value="inactivo">Inactivos</option>
        </AdminSelect>
      </div>

      <AdminTable className="min-w-[960px]">
        <AdminTableHead>
          <tr>
            <AdminTableHeaderCell width="160px">Código</AdminTableHeaderCell>
            <AdminTableHeaderCell width="110px" align="right">Descuento</AdminTableHeaderCell>
            <AdminTableHeaderCell width="170px">Alcance</AdminTableHeaderCell>
            <AdminTableHeaderCell width="110px" align="right">Monto mínimo</AdminTableHeaderCell>
            <AdminTableHeaderCell width="130px" align="center">Usos</AdminTableHeaderCell>
            <AdminTableHeaderCell width="200px">Vigencia</AdminTableHeaderCell>
            <AdminTableHeaderCell width="100px" align="center">Estado</AdminTableHeaderCell>
            <AdminTableHeaderCell width="60px" align="right">Acciones</AdminTableHeaderCell>
          </tr>
        </AdminTableHead>

        <tbody className="divide-y divide-zinc-100 bg-white">
          {data.length === 0 ? (
            <AdminTableEmpty
              title="No hay cupones"
              description="Crea el primero con el botón «Nuevo cupón»."
              colSpan={8}
            />
          ) : (
            data.map((c) => (
              <tr key={c._id} className="text-xs transition-colors hover:bg-zinc-50/60">
                <AdminTableCell>
                  <Link href={`/admin/cupones/${c._id}`} className="font-mono font-semibold text-zinc-900 hover:text-blue-600">
                    {c.codigo}
                  </Link>
                  {c.descripcion && <p className="mt-0.5 truncate text-[11px] text-zinc-500">{c.descripcion}</p>}
                </AdminTableCell>
                <AdminTableCell align="right" bold className="text-zinc-950">
                  {formatearValor(c)}
                </AdminTableCell>
                <AdminTableCell className="text-zinc-600">{etiquetaAlcance(c)}</AdminTableCell>
                <AdminTableCell align="right" className="text-zinc-600">
                  {c.montoMinimo > 0 ? `S/ ${c.montoMinimo.toFixed(2)}` : '—'}
                </AdminTableCell>
                <AdminTableCell align="center" className="text-zinc-700">
                  {c.usos ?? 0}
                  {c.usosMaximos ? ` / ${c.usosMaximos}` : ''}
                  {c.usosPorCliente ? (
                    <span className="block text-[10px] text-zinc-400">{c.usosPorCliente} por cliente</span>
                  ) : null}
                </AdminTableCell>
                <AdminTableCell className="text-zinc-600">{vigencia(c)}</AdminTableCell>
                <AdminTableCell align="center">
                  <span
                    className={`inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-medium text-white ${
                      c.activo ? 'bg-emerald-600' : 'bg-zinc-500'
                    }`}
                  >
                    {c.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </AdminTableCell>
                <AdminTableCell align="right">
                  <AdminTableActions actions={accionesDe(c)} label={`Acciones del cupón ${c.codigo}`} />
                </AdminTableCell>
              </tr>
            ))
          )}
        </tbody>
      </AdminTable>

      <AdminTablePagination
        currentPage={pagination.page}
        totalPages={Math.max(1, pagination.totalPages)}
        pageSize={pagination.limit}
        totalItems={pagination.total}
        onPageChange={(page) => actualizarUrl({ page: String(page) })}
        onPageSizeChange={(limit) => actualizarUrl({ limit: String(limit) })}
      />
    </div>
  );
}
