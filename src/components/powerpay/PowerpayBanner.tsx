//File: frontend/src/components/powerpay/PowerpayBanner.tsx


'use client';

export default function PowerpayBanner() {
    const clientId = process.env.NEXT_PUBLIC_POWERPAY_CLIENT_ID;
    if (!clientId) return null;
    return <mo-banner mo-client-id={clientId}></mo-banner>;
}