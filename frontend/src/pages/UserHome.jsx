import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { Card } from '../components/Card';
import { getStudentOrders } from '../api/orderApi';

export default function UserHome() {
  const nav = useNavigate();
  const { user, logout } = useAuth();
  const [activeOrder, setActiveOrder] = useState(null);
  const [arrivalStatus, setArrivalStatus] = useState({ state: 'none', message: '' });

  useEffect(() => {
    if (user?.role === 'student' || user?.role === 'user') {
      const fetchOrder = async () => {
        try {
          const data = await getStudentOrders();
          const active = data.orders.find(o => ['Pending', 'Preparing', 'Ready'].includes(o.status));
          if (active) {
            setActiveOrder(active);
            updateArrivalStatus(active);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchOrder();
      const interval = setInterval(fetchOrder, 15000); // Poll every 15s
      return () => clearInterval(interval);
    }
  }, [user]);

  const updateArrivalStatus = (order) => {
    const now = new Date();
    const [startH, startM] = order.timeSlot.startTime.split(':').map(Number);
    const [endH, endM] = order.timeSlot.endTime.split(':').map(Number);

    const startTime = new Date();
    startTime.setHours(startH, startM, 0);

    const endTime = new Date();
    endTime.setHours(endH, endM, 0);

    if (order.status === 'Ready') {
      setArrivalStatus({ state: 'ready', message: 'Order Ready! Please collect from counter.' });
    } else if (now < startTime) {
      setArrivalStatus({ state: 'early', message: `Too Early - Please arrive at ${order.timeSlot.startTime}` });
    } else if (now >= startTime && now <= endTime) {
      setArrivalStatus({ state: 'on-time', message: 'Come Now - Pickup Window Open' });
    } else {
      setArrivalStatus({ state: 'late', message: 'Window Missed - You are in the Late Queue.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center px-4 relative overflow-hidden py-10">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-[35rem] h-[35rem] bg-emerald-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-sky-500/10 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-8 relative z-10">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 shadow-xl shadow-emerald-500/20 mb-2">
            <svg className="w-8 h-8 text-white drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 drop-shadow-sm">
            Welcome, {user?.name?.split(' ')[0] || 'User'}
          </h1>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-widest">{user?.role || 'user'}</span>
          </div>
        </div>

        {/* ACTIVE TOKEN SECTION */}
        {activeOrder && (
          <div className="relative group animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-20 transition-all duration-500 ${arrivalStatus.state === 'ready' ? 'bg-emerald-500' :
              arrivalStatus.state === 'on-time' ? 'bg-blue-500' : 'bg-amber-500'
              }`}></div>
            <Card title={activeOrder.orderID} subtitle={`Pickup: ${activeOrder.timeSlot.startTime} - ${activeOrder.timeSlot.endTime}`}>
              <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className={`w-3 h-3 rounded-full animate-pulse ${arrivalStatus.state === 'ready' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' :
                  arrivalStatus.state === 'on-time' ? 'bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.8)]' : 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.8)]'
                  }`} />
                <div>
                  <p className={`text-lg font-black tracking-tight ${arrivalStatus.state === 'ready' ? 'text-emerald-400' :
                    arrivalStatus.state === 'on-time' ? 'text-blue-400' : 'text-amber-400'
                    }`}>{arrivalStatus.message}</p>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Arrival Control System</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          <Card
            title=""
            subtitle=""
            footer={
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
                <button
                  className="w-full sm:w-auto text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors flex items-center justify-center gap-1.5"
                  onClick={() => nav('/profile')}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  Profile
                </button>
                <button
                  className="w-full sm:w-auto text-xs font-semibold text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center gap-1.5"
                  onClick={logout}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Sign Out
                </button>
              </div>
            }
          >
            {/* Main Action Buttons based on role */}
            <div className="space-y-4">
              {(user?.role === 'student' || user?.role === 'user') && (
                <>
                  <button
                    onClick={() => nav('/canteens')}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 hover:shadow-xl hover:shadow-emerald-500/20 transition-all font-black uppercase text-sm tracking-tighter"
                  >
                    <span>Browse Canteens & Order</span>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </button>
                  <button
                    onClick={() => nav('/invoices')}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all font-black uppercase text-sm tracking-tighter"
                  >
                    <span>View My Past Invoices</span>
                    <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </button>
                </>
              )}

              {user?.role === 'staff' && (
                <button
                  onClick={() => nav('/kitchen')}
                  className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white hover:shadow-xl hover:shadow-sky-500/20 transition-all font-black uppercase text-sm tracking-tighter"
                >
                  <span>Kitchen Dashboard</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              )}

              {user?.role === 'admin' && (
                <button
                  onClick={() => nav('/admin')}
                  className="w-full flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-100 text-slate-950 hover:bg-white transition-all font-black uppercase text-sm tracking-tighter shadow-lg"
                >
                  <span>Admin Control Panel</span>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

