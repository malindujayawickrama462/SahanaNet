import React, { useState, useEffect } from 'react';
import { getStaffTodaySchedule } from '../api/businessHoursApi';

export default function StaffAvailabilityCard({ canteenId }) {
    const [staffCount, setStaffCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStaffCount = async () => {
            try {
                const data = await getStaffTodaySchedule(canteenId);
                // Count only available staff (present or scheduled)
                const availableStaff = data.staff?.filter(s => 
                    ['present', 'scheduled'].includes(s.status)
                ) || [];
                setStaffCount(availableStaff.length);
            } catch (err) {
                setError("Could not load staff availability");
            } finally {
                setLoading(false);
            }
        };

        fetchStaffCount();
        // Refresh every 30 seconds
        const interval = setInterval(fetchStaffCount, 30000);
        return () => clearInterval(interval);
    }, [canteenId]);

    if (loading) return (
        <div className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 animate-pulse">
            <div className="h-8 bg-slate-700 rounded w-24"></div>
        </div>
    );

    return (
        <div className={`bg-gradient-to-br rounded-lg p-4 border-2 transition-all ${
            staffCount > 0 
                ? 'from-emerald-500/20 to-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/20' 
                : 'from-red-500/20 to-red-500/10 border-red-500/30 shadow-lg shadow-red-500/20'
        }`}>
            <div className="flex flex-col items-center justify-center gap-2">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Staff Available Today</p>
                <div className={`text-4xl font-black tracking-tighter ${
                    staffCount > 0 ? 'text-emerald-400' : 'text-red-400'
                }`}>
                    {staffCount}
                </div>
                <p className="text-xs text-slate-500 font-semibold">
                    {staffCount === 1 ? 'person working' : 'people working'}
                </p>
                {staffCount === 0 && (
                    <p className="text-xs text-red-400 font-bold mt-1">⚠️ Limited service</p>
                )}
            </div>
        </div>
    );
}
