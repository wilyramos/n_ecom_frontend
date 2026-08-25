'use client';

export default function PowerpayCheckoutWidget({ total }: { total: number }) {
  const clientId = process.env.NEXT_PUBLIC_POWERPAY_CLIENT_ID;
  if (!clientId || total <= 0) return null;

  return (
    <div className="mt-2 border border-[var(--color-border-default)] rounded-2xl p-3 bg-[var(--color-surface-primary)]">
      <mo-checkout product-price={total.toFixed(2)} mo-client-id={clientId}></mo-checkout>
    </div>
  );
}