// File: frontend/components/staff/attendance/ClockDisplay.tsx
'use client';

import { useState, useEffect } from 'react';

export function ClockDisplay() {
    const [mounted, setMounted] = useState(false);
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        setMounted(true);
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const dateLabel = mounted
        ? time.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })
        : '\u00A0'; // non-breaking space para reservar altura sin causar mismatch

    const timeLabel = mounted
        ? time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : '--:--:--';

    return (
        <div className="bg-neutral-50 rounded-xl p-5 text-center border border-neutral-200/80 space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 min-h-[1rem]">
                {dateLabel}
            </p>
            <p className="text-4xl font-mono font-black text-neutral-900 tabular-nums">
                {timeLabel}
            </p>
        </div>
    );
}