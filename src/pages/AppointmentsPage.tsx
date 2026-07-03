/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar as CalendarIcon, Clock, User, ClipboardList, PlusCircle, 
  Trash2, Play, Check, X, Search, CheckCircle, HelpCircle,
  ChevronLeft, ChevronRight, UserCheck, AlertCircle, Bell,
  ShieldCheck, RefreshCw, Sparkles, Send, CalendarDays, Plus, Activity, ArrowRight, Ban, UserMinus, FileText
} from 'lucide-react';
import { Appointment, Patient, PageId } from '../types';
import { mockPatients } from '../mockData';

interface AppointmentsPageProps {
  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
  onNavigateToPatient: (patient: Patient) => void;
}

export default function AppointmentsPage({
  appointments,
  setAppointments,
  onNavigateToPatient
}: AppointmentsPageProps) {
  // Navigation & Filter states
  const [filterMode, setFilterMode] = useState<'All' | 'Today' | 'Upcoming' | 'WalkIns' | 'History'>('Today');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>('apt-002'); // Default to Clara Oswald who is Consulting

  // Calendar states
  const [currentYear, setCurrentYear] = useState(2026);
  const [currentMonth, setCurrentMonth] = useState(6); // July (0-indexed 6)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>('2026-07-03'); // Filter by today initially

  // Follow up scheduler form states (inside the right pane)
  const [followUpInterval, setFollowUpInterval] = useState<'1' | '2' | '4' | '12'>('2'); // weeks
  const [followUpTime, setFollowUpTime] = useState('10:30 AM');
  const [followUpReason, setFollowUpReason] = useState('Routine cardiac assessment');

  // New manual / walk-in appointment states
  const [isAddingWalkIn, setIsAddingWalkIn] = useState(false);
  const [walkInPatientId, setWalkInPatientId] = useState(mockPatients[0].id);
  const [walkInReason, setWalkInReason] = useState('');
  const [walkInType, setWalkInType] = useState<'Consultation' | 'Follow-up' | 'Emergency'>('Consultation');

  // Dynamic timeline custom note state
  const [customTimelineNote, setCustomTimelineNote] = useState('');

  // Reminder triggering simulation state
  const [isSimulatingReminder, setIsSimulatingReminder] = useState<string | null>(null);

  // Elegant Toast state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Month navigation names
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Sync selection if the filtered list changes
  const selectedAppointment = appointments.find(apt => apt.id === selectedAppointmentId);

  // Month-day generation helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Generate calendar grid array (42 items for standard grid)
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDaysArray: { day: number; month: number; year: number; isCurrentMonth: boolean; dateString: string }[] = [];

  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

  // Prev month padding
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const dateString = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    calendarDaysArray.push({ day: d, month: prevMonth, year: prevYear, isCurrentMonth: false, dateString });
  }

  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDaysArray.push({ day: i, month: currentMonth, year: currentYear, isCurrentMonth: true, dateString });
  }

  // Next month padding to fill 42 cells
  const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
  const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
  const remainingCells = 42 - calendarDaysArray.length;
  for (let i = 1; i <= remainingCells; i++) {
    const dateString = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarDaysArray.push({ day: i, month: nextMonth, year: nextYear, isCurrentMonth: false, dateString });
  }

  // Vitals metrics for Today (July 3, 2026)
  const todayDateStr = '2026-07-03';
  const todayAppointments = appointments.filter(apt => apt.date === todayDateStr);

  const stats = {
    total: todayAppointments.length,
    waiting: todayAppointments.filter(a => a.status === 'Waiting').length,
    consulting: todayAppointments.filter(a => a.status === 'Consulting').length,
    completed: todayAppointments.filter(a => a.status === 'Completed').length,
    missed: todayAppointments.filter(a => a.status === 'Missed').length,
    walkins: todayAppointments.filter(a => a.isWalkIn).length
  };

  // Filter logic combined
  const filteredAppointments = appointments.filter(apt => {
    // 1. Search term filter
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          apt.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          apt.id.toLowerCase().includes(searchTerm.toLowerCase());

    // 2. Tab mode filter
    let matchesMode = true;
    if (filterMode === 'Today') {
      matchesMode = apt.date === todayDateStr;
    } else if (filterMode === 'Upcoming') {
      // Future dates
      matchesMode = apt.date > todayDateStr;
    } else if (filterMode === 'WalkIns') {
      matchesMode = !!apt.isWalkIn;
    } else if (filterMode === 'History') {
      // Completed, Missed or Cancelled
      matchesMode = apt.status === 'Completed' || apt.status === 'Missed' || apt.status === 'Cancelled';
    }

    // 3. Calendar Day selection override (if user clicks on a calendar date, override tab unless they clear it)
    let matchesCalendar = true;
    if (selectedCalendarDate) {
      matchesCalendar = apt.date === selectedCalendarDate;
    }

    return matchesSearch && matchesMode && matchesCalendar;
  });

  // Handle Quick Walk-in Admission
  const handleCreateWalkIn = (e: FormEvent) => {
    e.preventDefault();
    if (!walkInReason) return;

    const chosenPatient = mockPatients.find(p => p.id === walkInPatientId);
    if (!chosenPatient) return;

    const newApt: Appointment = {
      id: `apt-${String(appointments.length + 1).padStart(3, '0')}`,
      patientId: chosenPatient.id,
      patientName: chosenPatient.name,
      patientAvatar: chosenPatient.avatar,
      date: todayDateStr, // always today
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: walkInType,
      status: 'Waiting', // immediately enters the queue as waiting
      reason: walkInReason,
      isWalkIn: true,
      reminderStatus: 'None',
      timeline: [
        { 
          status: 'Arrived / Waiting', 
          timestamp: 'Just now', 
          description: `Walk-in registration finalized at front desk. Admitted directly as a ${walkInType}.` 
        }
      ]
    };

    setAppointments(prev => [newApt, ...prev]);
    setSelectedAppointmentId(newApt.id);
    setWalkInReason('');
    setIsAddingWalkIn(false);
  };

  // Update Status and append log to timeline automatically
  const handleUpdateStatus = (id: string, newStatus: Appointment['status']) => {
    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setAppointments(prev => prev.map(apt => {
      if (apt.id === id) {
        let desc = '';
        if (newStatus === 'Waiting') desc = 'Patient marked as checked-in and waiting in triage lounge.';
        else if (newStatus === 'Consulting') desc = 'Active medical consultation with Dr. Chen initiated.';
        else if (newStatus === 'Completed') desc = 'Consultation concluded successfully. Post-procedure notes logged.';
        else if (newStatus === 'Missed') desc = 'Patient confirmed as no-show. Rescheduling required.';
        else if (newStatus === 'Cancelled') desc = 'Appointment cancelled by clinic coordinator.';

        const updatedTimeline = apt.timeline ? [...apt.timeline] : [];
        updatedTimeline.push({
          status: newStatus === 'Waiting' ? 'Arrived / Waiting' : newStatus,
          timestamp: timestampStr,
          description: desc
        });

        return { 
          ...apt, 
          status: newStatus,
          timeline: updatedTimeline
        };
      }
      return apt;
    }));
  };

  // Delete an appointment
  const handleDeleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    if (selectedAppointmentId === id) {
      setSelectedAppointmentId(null);
    }
  };

  // Append a manual custom note to selected appointment timeline
  const handleAddCustomTimelineNote = (e: FormEvent) => {
    e.preventDefault();
    if (!customTimelineNote.trim() || !selectedAppointmentId) return;

    const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAppointments(prev => prev.map(apt => {
      if (apt.id === selectedAppointmentId) {
        const updatedTimeline = apt.timeline ? [...apt.timeline] : [];
        updatedTimeline.push({
          status: 'Clinical Note',
          timestamp: timestampStr,
          description: customTimelineNote
        });
        return {
          ...apt,
          timeline: updatedTimeline
        };
      }
      return apt;
    }));

    setCustomTimelineNote('');
  };

  // Simulate Reminder Dispatch with clean animations
  const handleTriggerReminder = (id: string) => {
    setIsSimulatingReminder(id);
    setTimeout(() => {
      setAppointments(prev => prev.map(apt => {
        if (apt.id === id) {
          const timestampStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const updatedTimeline = apt.timeline ? [...apt.timeline] : [];
          updatedTimeline.push({
            status: 'Reminder Sent',
            timestamp: timestampStr,
            description: 'Patient notification re-sent successfully via automated cellular network.'
          });

          return {
            ...apt,
            reminderStatus: 'Delivered',
            timeline: updatedTimeline
          };
        }
        return apt;
      }));
      setIsSimulatingReminder(null);
    }, 1500);
  };

  // Handle Follow-up Scheduler Submission
  const handleBookFollowUp = (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAppointment) return;

    const currentAptDate = new Date(selectedAppointment.date + 'T12:00:00');
    const weeksToAdd = parseInt(followUpInterval);
    currentAptDate.setDate(currentAptDate.getDate() + (weeksToAdd * 7));
    const newDateStr = currentAptDate.toISOString().split('T')[0];

    const newApt: Appointment = {
      id: `apt-${String(appointments.length + 1).padStart(3, '0')}`,
      patientId: selectedAppointment.patientId,
      patientName: selectedAppointment.patientName,
      patientAvatar: selectedAppointment.patientAvatar,
      date: newDateStr,
      time: followUpTime,
      type: 'Follow-up',
      status: 'Scheduled',
      reason: followUpReason,
      isWalkIn: false,
      reminderStatus: 'Pending',
      timeline: [
        {
          status: 'Scheduled',
          timestamp: 'Just now',
          description: `Follow-up appointment generated by Dr. Chen following visit ${selectedAppointment.id}.`
        }
      ]
    };

    setAppointments(prev => [newApt, ...prev]);
    // Highlight the new appointment
    setSelectedAppointmentId(newApt.id);
    setFollowUpReason('Routine cardiac assessment');
    setToast({
      message: `Successfully scheduled a follow-up visit for ${selectedAppointment.patientName} on ${newDateStr} at ${followUpTime}.`,
      type: 'success'
    });
  };

  // Render Calendar Indicator helper
  const renderCalendarCellIndicators = (dateStr: string) => {
    const dayAppointments = appointments.filter(apt => apt.date === dateStr);
    if (dayAppointments.length === 0) return null;

    return (
      <div className="flex gap-0.5 justify-center mt-0.5">
        {dayAppointments.slice(0, 3).map((apt, idx) => {
          let dotColor = 'bg-blue-500';
          if (apt.status === 'Waiting') dotColor = 'bg-amber-500';
          else if (apt.status === 'Consulting') dotColor = 'bg-indigo-500';
          else if (apt.status === 'Completed') dotColor = 'bg-emerald-500';
          else if (apt.status === 'Missed') dotColor = 'bg-red-500';
          else if (apt.status === 'Cancelled') dotColor = 'bg-slate-400';

          return (
            <span 
              key={idx} 
              className={`w-1 h-1 rounded-full ${dotColor}`} 
              title={`${apt.patientName}: ${apt.type} (${apt.status})`}
            />
          );
        })}
        {dayAppointments.length > 3 && (
          <span className="text-[6px] font-bold text-slate-400 leading-none">+</span>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm">
        <div>
          <span className="text-[10px] font-extrabold text-blue-600 dark:text-blue-400 uppercase tracking-widest block mb-1">
            DOCO Cardiology Department
          </span>
          <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight flex items-center gap-2">
            Clinical Schedulers & Queue Engine
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Coordinate diagnostic visits, triage walk-ins, and manage patient flows in real-time
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setSelectedCalendarDate('2026-07-03');
              setFilterMode('Today');
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-2xl transition-all flex items-center gap-1.5"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-blue-500" /> Go to Today
          </button>
          
          <button
            onClick={() => setIsAddingWalkIn(true)}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Walk-In Admission
          </button>
        </div>
      </div>

      {/* ================= TODAY'S QUEUE METRICS BENTO BOX ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-600 dark:text-slate-400 shrink-0">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Today's Total</span>
            <p className="text-lg font-black text-slate-900 dark:text-white mt-0.5">{stats.total}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/15 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Waiting</span>
            <p className="text-lg font-black text-amber-500 mt-0.5">{stats.waiting}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/15 rounded-2xl flex items-center justify-center text-indigo-500 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shrink-0" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Consulting</span>
            <p className="text-lg font-black text-indigo-500 mt-0.5">{stats.consulting}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/15 rounded-2xl flex items-center justify-center text-emerald-500 shrink-0">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Completed</span>
            <p className="text-lg font-black text-emerald-500 mt-0.5">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-red-500/5 dark:bg-red-500/10 border border-red-500/15 rounded-2xl flex items-center justify-center text-red-500 shrink-0">
            <UserMinus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Missed</span>
            <p className="text-lg font-black text-red-500 mt-0.5">{stats.missed}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/15 rounded-2xl flex items-center justify-center text-blue-500 shrink-0">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider">Walk-ins</span>
            <p className="text-lg font-black text-blue-500 mt-0.5">{stats.walkins}</p>
          </div>
        </div>

      </div>

      {/* ================= MAIN SPLIT GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================
           COLUMN 1: INTUITIVE CALENDAR & WALK-INS FAST CREATOR (XL:COL-3)
           ====================================================================== */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Professional Monthly Calendar Widget */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
            
            {/* Month Header Controller */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-blue-500" /> Clinic Calendar
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 px-1 font-mono">
                  {monthNames[currentMonth].slice(0, 3)} {currentYear}
                </span>
                <button
                  onClick={handleNextMonth}
                  className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Days Grid Headers */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, idx) => (
                <span key={idx} className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  {day}
                </span>
              ))}
            </div>

            {/* Monthly Calendar Cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDaysArray.map((cell, idx) => {
                const isSelected = selectedCalendarDate === cell.dateString;
                const isToday = cell.dateString === todayDateStr;
                const hasAppointments = appointments.some(apt => apt.date === cell.dateString);
                
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedCalendarDate(cell.dateString);
                      // Set tab mode to All so we can see appointments on that day
                      setFilterMode('All');
                    }}
                    className={`h-11 rounded-xl flex flex-col justify-between p-1 text-xs transition-all relative ${
                      isSelected 
                        ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/10' 
                        : isToday
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/25 font-bold'
                        : cell.isCurrentMonth
                        ? 'text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                        : 'text-slate-350 dark:text-slate-600 hover:bg-slate-50 dark:hover:bg-slate-850/40'
                    }`}
                  >
                    <span className="text-[10px] leading-none self-start font-mono font-bold">
                      {cell.day}
                    </span>
                    {renderCalendarCellIndicators(cell.dateString)}
                  </button>
                );
              })}
            </div>

            {/* Calendar Controls Footer */}
            {selectedCalendarDate && (
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 font-mono">
                  Filtered: {selectedCalendarDate}
                </span>
                <button
                  onClick={() => setSelectedCalendarDate(null)}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Clear Date Filter
                </button>
              </div>
            )}
          </div>

          {/* Quick Stats Summary / Quick Walk-In toggle view */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-5 rounded-3xl shadow-sm space-y-4 border border-slate-800/80">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest block">
                EMR SYNC STATUS
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" /> LIVE
              </span>
            </div>
            
            <h4 className="text-sm font-bold text-slate-200 tracking-tight">Active Room Management</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Vitals terminal is connected to triage desk. Walk-ins will automatically enter the "Waiting" stage.
            </p>

            <div className="pt-2">
              <button
                onClick={() => setIsAddingWalkIn(true)}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-2xl transition-all shadow-md shadow-blue-500/10 flex justify-center items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" /> Fast Admit Walk-in
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================================
           COLUMN 2: CENTRAL INTERACTIVE APPOINTMENTS LIST (XL:COL-5)
           ====================================================================== */}
        <div className="xl:col-span-5 space-y-4">
          
          {/* List Toolbar / Search & Navigation Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm space-y-4">
            
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none border-b border-slate-100 dark:border-slate-800/80">
              {[
                { id: 'Today', label: "Today's Queue" },
                { id: 'Upcoming', label: 'Upcoming' },
                { id: 'WalkIns', label: 'Walk-ins' },
                { id: 'History', label: 'History' },
                { id: 'All', label: 'All Records' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setFilterMode(tab.id as any);
                    // Clear selected calendar day filter when switching tabs so the user gets standard list behavior
                    if (tab.id !== 'All') {
                      setSelectedCalendarDate(null);
                    }
                  }}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterMode === tab.id
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Live Search input */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name, clinical reason, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white outline-none transition-all"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Header context description */}
            <div className="flex justify-between items-center text-[11px] text-slate-500 font-mono">
              <span>Showing {filteredAppointments.length} matching appointments</span>
              {selectedCalendarDate && (
                <span className="text-blue-600 dark:text-blue-400 font-bold">
                  Date constraint active: {selectedCalendarDate}
                </span>
              )}
            </div>
          </div>

          {/* Core Appointments List Container */}
          <div className="space-y-3.5 max-h-[700px] overflow-y-auto pr-1">
            {filteredAppointments.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-12 text-center rounded-3xl shadow-sm">
                <CalendarIcon className="w-12 h-12 text-slate-350 dark:text-slate-700 mx-auto mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No appointments recorded</h4>
                <p className="text-slate-500 dark:text-slate-500 text-xs mt-1.5 max-w-sm mx-auto">
                  Try clearing the date filter or searching for another patient. You can also admit a quick walk-in.
                </p>
                {selectedCalendarDate && (
                  <button
                    onClick={() => setSelectedCalendarDate(null)}
                    className="mt-4 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-xl transition-all"
                  >
                    Reset Date Filter
                  </button>
                )}
              </div>
            ) : (
              filteredAppointments.map((apt) => {
                const isSelected = apt.id === selectedAppointmentId;
                
                // Status Color Mapping
                let statusBgClass = '';
                let statusTextClass = '';
                let borderIndicatorClass = '';

                if (apt.status === 'Waiting') {
                  statusBgClass = 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
                  statusTextClass = 'text-amber-500';
                  borderIndicatorClass = 'bg-amber-500';
                } else if (apt.status === 'Consulting') {
                  statusBgClass = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 animate-pulse';
                  statusTextClass = 'text-indigo-500';
                  borderIndicatorClass = 'bg-indigo-500';
                } else if (apt.status === 'Completed') {
                  statusBgClass = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400';
                  statusTextClass = 'text-emerald-500';
                  borderIndicatorClass = 'bg-emerald-500';
                } else if (apt.status === 'Missed') {
                  statusBgClass = 'bg-red-500/10 text-red-600 dark:text-red-400';
                  statusTextClass = 'text-red-500';
                  borderIndicatorClass = 'bg-red-500';
                } else if (apt.status === 'Cancelled') {
                  statusBgClass = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
                  statusTextClass = 'text-slate-400';
                  borderIndicatorClass = 'bg-slate-400';
                } else {
                  // Scheduled
                  statusBgClass = 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
                  statusTextClass = 'text-blue-500';
                  borderIndicatorClass = 'bg-blue-500';
                }

                return (
                  <div
                    key={apt.id}
                    onClick={() => setSelectedAppointmentId(apt.id)}
                    className={`bg-white dark:bg-slate-900 border rounded-3xl p-4.5 shadow-sm flex flex-col gap-3.5 transition-all cursor-pointer relative overflow-hidden ${
                      isSelected 
                        ? 'border-blue-500 dark:border-blue-400 ring-1 ring-blue-500/35 shadow-md shadow-blue-500/5 bg-blue-50/5 dark:bg-blue-950/5' 
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                    }`}
                  >
                    {/* Visual Status Marker */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${borderIndicatorClass}`} />

                    <div className="flex items-start gap-3.5 pl-2">
                      <img
                        src={apt.patientAvatar}
                        alt={apt.patientName}
                        className="w-10.5 h-10.5 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 shrink-0"
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-black text-slate-950 dark:text-white leading-tight truncate">
                            {apt.patientName}
                          </h4>
                          
                          {/* Type Badge */}
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            apt.type === 'Emergency'
                              ? 'bg-red-500/10 text-red-500'
                              : apt.type === 'Follow-up'
                              ? 'bg-blue-500/10 text-blue-500'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-350'
                          }`}>
                            {apt.type}
                          </span>

                          {/* Walk-in Tag */}
                          {apt.isWalkIn && (
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider bg-purple-500/10 text-purple-600 dark:text-purple-400">
                              Walk-in
                            </span>
                          )}

                          {/* Status Badge */}
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${statusBgClass}`}>
                            {apt.status}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                          {apt.reason}
                        </p>

                        <div className="flex items-center gap-4 text-[11px] text-slate-400 mt-2 font-mono">
                          <span className="flex items-center gap-1 font-bold text-blue-600 dark:text-blue-400">
                            <CalendarIcon className="w-3.5 h-3.5" /> {apt.date}
                          </span>
                          <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5" /> {apt.time}
                          </span>
                          {apt.reminderStatus && apt.reminderStatus !== 'None' && (
                            <span className={`flex items-center gap-1 font-semibold ${
                              apt.reminderStatus === 'Delivered' 
                                ? 'text-emerald-500' 
                                : apt.reminderStatus === 'Sent' 
                                ? 'text-indigo-400' 
                                : 'text-amber-500'
                            }`}>
                              <Bell className="w-3 h-3" /> Reminder: {apt.reminderStatus}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Interactive Queue State Controls Row */}
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60 pt-3 pl-14 flex-wrap gap-2">
                      <div className="flex items-center gap-1 flex-wrap">
                        {/* Change Status Buttons */}
                        {apt.status !== 'Waiting' && apt.status !== 'Completed' && apt.status !== 'Missed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Waiting');
                            }}
                            className="px-2.5 py-1 hover:bg-amber-500/10 text-amber-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                            title="Patient arrived, check in"
                          >
                            Check In
                          </button>
                        )}

                        {apt.status === 'Waiting' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Consulting');
                            }}
                            className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1"
                            title="Start consulting session"
                          >
                            <Play className="w-3 h-3 fill-white" /> Consulting
                          </button>
                        )}

                        {apt.status === 'Consulting' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Completed');
                            }}
                            className="px-2.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1"
                            title="Complete session"
                          >
                            <Check className="w-3 h-3" /> Complete
                          </button>
                        )}

                        {apt.status !== 'Completed' && apt.status !== 'Missed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(apt.id, 'Missed');
                            }}
                            className="px-2.5 py-1 hover:bg-red-500/15 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                            title="Mark as missed/no-show"
                          >
                            No-Show
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const pat = mockPatients.find(p => p.id === apt.patientId);
                            if (pat) onNavigateToPatient(pat);
                          }}
                          className="px-2.5 py-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all"
                        >
                          View EMR
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAppointment(apt.id);
                          }}
                          className="p-1.5 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-all"
                          title="Delete Appointment Slot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* ======================================================================
           COLUMN 3: ADVANCED INSPECTOR, TIMELINE, SCHEDULER & DETAILS (XL:COL-4)
           ====================================================================== */}
        <div className="xl:col-span-4">
          
          {selectedAppointment ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-6">
              
              {/* Patient Basic Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedAppointment.patientAvatar}
                    alt={selectedAppointment.patientName}
                    className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/20"
                  />
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white leading-tight">
                      {selectedAppointment.patientName}
                    </h3>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mt-0.5">
                      Patient ID: {selectedAppointment.patientId}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {selectedAppointment.id}
                </span>
              </div>

              {/* Consultation Details */}
              <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase block tracking-wider mb-0.5">
                    Consultation Type & Status
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {selectedAppointment.type}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400">
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="text-[9px] font-extrabold text-slate-400 uppercase block tracking-wider mb-0.5">
                    Primary Reason
                  </span>
                  <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                    {selectedAppointment.reason}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div>
                    <span className="text-[9px] font-extrabold text-slate-400 uppercase block tracking-wider mb-0.5">
                      Admission Notes
                    </span>
                    <p className="text-xs italic text-slate-500 dark:text-slate-450">
                      "{selectedAppointment.notes}"
                    </p>
                  </div>
                )}
              </div>

              {/* AUTOMATED REMINDER STATUS PANEL */}
              <div className="border-t border-slate-150 dark:border-slate-800/80 pt-4">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
                  <Bell className="w-4 h-4 text-indigo-500" /> Reminder Status Manager
                </h4>

                <div className="flex items-center justify-between bg-indigo-50/20 dark:bg-slate-950 border border-indigo-100/30 dark:border-slate-800 p-3.5 rounded-2xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 block">
                      CURRENT DELIVERY STATUS
                    </span>
                    <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 mt-1 block">
                      {selectedAppointment.reminderStatus || 'Pending'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleTriggerReminder(selectedAppointment.id)}
                    disabled={isSimulatingReminder === selectedAppointment.id}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
                  >
                    {isSimulatingReminder === selectedAppointment.id ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Dispatching...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Trigger Reminder
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* APPOINTMENT TIMELINE */}
              <div className="border-t border-slate-150 dark:border-slate-800/80 pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-500" /> Appointment Timeline
                  </h4>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 font-mono uppercase">
                    Audit Log
                  </span>
                </div>

                {/* Vertical Timeline Stepper */}
                <div className="space-y-4 max-h-[220px] overflow-y-auto pr-1">
                  {selectedAppointment.timeline && selectedAppointment.timeline.length > 0 ? (
                    selectedAppointment.timeline.map((step, idx) => (
                      <div key={idx} className="flex gap-3 relative group">
                        
                        {/* Vertical connection line */}
                        {idx !== (selectedAppointment.timeline?.length || 0) - 1 && (
                          <div className="absolute left-2.5 top-5 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800" />
                        )}

                        {/* Event Circle Dot */}
                        <div className="relative z-10">
                          <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center border text-[10px] ${
                            step.status === 'Completed'
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500'
                              : step.status === 'Arrived / Waiting' || step.status === 'Waiting'
                              ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                              : step.status === 'Consulting'
                              ? 'bg-indigo-500/10 border-indigo-500 text-indigo-500'
                              : 'bg-blue-500/10 border-blue-500 text-blue-500'
                          }`}>
                            {idx + 1}
                          </div>
                        </div>

                        {/* Step details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <span className="text-[11px] font-black text-slate-800 dark:text-slate-200">
                              {step.status}
                            </span>
                            <span className="text-[9px] font-bold text-slate-450 font-mono">
                              {step.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-xs text-slate-400 italic">
                      No events registered in the timeline yet.
                    </div>
                  )}
                </div>

                {/* Add Custom Timeline Event Entry */}
                <form onSubmit={handleAddCustomTimelineNote} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a timeline audit note..."
                    value={customTimelineNote}
                    onChange={(e) => setCustomTimelineNote(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
                  />
                  <button
                    type="submit"
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all"
                  >
                    Log
                  </button>
                </form>
              </div>

              {/* FOLLOW-UP SCHEDULER */}
              <div className="border-t border-slate-150 dark:border-slate-800/80 pt-4 space-y-3">
                <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <CalendarDays className="w-4 h-4 text-emerald-500" /> Post-Consult Follow-up Scheduler
                </h4>
                <p className="text-[11px] text-slate-400">
                  Easily pre-schedule a future rehabilitation or check-up slot for this specific patient.
                </p>

                <form onSubmit={handleBookFollowUp} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label htmlFor="followup-interval" className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Timeframe Interval</label>
                      <select
                        id="followup-interval"
                        value={followUpInterval}
                        onChange={(e) => setFollowUpInterval(e.target.value as any)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 px-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                      >
                        <option value="1">1 Week Follow-up</option>
                        <option value="2">2 Weeks Follow-up</option>
                        <option value="4">4 Weeks Follow-up</option>
                        <option value="12">3 Months Follow-up</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="followup-time" className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Target Time</label>
                      <input
                        id="followup-time"
                        type="text"
                        value={followUpTime}
                        onChange={(e) => setFollowUpTime(e.target.value)}
                        placeholder="e.g., 10:30 AM"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 px-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="followup-reason" className="block text-[9px] font-black text-slate-400 uppercase tracking-wider mb-1">Primary Focus/Reason</label>
                    <input
                      id="followup-reason"
                      type="text"
                      required
                      value={followUpReason}
                      onChange={(e) => setFollowUpReason(e.target.value)}
                      placeholder="e.g. Post-rehab EKG assessment"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2 px-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black rounded-xl text-xs flex justify-center items-center gap-1.5 transition-all shadow-md shadow-emerald-500/10"
                  >
                    <Plus className="w-3.5 h-3.5" /> Book Follow-up Slot
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl text-center shadow-sm h-72 flex flex-col items-center justify-center text-slate-500 space-y-2">
              <ClipboardList className="w-10 h-10 text-slate-350 dark:text-slate-700 animate-bounce" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">No selection active</h4>
              <p className="text-xs text-slate-400 max-w-[200px]">
                Click on any appointment card in the central list to review specific details.
              </p>
            </div>
          )}

        </div>

      </div>

      {/* ======================================================================
         MODAL / DIALOG: WALK-IN ADMISSION FORM OVERLAY
         ====================================================================== */}
      <AnimatePresence>
        {isAddingWalkIn && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-xl overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-black text-slate-950 dark:text-white">
                    Emergency & Walk-in Fast Admission
                  </h3>
                </div>
                <button
                  onClick={() => setIsAddingWalkIn(false)}
                  className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateWalkIn} className="p-5 space-y-4">
                
                {/* Select Target Patient */}
                <div>
                  <label htmlFor="walkin-patient" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Select Admitted Patient
                  </label>
                  <select
                    id="walkin-patient"
                    value={walkInPatientId}
                    onChange={(e) => setWalkInPatientId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer"
                  >
                    {mockPatients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                    ))}
                  </select>
                </div>

                {/* Admission Type */}
                <div>
                  <label htmlFor="walkin-type" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Emergency Triage Priority
                  </label>
                  <select
                    id="walkin-type"
                    value={walkInType}
                    onChange={(e) => setWalkInType(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all cursor-pointer"
                  >
                    <option value="Consultation">Standard Consultation (Routine check-up / walk-in)</option>
                    <option value="Follow-up">Urgent Follow-up (Acute post-procedure complaint)</option>
                    <option value="Emergency">CRITICAL EMERGENCY (High risk triage priority)</option>
                  </select>
                </div>

                {/* Complaint Reason */}
                <div>
                  <label htmlFor="walkin-reason" className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Chief Presenting Complaint
                  </label>
                  <textarea
                    id="walkin-reason"
                    required
                    rows={3}
                    placeholder="Describe presenting symptoms (e.g. sharp substernal pressure, sudden orthostatic syncope)..."
                    value={walkInReason}
                    onChange={(e) => setWalkInReason(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2.5 px-3.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all resize-none"
                  />
                </div>

                <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-3.5 flex gap-2 text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed font-sans">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <div>
                    <strong>Triage Notice:</strong> This walk-in patient will immediately bypass standard booking intervals and enter the active <strong>Today's Queue</strong> with an initial status of <strong>Waiting</strong>.
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingWalkIn(false)}
                    className="px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350 text-xs font-bold rounded-xl transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-500/10"
                  >
                    Finalize Admission
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4.5 py-4 rounded-2xl shadow-xl border border-slate-850 dark:border-slate-100 flex items-start gap-3"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-xs font-black tracking-wide uppercase text-emerald-500 dark:text-emerald-600">Notification</h4>
              <p className="text-xs mt-1 font-semibold leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast(null)}
              className="text-slate-450 hover:text-slate-200 dark:hover:text-slate-700 text-xs font-bold leading-none shrink-0"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
