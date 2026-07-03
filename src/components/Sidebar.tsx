/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { 
  Stethoscope, LayoutDashboard, Users, Calendar, 
  BarChart2, User, Settings, LogOut, ChevronLeft, Menu, Activity, QrCode
} from 'lucide-react';
import { PageId, Doctor } from '../types';

interface SidebarProps {
  currentPageId: PageId;
  onPageChange: (id: PageId) => void;
  doctor: Doctor;
  onSignOut: () => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentPageId,
  onPageChange,
  doctor,
  onSignOut,
  mobileMenuOpen,
  setMobileMenuOpen
}: SidebarProps) {

  // Menu items array
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'consultation', label: 'AI Consultation', icon: Stethoscope },
    { id: 'patients', label: 'Patient Registry', icon: Users },
    { id: 'lifeqr', label: 'Emergency LifeQR', icon: QrCode, badge: 'SOS' },
    { id: 'appointments', label: 'Schedulers', icon: Calendar },
    { id: 'analytics', label: 'Intelligence Panel', icon: BarChart2 },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'System Preferences', icon: Settings }
  ] as const;

  const handleItemClick = (id: PageId) => {
    onPageChange(id);
    setMobileMenuOpen(false); // Close mobile drawer
  };

  return (
    <>
      {/* Mobile Drawer Backdrop overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Main Frame */}
      <aside
        id="sidebar-frame"
        className={`fixed md:sticky top-0 left-0 h-screen z-40 w-64 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 border-r border-slate-200 dark:border-slate-900 flex flex-col justify-between transition-transform duration-300 transform md:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1">
          {/* Logo Brand Header */}
          <div className="h-20 px-6 border-b border-slate-100 dark:border-slate-900/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#00a8cc] rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-[#00a8cc]/20">
                <Activity className="w-5.5 h-5.5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-black tracking-wider text-slate-900 dark:text-white leading-none">
                  DOCO
                </span>
                <span className="text-[8px] font-black tracking-[0.18em] text-slate-400 dark:text-slate-500 uppercase mt-1 leading-none">
                  HEALTH CLOUD
                </span>
              </div>
            </div>
            
            {/* Collapse toggle (only visible on mobile drawer) */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="md:hidden p-1 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-400 hover:text-slate-100 rounded-lg transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
            <span className="px-3.5 pb-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Main Navigation</span>
            
            {menuItems.map((item) => {
              const isActive = currentPageId === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all relative group select-none ${
                    isActive
                      ? 'bg-[#00a8cc] text-white shadow-md shadow-[#00a8cc]/15'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900/40 hover:text-slate-900 dark:hover:text-slate-100'
                  }`}
                >
                  <item.icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'}`} />
                  <span>{item.label}</span>
                  {'badge' in item && item.badge && (
                    <span className={`ml-auto font-extrabold text-[9px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white text-[#00a8cc]' : 'bg-rose-600 dark:bg-rose-500 text-white animate-pulse'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Doctor Identity Block at bottom */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-950/80">
          <div className="p-3 rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-900 flex items-center justify-between gap-2.5 shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800"
                />
                {/* Availability blinker status ring */}
                <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white dark:border-slate-950 ${
                  doctor.availability === 'available'
                    ? 'bg-emerald-500'
                    : doctor.availability === 'busy'
                    ? 'bg-rose-500 animate-pulse'
                    : doctor.availability === 'away'
                    ? 'bg-amber-500'
                    : 'bg-slate-500'
                }`} />
              </div>
              <div className="min-w-0">
                <h4 className="text-[11px] font-extrabold text-slate-800 dark:text-white truncate leading-none">{doctor.name.split(',')[0]}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5 truncate uppercase tracking-wide">{doctor.specialty.split(' ')[0]}</p>
              </div>
            </div>
            
            {/* Logout action */}
            <button
              onClick={onSignOut}
              className="p-1.5 hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-lg transition-colors shrink-0"
              title="Secure Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 text-center text-[10px] text-slate-400 dark:text-slate-600 font-mono">
            <span>HIPAA Ledger Verified</span>
          </div>
        </div>
      </aside>
    </>
  );
}
