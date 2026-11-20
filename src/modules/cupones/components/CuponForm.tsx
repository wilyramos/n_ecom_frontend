// File: frontend/src/modules/cupones/components/CuponForm.tsx

'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2, Search, X } from 'lucide-react';
import { AdminButton } from '@/src/components/admin/layout/admin-button';
import { AdminFormGroup, AdminInput, AdminSelect } from '@/src/components/admin/layout/admin-form-group';
import { AdminCardWrapper } from '@/src/components/admin/layout/admin-card-wrapper';
import type { ICupon, ReferenciaCupon } from '../types/cupon.types';
import { cuponFormSchema, type CuponFormValues } from '../schemas/cupon.schema';
import { actualizarCuponAction, crearCuponAction } from '../actions/cupones.actions';

interface CategoriaOpcion {
  _id: string;
  nombre: string;
}

interface ProductoOpcion {
  _id: string;
  nombre: string;
  sku?: string;
}

interface Props {
  cupon?: ICupon;
  categorias: CategoriaOpcion[];
}

const TZ_LIMA = 'America/Lima';

/** ISO del backend → "YYYY-MM-DD" en hora de Lima, para el input type=date */
const isoAFecha = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString('sv-SE', { timeZone: TZ_LIMA }) : null;

/** "YYYY-MM-DD" → ISO con hora de Lima (-05:00). El fin incluye el día completo */
const fechaAIso = (fecha: string | null, fin: boolean) =>
  fecha ? `${fecha}T${fin ? '23:59:59' : '00:00:00'}-05:00` : null;

const idDe = (ref: string | ReferenciaCupon) => (typeof ref === 'string' ? ref : ref._id);

const valoresIniciales = (cupon?: ICupon): CuponFormValues => ({
  codigo: cupon?.codigo ?? '',
  descripcion: cupon?.descripcion ?? '',
  tipo: cupon?.tipo ?? 'porcentaje',
  valor: cupon?.valor ?? (NaN as number),
  montoMinimo: cupon?.montoMinimo ?? 0,
  aplicaA: cupon?.aplicaA ?? 'todos',
  categorias: cupon?.categorias.map(idDe) ?? [],
  productos: cupon?.productos.map(idDe) ?? [],
  usosMaximos: cupon?.usosMaximos ?? null,
  usosPorCliente: cupon?.usosPorCliente ?? null,
  fechaInicio: isoAFecha(cupon?.fechaInicio ?? null),
  fechaFin: isoAFecha(cupon?.fechaFin ?? null),
  activo: cupon?.activo ?? true,
});

/** Input numérico: vacío o inválido → null (para campos opcionales) */
const aNumeroOpcional = (v: number) => (Number.isNaN(v) ? null : v);

