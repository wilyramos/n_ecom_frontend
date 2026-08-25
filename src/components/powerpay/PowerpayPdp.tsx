//File: frontend/src/components/powerpay/PowerpayPdp.tsx

'use client';

export default function PowerpayPdp({ price }: { price: number }) {
  const clientId = process.env.NEXT_PUBLIC_POWERPAY_CLIENT_ID;
  if (!clientId || price <= 0) return null;
  return (
    <div className="my-2">
      <mo-product-page product-price={price.toFixed(2)} mo-client-id={clientId}></mo-product-page>
    </div>
  );
}