// File: frontend/components/staff/AttendanceForm.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ClockDisplay }  from './ClockDisplay';
import { CheckInBanner } from './CheckInBanner';
import { SummaryCard }   from './SummaryCard';
import { CalendarGrid }  from './CalendarGrid';
import { CheckInDialog } from './CheckInDialog';
import { CheckOutDialog } from './CheckOutDialog';
import { checkInAction, checkOutAction } from '@/actions/attendance-actions';
import { isSameDay } from '@/lib/utils';
import type { Attendance } from '@/src/schemas/attendance.schema';

// ─── TIPOS ────────────────────────────────────────────────────────────────────

interface AttendanceFormProps {
    initialRecord: Attendance | null;
    historyRecords: Attendance[];
}

// ─── COMPONENTE PRINCIPAL ─────────────────────────────────────────────────────

export default function AttendanceForm({ initialRecord, historyRecords }: AttendanceFormProps) {
    const [todayRecord, setTodayRecord] = useState<Attendance | null>(initialRecord);
    const [history, setHistory]         = useState<Attendance[]>(historyRecords);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [checkInOpen, setCheckInOpen]   = useState(false);
    const [checkOutOpen, setCheckOutOpen] = useState(false);
    const [isPending, startTransition]    = useTransition();

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleCheckIn = () => {
        startTransition(async () => {
            const result = await checkInAction();
            if (result.ok && result.data) {
                setTodayRecord(result.data);
                setHistory(prev => [result.data!, ...prev.filter(h => !isSameDay(h.date, new Date()))]);
                toast.success('Entrada registrada.');
            } else {
                toast.error(result.error ?? 'Error al registrar entrada.');
            }
            setCheckInOpen(false);
        });
    };

    const handleCheckOut = () => {
        startTransition(async () => {
            const result = await checkOutAction();
            if (result.ok && result.data) {
                setTodayRecord(result.data);
                setHistory(prev => prev.map(h => isSameDay(h.date, new Date()) ? result.data! : h));
                toast.success('Salida registrada.');
            } else {
                toast.error(result.error ?? 'Error al registrar salida.');
            }
            setCheckOutOpen(false);
        });
    };

    const hasCheckedIn  = !!todayRecord?.checkIn;
    const hasCheckedOut = !!todayRecord?.checkOut?.timestamp;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 items-start w-full">

                {/* PANEL IZQUIERDO */}
                <div className="bg-white rounded-2xl  border border-neutral-200/60 p-6 space-y-5">
                    <ClockDisplay 

                    />

                    <div className="space-y-3">
                        {!hasCheckedIn && (
                            <Button
                                onClick={() => setCheckInOpen(true)}
                                disabled={isPending}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
                            >
                                Marcar Entrada
                            </Button>
                        )}

                        {hasCheckedIn && !hasCheckedOut && (
                            <>
                                <CheckInBanner timestamp={todayRecord!.checkIn.timestamp} />
                                <Button
                                    onClick={() => setCheckOutOpen(true)}
                                    disabled={isPending}
                                    variant="destructive"
                                    className="w-full"
                                >
                                    Marcar Salida
                                </Button>
                            </>
                        )}

                        {hasCheckedOut && (
                            <SummaryCard
                                record={todayRecord as Attendance & { checkOut: NonNullable<Attendance['checkOut']> }}
                            />
                        )}
                    </div>
                </div>

                {/* PANEL DERECHO */}
                <CalendarGrid history={history} currentTime={currentTime} />
            </div>

            <CheckInDialog
                open={checkInOpen}
                isPending={isPending}
                onOpenChange={setCheckInOpen}
                onConfirm={handleCheckIn}
            />

            <CheckOutDialog
                open={checkOutOpen}
                isPending={isPending}
                onOpenChange={setCheckOutOpen}
                onConfirm={handleCheckOut}
            />
        </>
    );
}