// File: frontend/components/staff/attendance/CheckInBanner.tsx

import { formatTime } from '@/lib/utils';


interface CheckInBannerProps {
    timestamp: Date | string;
}

export function CheckInBanner({ timestamp }: CheckInBannerProps) {
    return (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
            <p className="text-xs font-bold text-emerald-900">Entrada registrada</p>
            <p className="text-[11px] font-mono text-neutral-500 mt-0.5">
                {formatTime(timestamp)} hrs
            </p>
        </div>
    );
}