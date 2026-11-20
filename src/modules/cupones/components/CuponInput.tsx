// File: frontend/src/modules/cupones/components/CuponInput.tsx

'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Ticket, X, Loader2 } from 'lucide-react';
import { useCartStore } from '@/src/store/cartStore';
import { useCuponStore } from '../store/useCuponStore';
import { validarCuponAction } from '../actions/cupones.actions';

/** Ítems del carrito en el formato que valida el servidor */
function itemsDelCarrito(cart: ReturnType<typeof useCartStore.getState>['cart']) {
  return cart.map((item) => ({
    productId: item._id,
    quantity: item.cantidad,
    price: item.variant?.precio ?? item.precio ?? 0,
  }));
}

export default function CuponInput() {
  const cart = useCartStore((s) => s.cart);
  const { cupon, aplicar, quitar } = useCuponStore();
  const [codigo, setCodigo] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firma del carrito: cambia cuando se agregan, quitan o modifican productos
  const firmaCarrito = JSON.stringify(itemsDelCarrito(cart));

  // Si el carrito cambia con un cupón aplicado, se vuelve a validar contra el servidor
  useEffect(() => {
    if (!cupon) return;
    let cancelado = false;
    (async () => {
      const res = await validarCuponAction({ codigo: cupon.codigo, items: JSON.parse(firmaCarrito) });
      if (cancelado) return;
      if (res.success && res.data) {
        aplicar(res.data);
      } else {
        quitar();
        setError(res.message ?? 'El cupón ya no es válido para tu carrito');
        toast.error(res.message ?? 'El cupón ya no es válido para tu carrito');
      }
    })();
    return () => {
      cancelado = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firmaCarrito]);

  const handleAplicar = async () => {
    const limpio = codigo.trim();
    if (!limpio) {
      setError('Ingresa un código de cupón');
      return;
    }
    setCargando(true);
    setError(null);
    const res = await validarCuponAction({ codigo: limpio, items: JSON.parse(firmaCarrito) });
    setCargando(false);

    if (res.success && res.data) {
      aplicar(res.data);
      setCodigo('');
      toast.success(`Cupón ${res.data.codigo} aplicado`);
    } else {
      setError(res.message ?? 'El cupón no es válido');
    }
  };

  const handleQuitar = () => {
    quitar();
    setError(null);
  };

  if (cupon) {
    return (
      <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Ticket className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
          <span className="font-semibold text-emerald-900 truncate">{cupon.codigo}</span>
          <span className="text-emerald-700">aplicado</span>
        </div>
        <button
          type="button"
          onClick={handleQuitar}
          aria-label="Quitar cupón"
          className="text-emerald-700 hover:text-emerald-900"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex gap-2">
        <input
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleAplicar();
            }
          }}
          placeholder="Código de cupón"
          aria-label="Código de cupón"
          maxLength={30}
          className="flex-1 h-9 rounded-lg border border-neutral-200 bg-white px-3 text-xs uppercase outline-none focus:border-neutral-400"
        />
        <button
          type="button"
          onClick={handleAplicar}
          disabled={cargando || !codigo.trim()}
          className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neutral-900 px-3 text-xs font-medium text-white hover:bg-neutral-800 disabled:opacity-50"
        >
          {cargando && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
          Aplicar
        </button>
      </div>
      {error && <p className="text-[11px] text-rose-600">{error}</p>}
    </div>
  );
}
