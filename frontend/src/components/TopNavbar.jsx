import React from 'react';
import { useAuth } from '../auth/AuthContext';

export default function TopNavbar() {
  const { user, logout } = useAuth();
  
  if (!user) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold uppercase ring-1 ring-indigo-500/50 shadow-inner">
          {user.name ? user.name.charAt(0) : user.email?.charAt(0) || 'U'}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-slate-200 leading-tight">
            {user.name || user.email || 'User'}
          </p>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none mt-1">
            {user.role} Module
          </p>
        </div>
      </div>
      
      <div className="flex items-center gap-5">
        <button className="relative text-slate-400 hover:text-white transition-colors" title="Notifications">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-0 right-0.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-slate-900 shadow-sm border border-red-400"></span>
        </button>
        
        <div className="h-6 w-px bg-slate-800 mx-1"></div>
        
        <button 
          onClick={logout}
          className="text-sm font-bold text-slate-400 hover:text-white transition-colors flex flex-row items-center gap-1.5"
          title="Logout"
        >
          Logout
          <svg className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </header>
  );
}
