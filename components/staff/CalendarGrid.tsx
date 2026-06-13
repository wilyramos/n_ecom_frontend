// File: frontend/components/staff/attendance/CalendarGrid.tsx

import { isSameDay } from '@/lib/utils';
import type { Attendance } from '@/src/schemas/attendance.schema';

const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'] as const;

interface CalendarGridProps {
    history: Attendance[];
    currentTime: Date;
}

export function CalendarGrid({ history, currentTime }: CalendarGridProps) {
    const year  = currentTime.getFullYear();
    const month = currentTime.getMonth();
    const today = new Date();

    const daysOfMonth = Array.from(
        { length: new Date(year, month + 1, 0).getDate() },
        (_, i) => new Date(year, month, i + 1)
    );

    const firstDayOfWeek = daysOfMonth[0].getDay();

    return (
        <div className="bg-white rounded-2xl  border border-neutral-200/60 p-6 flex-1">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-100 pb-3">
                <h2 className="text-sm font-bold text-neutral-800">Panel Mensual</h2>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono">
                    {currentTime.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-bold text-neutral-400 mb-2 uppercase tracking-wide">
                {WEEK_DAYS.map(d => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {daysOfMonth.map((day) => {
                    const isToday     = isSameDay(day, today);
                    const record      = history.find(h => isSameDay(h.date, day));
                    const hasCheckIn  = !!record?.checkIn;
                    const hasCheckOut = !!record?.checkOut;

                    let cell = "bg-neutral-50 text-neutral-500";
                    if (hasCheckIn && hasCheckOut) {
                        cell = "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold";
                    } else if (hasCheckIn) {
                        cell = "bg-amber-50 text-amber-800 border border-amber-200 font-semibold";
                    } else if (isToday) {
                        cell = "bg-neutral-900 text-white font-black ring-2 ring-offset-1 ring-neutral-900";
                    }

                    return (
                        <div
                            key={day.toISOString()}
                            className={`aspect-square flex flex-col items-center justify-between p-1.5 rounded-lg text-xs transition-colors ${cell}`}
                        >
                            <span className="font-mono self-start text-[10px]">
                                {day.getDate()}
                            </span>
                            {record && (
                                <span className="text-[8px] font-mono opacity-70 leading-none">
                                    {record.workHours ? `${record.workHours}h` : '·'}
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}