'use client';

import React from "react";

export default function PowerpayHeader() {
    const clientId = process.env.NEXT_PUBLIC_POWERPAY_CLIENT_ID;
    if (!clientId) return null;
    return <mo-header mo-client-id={clientId}></mo-header>;
}