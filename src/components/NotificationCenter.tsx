/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, X, Check, BellOff, ShieldAlert, 
  MessageSquare, User, Calendar, CheckSquare, Info 
} from 'lucide-react';
import { Notification } from '../types';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  setNotifications: Dispatch<SetStateAction<Notification[]>>;
}

export default function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  setNotifications
}: NotificationCenterProps) {
  
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };

  const handleMarkOneRead = (id: string) => {
    setNotifications(prev => prev.map(notif => {
      if (notif.id === id) {
        return { ...notif, read: true };
      }
      return notif;
    }));
  };

  const handleDeleteNotif = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (closes panel on click) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Slide out card */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white dark:bg-slate-950 z-50 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col justify-between overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-4.5 h-4.5 text-blue-600" />
                <span className="text-sm font-extrabold text-slate-950 dark:text-white">Notification Pager</span>
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {notifications.filter(n => !n.read).length} New
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    title="Mark all as read"
                  >
                    Mark All Read
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 rounded-lg"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="text-center py-12 space-y-2">
                  <BellOff className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto animate-pulse" />
                  <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400">Pager is completely clear</h4>
                  <p className="text-[10px] text-slate-400">No warnings or patient records are pending review.</p>
                </div>
              ) : (
                notifications.map((notif) => {
                  // Get type icons
                  let Icon = Info;
                  let colorClasses = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  
                  if (notif.type === 'alert') {
                    Icon = ShieldAlert;
                    colorClasses = 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse';
                  } else if (notif.type === 'appointment') {
                    Icon = Calendar;
                    colorClasses = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  } else if (notif.type === 'patient') {
                    Icon = User;
                    colorClasses = 'bg-blue-500/10 text-blue-500 border-blue-500/20';
                  }

                  return (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 relative overflow-hidden ${
                        notif.read
                          ? 'bg-white dark:bg-slate-900/40 border-slate-100 dark:border-slate-800/40 opacity-75'
                          : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800/80 shadow-sm'
                      }`}
                    >
                      {/* Unread vertical dot indicator */}
                      {!notif.read && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-600" />
                      )}

                      <div className="flex gap-2.5 items-start">
                        <div className={`p-1.5 rounded-lg border shrink-0 ${colorClasses}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-xs">
                          <h4 className="font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed mt-0.5">{notif.message}</p>
                          <span className="text-[10px] font-mono text-slate-400 block mt-1.5">{notif.time}</span>
                        </div>
                      </div>

                      {/* Micro actions */}
                      <div className="flex flex-col gap-1 shrink-0">
                        {!notif.read && (
                          <button
                            onClick={() => handleMarkOneRead(notif.id)}
                            className="p-1 hover:bg-slate-200 dark:hover:bg-slate-800 text-blue-600 rounded-md transition-colors"
                            title="Mark as Read"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteNotif(notif.id)}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-rose-500/10 text-slate-400 hover:text-rose-500 rounded-md transition-colors"
                          title="Delete Pager alert"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Clear All Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-center">
                <button
                  onClick={handleClearAll}
                  className="w-full py-2 bg-slate-100 hover:bg-rose-500/10 text-slate-700 dark:text-slate-400 hover:text-rose-500 text-xs font-bold rounded-xl border border-slate-100 dark:border-slate-800/40 transition-all"
                >
                  Clear All Warnings
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
