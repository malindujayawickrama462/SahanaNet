import React, { useState, useEffect } from 'react';
import { getBusinessHours, updateBusinessHours, getCanteenStaff, getStaffTodaySchedule, updateScheduleStatus, addStaffToSchedule, removeStaffFromSchedule } from '../api/businessHoursApi';

export default function StaffManagement() {
    const [canteenId, setCanteenId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [businessHours, setBusinessHours] = useState(null);
    const [allStaff, setAllStaff] = useState([]);
    const [todayStaff, setTodayStaff] = useState([]);
    const [editingDay, setEditingDay] = useState(null);
    const [editValues, setEditValues] = useState({});

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/canteen/staff/my-canteen", {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("smartqueue_token")}` }
                });
                if (!res.ok) throw new Error("Could not find assigned canteen");
                const canteenData = await res.json();
                setCanteenId(canteenData._id);

                // Fetch all data
                const [hoursRes, allStaffRes, todayStaffRes] = await Promise.all([
                    getBusinessHours(canteenData._id),
                    getCanteenStaff(canteenData._id),
                    getStaffTodaySchedule(canteenData._id)
                ]);

                setBusinessHours(hoursRes.businessHours);
                setAllStaff(allStaffRes.staff || []);
                setTodayStaff(todayStaffRes.staff || []);
                
                // Refresh today's staff every 30 seconds
                const interval = setInterval(async () => {
                    const updated = await getStaffTodaySchedule(canteenData._id);
                    setTodayStaff(updated.staff || []);
                }, 30000);
                
                return () => clearInterval(interval);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditDay = (day) => {
        setEditingDay(day);
        setEditValues({
            isOpen: businessHours[day].isOpen,
            openTime: businessHours[day].openTime,
            closeTime: businessHours[day].closeTime
        });
    };

    const handleSaveDay = async () => {
        try {
            const updateData = { [editingDay]: editValues };
            await updateBusinessHours(canteenId, updateData);
            setBusinessHours({
                ...businessHours,
                [editingDay]: editValues
            });
            setEditingDay(null);
        } catch (err) {
            alert(err.message);
        }
    };

    const handleMarkPresent = async (scheduleId, currentStatus) => {
        try {
            const newStatus = currentStatus === 'present' ? 'scheduled' : 'present';
            await updateScheduleStatus(scheduleId, newStatus);
            
            // Update local state
            setTodayStaff(todayStaff.map(staff => 
                staff._id === scheduleId ? { ...staff, status: newStatus } : staff
            ));
        } catch (err) {
            alert(err.message);
        }
    };

    const isStaffScheduledToday = (staffMember) => {
        return todayStaff.some(s => s.staff?._id === staffMember.staff?._id);
    };

    const getTodayScheduleForStaff = (staffMember) => {
        return todayStaff.find(s => s.staff?._id === staffMember.staff?._id);
    };

    const handleToggleStaffForToday = async (staffMember) => {
        try {
            const isScheduled = isStaffScheduledToday(staffMember);
            
            if (isScheduled) {
                // Remove from today's schedule
                const schedule = getTodayScheduleForStaff(staffMember);
                if (schedule) {
                    await removeStaffFromSchedule(schedule._id);
                    setTodayStaff(todayStaff.filter(s => s._id !== schedule._id));
                }
            } else {
                // Add to today's schedule
                const today = new Date().toISOString().split('T')[0];
                const dayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
                const businessHoursForToday = businessHours[days[dayIndex]];
                
                // Map role to valid position
                const positionMap = {
                    'supervisor': 'supervisor',
                    'staff': 'counter',
                    'counter': 'counter',
                    'kitchen': 'kitchen',
                    'cashier': 'cashier'
                };
                
                const position = positionMap[staffMember.role] || 'counter';
                
                await addStaffToSchedule(canteenId, {
                    staffId: staffMember.staff?._id,
                    date: today,
                    startTime: businessHoursForToday?.openTime || '08:00',
                    endTime: businessHoursForToday?.closeTime || '18:00',
                    position: position
                });
                
                // Refresh today's staff
                const updated = await getStaffTodaySchedule(canteenId);
                setTodayStaff(updated.staff || []);
            }
        } catch (err) {
            alert(err.message);
        }
    };



    if (loading) return <div className="h-full flex items-center justify-center text-slate-400">Loading...</div>;

    if (error) return (
        <div className="p-8">
            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl">{error}</div>
        </div>
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-100">Staff Management</h1>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">Manage operating hours and staff schedules</p>
            </div>

            {/* Business Hours Section */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-950">
                <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                    <h2 className="text-lg text-slate-200 font-bold flex items-center gap-2">⏰ Operating Hours</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {days.map((day, idx) => (
                            <div key={day} className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
                                {editingDay === day ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        <p className="font-bold text-slate-200">{dayNames[idx]}</p>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={editValues.isOpen}
                                                onChange={(e) => setEditValues({ ...editValues, isOpen: e.target.checked })}
                                                className="w-4 h-4"
                                            />
                                            <span className="text-sm text-slate-400">Open</span>
                                        </div>
                                        {editValues.isOpen && (
                                            <>
                                                <div>
                                                    <label className="text-xs text-slate-400">Open Time</label>
                                                    <input
                                                        type="time"
                                                        value={editValues.openTime}
                                                        onChange={(e) => setEditValues({ ...editValues, openTime: e.target.value })}
                                                        className="w-full bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600 text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs text-slate-400">Close Time</label>
                                                    <input
                                                        type="time"
                                                        value={editValues.closeTime}
                                                        onChange={(e) => setEditValues({ ...editValues, closeTime: e.target.value })}
                                                        className="w-full bg-slate-700 text-slate-100 px-3 py-2 rounded-lg border border-slate-600 text-sm"
                                                    />
                                                </div>
                                            </>
                                        )}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={handleSaveDay}
                                                className="flex-1 bg-emerald-500/20 text-emerald-400 px-3 py-2 rounded-lg hover:bg-emerald-500/30 transition text-xs font-bold"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={() => setEditingDay(null)}
                                                className="flex-1 bg-slate-700 text-slate-300 px-3 py-2 rounded-lg hover:bg-slate-600 transition text-xs font-bold"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="space-y-2">
                                        <p className="font-bold text-slate-200">{dayNames[idx]}</p>
                                        {businessHours && businessHours[day] && (
                                            <>
                                                <p className="text-sm text-slate-400">
                                                    {businessHours[day].isOpen ? (
                                                        <span className="text-emerald-400 font-bold">
                                                            {businessHours[day].openTime} - {businessHours[day].closeTime}
                                                        </span>
                                                    ) : (
                                                        <span className="text-red-400">Closed</span>
                                                    )}
                                                </p>
                                                <button
                                                    onClick={() => handleEditDay(day)}
                                                    className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg hover:bg-blue-500/30 transition font-bold"
                                                >
                                                    ✏️ Edit
                                                </button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Today's Staff Availability */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-950">
                <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                    <h2 className="text-lg text-slate-200 font-bold flex items-center gap-2">👥 Today's Staff Availability</h2>
                </div>
                <div className="p-6">
                    {/* Availability Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
                            <p className="text-xs text-emerald-400/60 font-bold uppercase tracking-widest">Available</p>
                            <p className="text-4xl font-black text-emerald-400 mt-2">
                                {todayStaff.filter(s => ['present', 'scheduled'].includes(s.status)).length}
                            </p>
                        </div>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
                            <p className="text-xs text-blue-400/60 font-bold uppercase tracking-widest">Scheduled</p>
                            <p className="text-4xl font-black text-blue-400 mt-2">
                                {todayStaff.filter(s => s.status === 'scheduled').length}
                            </p>
                        </div>
                        <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-center">
                            <p className="text-xs text-orange-400/60 font-bold uppercase tracking-widest">Absent/Other</p>
                            <p className="text-4xl font-black text-orange-400 mt-2">
                                {todayStaff.filter(s => !['present', 'scheduled'].includes(s.status)).length}
                            </p>
                        </div>
                    </div>

                    {/* Assign Staff for Today */}
                    <div className="mb-6 p-4 bg-slate-800/40 border border-slate-700 rounded-xl">
                        <h3 className="text-sm font-bold text-slate-200 mb-4">✓ Assign Staff for Today</h3>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {allStaff.length === 0 ? (
                                <p className="text-xs text-slate-500">No staff available to assign</p>
                            ) : (
                                allStaff.map(staffMember => (
                                    <label key={staffMember._id} className="flex items-center gap-3 p-2 hover:bg-slate-700/30 rounded-lg cursor-pointer transition">
                                        <input
                                            type="checkbox"
                                            checked={isStaffScheduledToday(staffMember)}
                                            onChange={() => handleToggleStaffForToday(staffMember)}
                                            className="w-4 h-4 accent-emerald-500 cursor-pointer"
                                        />
                                        <div className="flex-1 text-sm">
                                            <p className="text-slate-200 font-medium">{staffMember.staff?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">{staffMember.role}</p>
                                        </div>
                                        {isStaffScheduledToday(staffMember) && (
                                            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded">✓ Added</span>
                                        )}
                                    </label>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Staff List */}
                    <div className="space-y-2">
                        {todayStaff.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">
                                <p className="font-medium">No staff scheduled for today</p>
                            </div>
                        ) : (
                            todayStaff.map(schedule => (
                                <div 
                                    key={schedule._id} 
                                    className={`flex items-center justify-between p-4 rounded-xl border transition ${
                                        schedule.status === 'present' 
                                            ? 'bg-emerald-500/10 border-emerald-500/20' 
                                            : schedule.status === 'scheduled'
                                            ? 'bg-slate-800/40 border-slate-700'
                                            : 'bg-red-500/10 border-red-500/20'
                                    }`}
                                >
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`w-3 h-3 rounded-full ${
                                            schedule.status === 'present' ? 'bg-emerald-400' 
                                            : schedule.status === 'scheduled' ? 'bg-blue-400'
                                            : 'bg-red-400'
                                        }`}></div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-200">{schedule.staff?.name || 'Unknown'}</p>
                                            <p className="text-xs text-slate-500">
                                                {schedule.startTime} - {schedule.endTime} • {schedule.position}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                                            schedule.status === 'present' 
                                                ? 'bg-emerald-500/20 text-emerald-400' 
                                                : schedule.status === 'scheduled'
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {schedule.status}
                                        </span>
                                        {schedule.status !== 'absent' && (
                                            <button
                                                onClick={() => handleMarkPresent(schedule._id, schedule.status)}
                                                className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                                                    schedule.status === 'present'
                                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                        : 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                                }`}
                                            >
                                                {schedule.status === 'present' ? 'Mark Scheduled' : 'Check In'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* All Staff List */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl shadow-slate-950">
                <div className="p-6 border-b border-slate-800 bg-slate-800/20">
                    <h2 className="text-lg text-slate-200 font-bold flex items-center gap-2">📋 All Assigned Staff</h2>
                </div>
                <div className="divide-y divide-slate-800">
                    {allStaff.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 font-medium">
                            No staff assigned to this canteen
                        </div>
                    ) : (
                        allStaff.map(member => (
                            <div key={member._id} className="p-4 hover:bg-slate-800/20 transition flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center border border-purple-500/20">
                                        {member.staff?.name?.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-200">{member.staff?.name || 'Unknown'}</p>
                                        <p className="text-xs text-slate-500">{member.staff?.email || 'No email'}</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300 capitalize">
                                    {member.role}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
