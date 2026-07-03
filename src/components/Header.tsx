/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, Bell, Sun, Moon, Search, ChevronDown, User, 
  Settings, LogOut, Shield, HeartPulse, Check 
} from 'lucide-react';
import { PageId, Doctor, Theme, Notification } from '../types';

interface HeaderProps {
  currentPageId: PageId;
  onPageChange: (id: PageId) => void;
  doctor: Doctor;
  setDoctor: Dispatch<SetStateAction<Doctor>>;
  theme: Theme;
  onThemeToggle: () => void;
  onSignOut: () => void;
  onNotificationToggle: () => void;
  notifications: Notification[];
  onMenuToggle: () => void;
}

export default function Header({
  currentPageId,
  onPageChange,
  doctor,
  setDoctor,
  theme,
  onThemeToggle,
  onSignOut,
  onNotificationToggle,
  notifications,
  onMenuToggle
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Derive human readable page titles
  const pageTitles: Record<PageId, string> = {
    dashboard: 'Clinician Dashboard',
    consultation: 'AI Consultation Workspace',
    patients: 'Patient Registry',
    lifeqr: 'Emergency LifeQR Ledger',
    appointments: 'Consultation Schedulers',
    analytics: 'Clinical Intelligence Panel',
    profile: 'My Profile',
    settings: 'System Preferences'
  };

  const handleUpdateAvailability = (status: Doctor['availability']) => {
    setDoctor(prev => ({ ...prev, availability: status }));
    setDropdownOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 px-4 md:px-6 flex items-center justify-between font-sans">
      
      {/* Left Area: Mobile Menu trigger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-xl transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Breadcrumb Trail */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <span>DOCO Portal</span>
          <span>/</span>
          <span className="text-slate-800 dark:text-slate-200 font-bold">{pageTitles[currentPageId]}</span>
        </div>
      </div>

      {/* Right Area: Search, Theme, Alerts, Doctor profile */}
      <div className="flex items-center gap-2.5 md:gap-4 flex-1 justify-end">
        
        {/* Global Search box indicator */}
        <div className="relative hidden md:block max-w-md w-full max-w-[340px]">
          <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4 text-slate-450 dark:text-slate-500" />
          </div>
          <input
            type="text"
            readOnly
            placeholder="Search patients, LifeQR, medications..."
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full py-2.5 pl-11 pr-4 text-xs text-slate-650 placeholder-slate-400 dark:placeholder-slate-500 cursor-not-allowed outline-none select-none transition-all shadow-sm focus:border-[#00a8cc] focus:ring-1 focus:ring-[#00a8cc]"
          />
        </div>

        {/* Notifications Alert Bell */}
        <button
          onClick={onNotificationToggle}
          className="p-2.5 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 rounded-full transition-all relative"
          title="Notification Pager"
        >
          <Bell className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>

        {/* Doctor Profile Dropdown container */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-all"
          >
            {/* Live border ring based on presence status */}
            <div className="relative">
              <img
                src={doctor.avatar}
                alt={doctor.name}
                className={`w-8 h-8 rounded-full object-cover ring-2 ${
                  doctor.availability === 'available'
                    ? 'ring-emerald-500'
                    : doctor.availability === 'busy'
                    ? 'ring-rose-500'
                    : doctor.availability === 'away'
                    ? 'ring-amber-500'
                    : 'ring-slate-500'
                }`}
              />
              <span className={`absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white dark:border-slate-950 ${
                doctor.availability === 'available'
                  ? 'bg-emerald-500'
                  : doctor.availability === 'busy'
                  ? 'bg-rose-500'
                  : doctor.availability === 'away'
                  ? 'bg-amber-500'
                  : 'bg-slate-500'
              }`} />
            </div>
            
            <div className="text-left hidden md:block">
              <h4 className="text-[11px] font-extrabold text-slate-900 dark:text-white leading-none truncate">Dr. S. Chen</h4>
              <p className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase mt-0.5 tracking-wider truncate">Cardiology</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden md:block shrink-0" />
          </button>

          {/* Interactive dropdown popover menu */}
          <AnimatePresence>
            {dropdownOpen && (
              <>
                <div onClick={() => setDropdownOpen(false)} className="fixed inset-0 z-10" />
                
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-2 z-20 text-xs text-slate-700 dark:text-slate-300 overflow-hidden font-sans"
                >
                  {/* Account detail Header */}
                  <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Clinician Account</span>
                    <strong className="text-slate-900 dark:text-white block mt-0.5 truncate">{doctor.name}</strong>
                    <span className="text-[10px] text-slate-500 block truncate">{doctor.email}</span>
                  </div>

                  {/* Presence switcher */}
                  <div className="p-2 border-b border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="px-2 pb-1 text-[9px] font-extrabold text-slate-400 block uppercase tracking-widest">Presence Switchboard</span>
                    
                    {[
                      { status: 'available', label: 'Available', dotColor: 'bg-emerald-500' },
                      { status: 'busy', label: 'In Surgery / Busy', dotColor: 'bg-rose-500' },
                      { status: 'away', label: 'Away / Break', dotColor: 'bg-amber-500' },
                      { status: 'offline', label: 'Off Duty', dotColor: 'bg-slate-500' }
                    ].map((item) => (
                      <button
                        key={item.status}
                        onClick={() => handleUpdateAvailability(item.status as any)}
                        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-semibold text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${item.dotColor}`} />
                          <span>{item.label}</span>
                        </div>
                        {doctor.availability === item.status && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </button>
                    ))}
                  </div>

                  {/* Quick Page Links */}
                  <div className="p-1 border-b border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => { onPageChange('profile'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-semibold"
                    >
                      <User className="w-4 h-4 text-slate-400" /> View Profile
                    </button>
                    <button
                      onClick={() => { onPageChange('settings'); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-left font-semibold"
                    >
                      <Settings className="w-4 h-4 text-slate-400" /> Settings
                    </button>
                  </div>

                  {/* Sign Out option */}
                  <div className="p-1">
                    <button
                      onClick={() => { onSignOut(); setDropdownOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-500/10 hover:text-rose-500 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4 text-rose-500/80" /> Secure Logout
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}
