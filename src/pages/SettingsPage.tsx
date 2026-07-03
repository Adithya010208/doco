/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Bell, Shield, Database, RefreshCw, 
  Moon, Sun, Check, Volume2, CloudLightning, KeyRound 
} from 'lucide-react';
import { Theme } from '../types';

interface SettingsPageProps {
  theme: Theme;
  onThemeToggle: () => void;
  onResetDemoData: () => void;
}

export default function SettingsPage({
  theme,
  onThemeToggle,
  onResetDemoData
}: SettingsPageProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [criticalSms, setCriticalSms] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [syncFrequency, setSyncFrequency] = useState('1hr');
  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const handleResetClick = () => {
    onResetDemoData();
    setShowResetSuccess(true);
    setTimeout(() => {
      setShowResetSuccess(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Page Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Preferences</h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs">Configure portal notification engines, medical database synchronization, and local sandbox settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation / Topics left-hand column */}
        <div className="md:col-span-1 space-y-2">
          {[
            { id: 'notif', label: 'Clinical Alerts', icon: Bell },
            { id: 'sync', label: 'EMR Cloud Sync', icon: Database },
            { id: 'security', label: 'Theme & Styling', icon: Sun }
          ].map((topic) => (
            <div
              key={topic.id}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-800/40"
            >
              <topic.icon className="w-4 h-4 text-blue-600" />
              <span>{topic.label}</span>
            </div>
          ))}

          {/* Quick Support Badge */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-4 rounded-3xl border border-slate-800 text-white mt-6">
            <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest block mb-1">Clinic Service Desk</span>
            <h4 className="text-xs font-bold">Need assistance?</h4>
            <p className="text-[10px] text-slate-400 leading-relaxed mt-1">
              For any hardware pairing issues, pager errors, or EMR credential blocks, contact the local system administrator.
            </p>
            <span className="text-[10px] text-blue-400 hover:underline cursor-pointer font-bold block mt-3">Open Ticket #1024</span>
          </div>
        </div>

        {/* Detailed Options form - Right Columns */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Notification Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Bell className="w-4 h-4 text-blue-600" /> Clinical Alert Channels
            </h3>

            <div className="space-y-4 text-xs">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-blue-600 focus:ring-0 w-4.5 h-4.5 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Email Dispatch Reports</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">Receive hourly digests regarding new diagnostic files and finished lab panels.</span>
                </div>
              </label>

              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={criticalSms}
                  onChange={(e) => setCriticalSms(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-blue-600 focus:ring-0 w-4.5 h-4.5 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Critical Pager Alerts</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">Receive immediate SMS/pager warnings if a patient watch status triggers Critical warnings.</span>
                </div>
              </label>
            </div>
          </div>

          {/* Database & Sync Settings */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Database className="w-4 h-4 text-blue-600" /> Cloud EHR Sync Configuration
            </h3>

            <div className="space-y-4 text-xs">
              <label className="flex items-start gap-3.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={autoSync}
                  onChange={(e) => setAutoSync(e.target.checked)}
                  className="rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-blue-600 focus:ring-0 w-4.5 h-4.5 mt-0.5"
                />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">Automated HL7 Cloud Syncing</span>
                  <span className="text-slate-500 block text-[11px] mt-0.5">Enable secure background transactions with the national EMR/EHR system.</span>
                </div>
              </label>

              {autoSync && (
                <div className="pl-8 space-y-1.5">
                  <label htmlFor="sync-freq" className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">Sync Frequency</label>
                  <select
                    id="sync-freq"
                    value={syncFrequency}
                    onChange={(e) => setSyncFrequency(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-0"
                  >
                    <option value="15m">Every 15 Minutes (Near Real-time)</option>
                    <option value="1hr">Every Hour (Recommended)</option>
                    <option value="12hr">Twice Daily</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Theme switcher */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Sun className="w-4 h-4 text-[#00a8cc]" /> Theme Mode Preset
            </h3>

            <div className="flex gap-4">
              <div className="flex-1 py-3 px-4 rounded-2xl border border-[#00a8cc] bg-cyan-500/10 text-xs font-bold flex items-center justify-center gap-2.5 text-[#00a8cc]">
                <Sun className="w-4 h-4" /> Default Light Theme (Active)
              </div>
            </div>
          </div>

          {/* Sandbox Controls / Reset Button */}
          <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-3xl space-y-3.5">
            <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
              <RefreshCw className="w-4 h-4" /> Clinician Sandbox Tools
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              If you have added custom patients, modified consultation listings, or closed critical status warnings, click below to restore the portal to baseline clinical presets.
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleResetClick}
                className="py-2.5 px-4 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-rose-500/10"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Clinical Datasets
              </button>
              
              <AnimatePresence>
                {showResetSuccess && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-xs font-bold text-emerald-500 flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Database presets successfully flushed.
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