export default function CuponForm({ cupon, categorias }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<CuponFormValues>(() => valoresIniciales(cupon));
  const [productosSel, setProductosSel] = useState<ProductoOpcion[]>(
    () => (cupon?.productos ?? []).filter((p): p is ReferenciaCupon => typeof p !== 'string')
  );
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [pending, startTransition] = useTransition();

  const set = <K extends keyof CuponFormValues>(key: K, value: CuponFormValues[K]) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  const toggleId = (key: 'categorias', id: string) => {
    const actual = values[key];
    set(key, actual.includes(id) ? actual.filter((x) => x !== id) : [...actual, id]);
  };

  const guardar = () => {
    // Se validan las fechas en formato Lima antes de convertirlas (las reglas de orden se aplican sobre ISO)
    const payload: CuponFormValues = {
      ...values,
      fechaInicio: fechaAIso(values.fechaInicio, false),
      fechaFin: fechaAIso(values.fechaFin, true),
      productos: values.productos,
    };

    const parsed = cuponFormSchema.safeParse(payload);
    if (!parsed.success) {
      const mapa: Record<string, string> = {};
      parsed.error.issues.forEach((i) => {
        const campo = String(i.path[0] ?? '');
        if (campo && !mapa[campo]) mapa[campo] = i.message;
      });
      setErrores(mapa);
      toast.error(parsed.error.issues[0]?.message ?? 'Revisa los campos marcados');
      return;
    }
    setErrores({});

    startTransition(async () => {
      const res = cupon
        ? await actualizarCuponAction(cupon._id, parsed.data)
        : await crearCuponAction(parsed.data);

      if (res.success) {
        toast.success(res.message ?? 'Cupón guardado');
        router.push('/admin/cupones');
        router.refresh();
      } else {
        toast.error(res.message ?? 'No se pudo guardar el cupón');
      }
    });
  };

  const campoError = (campo: string) =>
    errores[campo] ? <p className="mt-1 text-[11px] text-rose-600">{errores[campo]}</p> : null;

  return (
    <div className="space-y-4">
      {/* Datos básicos */}
      <AdminCardWrapper className="space-y-4 p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Datos básicos</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminFormGroup label="Código">
            <AdminInput
              value={values.codigo}
              onChange={(e) => set('codigo', e.target.value.toUpperCase())}
              placeholder="VERANO25"
              maxLength={30}
              className="font-mono uppercase"
            />
            {campoError('codigo')}
          </AdminFormGroup>

          <AdminFormGroup label="Estado">
            <label className="flex h-8 items-center gap-2 text-xs text-zinc-700">
              <input
                type="checkbox"
                checked={values.activo}
                onChange={(e) => set('activo', e.target.checked)}
                className="h-4 w-4 accent-emerald-600"
              />
              Cupón activo (se puede usar en el checkout)
            </label>
          </AdminFormGroup>

          <AdminFormGroup label="Tipo de descuento">
            <AdminSelect value={values.tipo} onChange={(e) => set('tipo', e.target.value as CuponFormValues['tipo'])}>
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto">Monto fijo (S/)</option>
            </AdminSelect>
          </AdminFormGroup>

          <AdminFormGroup label={values.tipo === 'porcentaje' ? 'Porcentaje de descuento' : 'Monto de descuento (S/)'}>
            <AdminInput
              type="number"
              min={0}
              step="0.01"
              value={Number.isNaN(values.valor) ? '' : values.valor}
              onChange={(e) => set('valor', e.target.valueAsNumber)}
            />
            {campoError('valor')}
          </AdminFormGroup>

          <div className="md:col-span-2">
            <AdminFormGroup label="Descripción interna (opcional)">
              <AdminInput
                value={values.descripcion ?? ''}
                onChange={(e) => set('descripcion', e.target.value)}
                placeholder="Campaña de verano, influencers…"
                maxLength={200}
              />
            </AdminFormGroup>
          </div>
        </div>
      </AdminCardWrapper>

      {/* Condiciones */}
      <AdminCardWrapper className="space-y-4 p-4">
        <h2 className="text-sm font-semibold text-zinc-900">Condiciones de uso</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AdminFormGroup label="Compra mínima (S/)">
            <AdminInput
              type="number"
              min={0}
              step="0.01"
              value={values.montoMinimo}
              onChange={(e) => set('montoMinimo', Number.isNaN(e.target.valueAsNumber) ? 0 : e.target.valueAsNumber)}
            />
            <p className="mt-1 text-[10px] text-zinc-400">0 = sin mínimo</p>
          </AdminFormGroup>

          <AdminFormGroup label="Usos totales">
            <AdminInput
              type="number"
              min={1}
              value={values.usosMaximos ?? ''}
              placeholder="Ilimitado"
              onChange={(e) => set('usosMaximos', aNumeroOpcional(e.target.valueAsNumber))}
            />
            <p className="mt-1 text-[10px] text-zinc-400">Pedidos no cancelados</p>
          </AdminFormGroup>

          <AdminFormGroup label="Usos por cliente">
            <AdminInput
              type="number"
              min={1}
              value={values.usosPorCliente ?? ''}
              placeholder="Ilimitado"
              onChange={(e) => set('usosPorCliente', aNumeroOpcional(e.target.valueAsNumber))}
            />
            <p className="mt-1 text-[10px] text-zinc-400">Se cuenta por correo</p>
          </AdminFormGroup>

          <AdminFormGroup label="Válido desde">
            <AdminInput type="date" value={values.fechaInicio ?? ''} onChange={(e) => set('fechaInicio', e.target.value || null)} />
          </AdminFormGroup>

          <AdminFormGroup label="Válido hasta">
            <AdminInput type="date" value={values.fechaFin ?? ''} onChange={(e) => set('fechaFin', e.target.value || null)} />
            {campoError('fechaFin')}
          </AdminFormGroup>
        </div>
      </AdminCardWrapper>

      {/* Alcance */}
      <AdminCardWrapper className="space-y-4 p-4">
        <h2 className="text-sm font-semibold text-zinc-900">¿A qué productos aplica?</h2>
        <AdminSelect
          value={values.aplicaA}
          onChange={(e) => set('aplicaA', e.target.value as CuponFormValues['aplicaA'])}
          className="md:w-72"
        >
          <option value="todos">Todo el catálogo</option>
          <option value="categorias">Solo ciertas categorías</option>
          <option value="productos">Solo ciertos productos</option>
        </AdminSelect>

        {values.aplicaA === 'categorias' && (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {categorias.map((c) => (
              <label key={c._id} className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-xs text-zinc-700">
                <input
                  type="checkbox"
                  checked={values.categorias.includes(c._id)}
                  onChange={() => toggleId('categorias', c._id)}
                  className="h-4 w-4 accent-violet-600"
                />
                {c.nombre}
              </label>
            ))}
            {campoError('categorias')}
          </div>
        )}

        {values.aplicaA === 'productos' && (
          <ProductPicker
            seleccionados={productosSel}
            onAgregar={(p) => {
              if (values.productos.includes(p._id)) return;
              setProductosSel((prev) => [...prev, p]);
              set('productos', [...values.productos, p._id]);
            }}
            onQuitar={(id) => {
              setProductosSel((prev) => prev.filter((p) => p._id !== id));
              set('productos', values.productos.filter((x) => x !== id));
            }}
            error={errores.productos}
          />
        )}
      </AdminCardWrapper>

      <div className="flex justify-end gap-2">
        <AdminButton variant="outline" onClick={() => router.push('/admin/cupones')} disabled={pending}>
          Cancelar
        </AdminButton>
        <AdminButton onClick={guardar} disabled={pending}>
          {pending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          {cupon ? 'Guardar cambios' : 'Crear cupón'}
        </AdminButton>
      </div>
    </div>
  );
}

/** Buscador de productos reutilizando el endpoint de búsqueda existente */
function ProductPicker({
  seleccionados,
  onAgregar,
  onQuitar,
  error,
}: {
  seleccionados: ProductoOpcion[];
  onAgregar: (p: ProductoOpcion) => void;
  onQuitar: (id: string) => void;
  error?: string;
}) {
  const [q, setQ] = useState('');
  const [resultados, setResultados] = useState<ProductoOpcion[]>([]);
  const [buscando, setBuscando] = useState(false);

  const buscar = async () => {
    if (q.trim().length < 2) return;
    setBuscando(true);
    try {
      const res = await fetch(`/api/products/search?q=${encodeURIComponent(q.trim())}`);
      const json = await res.json();
      setResultados(Array.isArray(json) ? json.slice(0, 8) : []);
    } catch {
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="space-y-3">
      {seleccionados.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {seleccionados.map((p) => (
            <span key={p._id} className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-medium text-violet-900">
              {p.nombre}
              <button type="button" onClick={() => onQuitar(p._id)} aria-label={`Quitar ${p.nombre}`}>
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <AdminInput
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              buscar();
            }
          }}
          placeholder="Buscar producto por nombre o SKU (mín. 2 letras)…"
          className="md:w-96"
        />
        <AdminButton variant="outline" onClick={buscar} disabled={buscando}>
          {buscando ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          Buscar
        </AdminButton>
      </div>

      {resultados.length > 0 && (
        <ul className="divide-y divide-zinc-100 rounded-lg border border-zinc-200 bg-white">
          {resultados.map((p) => {
            const yaAgregado = seleccionados.some((s) => s._id === p._id);
            return (
              <li key={p._id} className="flex items-center justify-between gap-2 px-3 py-2 text-xs">
                <span className="truncate">
                  {p.nombre}
                  {p.sku && <span className="ml-2 font-mono text-zinc-400">{p.sku}</span>}
                </span>
                <AdminButton
                  size="sm"
                  variant="outline"
                  disabled={yaAgregado}
                  onClick={() => onAgregar({ _id: p._id, nombre: p.nombre, sku: p.sku })}
                >
                  {yaAgregado ? 'Agregado' : 'Agregar'}
                </AdminButton>
              </li>
            );
          })}
        </ul>
      )}

      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
