// File: frontend/components/staff/attendance/SummaryCard.tsx

import { formatTime } from '@/lib/utils';
import type { Attendance } from '@/src/schemas/attendance.schema';

// Narrowed type: garantiza que checkOut existe antes de renderizar
type CompletedAttendance = Attendance & {
    checkOut: NonNullable<Attendance['checkOut']>;
};

interface SummaryCardProps {
    record: CompletedAttendance;
}

export function SummaryCard({ record }: SummaryCardProps) {
    return (
        <div className="bg-neutral-900 text-white rounded-xl p-5 space-y-3">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 text-center">
                Jornada Finalizada
            </p>

            <div className="grid grid-cols-2 gap-y-2 border-t border-b border-neutral-800 py-3 text-xs font-mono">
                <span className="text-neutral-400">Entrada</span>
                <span className="text-right text-neutral-200">
                    {formatTime(record.checkIn.timestamp)}
                </span>
                <span className="text-neutral-400">Salida</span>
                <span className="text-right text-neutral-200">
                    {formatTime(record.checkOut.timestamp)}
                </span>
            </div>

            <div className="flex justify-between items-center text-xs px-0.5">
                <span className="text-neutral-400">Total horas</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                    {record.workHours} hrs
                </span>
            </div>
        </div>
    );
}