// File: frontend/app/staff/attendance/page.tsx

import { AttendanceService } from '@/src/services/attendance.service';
import AttendanceForm from "@/components/staff/AttendanceForm";
import type { Attendance } from "@/src/schemas/attendance.schema";

export const dynamic = "force-dynamic";

function toLocalDateKey(date: Date | string): string {
    return new Date(date).toLocaleDateString('en-CA', { timeZone: 'America/Lima' });
    // 'en-CA' produce formato YYYY-MM-DD
}

function extractTodayRecord(history: Attendance[]): Attendance | null {
    if (!history.length) return null;
    const latest = history[0];
    const todayKey = toLocalDateKey(new Date());
    const recordKey = toLocalDateKey(latest.date);
    return recordKey === todayKey ? latest : null;
}

export default async function StaffAttendancePage() {
    let todayRecord: Attendance | null = null;
    let history: Attendance[] = [];

    try {
        history     = await AttendanceService.getMyHistory(30);
        todayRecord = extractTodayRecord(history);
    } catch (error) {
        console.error('[StaffAttendancePage]', error);
    }

    return (
        <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-14">
            <div className="w-full max-w-4xl space-y-6">
                <AttendanceForm initialRecord={todayRecord} historyRecords={history} />
            </div>
        </div>
    );
}