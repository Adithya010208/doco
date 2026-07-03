import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  X, Check, AlertTriangle, Users, Clock, Award, Activity, Phone, 
  MapPin, Clipboard, FileText, Send, Play, ShieldAlert,
  Smartphone, Plus, RefreshCw, Ban, CheckCircle, BedDouble
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';

// Continuous EKG rhythm data for telemetry alarm console
const ekgWaveData = [
  { time: 0, val: 50 }, { time: 1, val: 50 }, { time: 2, val: 50 },
  { time: 3, val: 80 }, { time: 4, val: 20 }, { time: 5, val: 120 },
  { time: 6, val: 10 }, { time: 7, val: 50 }, { time: 8, val: 50 },
  { time: 9, val: 50 }, { time: 10, val: 50 }, { time: 11, val: 50 },
  { time: 12, val: 80 }, { time: 13, val: 20 }, { time: 14, val: 120 },
  { time: 15, val: 10 }, { time: 16, val: 50 }, { time: 17, val: 50 }
];

interface DashboardOverlaysProps {
  activeOverlay: string | null;
  onClose: () => void;
  waitingQueue: any[];
  setWaitingQueue: React.Dispatch<React.SetStateAction<any[]>>;
  followups: any[];
  setFollowups: React.Dispatch<React.SetStateAction<any[]>>;
  alerts: any[];
  setAlerts: React.Dispatch<React.SetStateAction<any[]>>;
  hospitalOverview: any;
  setHospitalOverview: React.Dispatch<React.SetStateAction<any>>;
  onAddTimelineActivity: (activity: {
    type: 'AI' | 'Medication' | 'System' | 'Consultation';
    message: string;
    patient: string;
    details: string;
  }) => void;
  onNavigate: (page: 'patients' | 'appointments' | 'analytics') => void;
  onSelectPatient: (patient: any) => void;
}

export default function DashboardOverlays({
  activeOverlay,
  onClose,
  waitingQueue,
  setWaitingQueue,
  followups,
  setFollowups,
  alerts,
  setAlerts,
  hospitalOverview,
  setHospitalOverview,
  onAddTimelineActivity,
  onNavigate,
  onSelectPatient
}: DashboardOverlaysProps) {
  
  // Call dialer states
  const [activeCall, setActiveCall] = useState<{ patientName: string; duration: number; id: string } | null>(null);
  const [isCalling, setIsCalling] = useState<boolean>(false);
  
  // HL7 sync animation
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'running' | 'success'>('idle');

  // Quick action form inputs
  const [medPatient, setMedPatient] = useState<string>('Robert Miller');
  const [medName, setMedName] = useState<string>('');
  const [medDose, setMedDose] = useState<string>('');
  const [labPatient, setLabPatient] = useState<string>('Clara Oswald');
  const [labType, setLabType] = useState<string>('Lipid Panel');
  const [labUrgency, setLabUrgency] = useState<string>('STAT');
  const [admitPatient, setAdmitPatient] = useState<string>('Harvey Dent');
  const [admitUnit, setAdmitUnit] = useState<string>('Cardiology ICU');
  const [admitReason, setAdmitReason] = useState<string>('');

  // Call timer effect
  useEffect(() => {
    let interval: any;
    if (activeCall && isCalling) {
      interval = setInterval(() => {
        setActiveCall(prev => prev ? { ...prev, duration: prev.duration + 1 } : null);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeCall, isCalling]);

  if (!activeOverlay) return null;

  // Format stopwatch duration
  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Submit medication form
  const handlePrescribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!medName || !medDose) return;

    onAddTimelineActivity({
      type: 'Medication',
      message: `Prescribed ${medName} ${medDose} QD for ${medPatient}.`,
      patient: medPatient,
      details: `Transmitted electronically to clinic pharmacy. Indications logged in local EHR.`
    });

    onClose();
    setMedName('');
    setMedDose('');
  };

  // Submit lab form
  const handleLabSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTimelineActivity({
      type: 'System',
      message: `Ordered ${labUrgency} ${labType} lab workup for ${labPatient}.`,
      patient: labPatient,
      details: `Dispatched to pathology department. Real-time diagnostic notification is pending.`
    });
    onClose();
  };

  // Submit emergency admit
  const handleAdmitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Increment ICU occupancy and decrease available beds
    setHospitalOverview((prev: any) => ({
      ...prev,
      icuOccupancy: Math.min(100, prev.icuOccupancy + 10),
      cardiologyBeds: '9/10'
    }));

    // Trigger critical alert
    const newAlert = {
      id: `alt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      patientName: admitPatient,
      trigger: `Direct ICU Admission: ${admitReason || 'Acute cardiac observation required.'}`,
      time: 'Just now',
      severity: 'Critical',
      acknowledged: false
    };
    setAlerts(prev => [newAlert, ...prev]);

    onAddTimelineActivity({
      type: 'Consultation',
      message: `Initiated emergency direct admission of ${admitPatient} to ${admitUnit}.`,
      patient: admitPatient,
      details: `Reason: ${admitReason || 'Cardiac emergency'}. Dispatched nursing staff, reserved bed.`
    });

    onClose();
    setAdmitReason('');
  };

  // Trigger telephone dialer
  const handleStartCall = (id: string, name: string) => {
    setActiveCall({ id, patientName: name, duration: 0 });
    setIsCalling(true);
  };

  // Finish telephone call
  const handleEndCall = () => {
    if (!activeCall) return;
    const patName = activeCall.patientName;
    const durStr = formatDuration(activeCall.duration);

    // Update followups checklist to Completed
    setFollowups(prev => prev.map(f => {
      if (f.id === activeCall.id) {
        return { ...f, status: 'Completed' };
      }
      return f;
    }));

    onAddTimelineActivity({
      type: 'Consultation',
      message: `Completed telemedicine callback with ${patName} (duration: ${durStr}).`,
      patient: patName,
      details: `Checked on recovery parameters, reviewed medication tolerance, logged notes.`
    });

    setActiveCall(null);
    setIsCalling(false);
  };

  // Trigger HL7 Cloud Sync
  const handleRunHl7Sync = () => {
    setIsSyncing(true);
    setSyncStatus('running');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncStatus('success');
      onAddTimelineActivity({
        type: 'System',
        message: 'Dispatched electronic HL7 consultation records to regional EHR repository.',
        patient: 'System',
        details: 'Validated certificate signature, established secure SSL sync handshake. Success.'
      });
    }, 1500);
  };

  // Call lobby patient in
  const handleCallInPatient = (id: string, name: string, room: string) => {
    // Remove from waiting lobby list
    setWaitingQueue(prev => prev.filter(q => q.id !== id));

    // Add activity to timeline
    onAddTimelineActivity({
      type: 'Consultation',
      message: `Called lobby patient ${name} into ${room} for EKG evaluation.`,
      patient: name,
      details: `Triage complete. Patient escorted to room by clinical coordinator.`
    });

    onClose();
  };

  // Acknowledge clinical alarm
  const handleAcknowledgeAlarm = (id: string, name: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, acknowledged: true };
      }
      return a;
    }));

    onAddTimelineActivity({
      type: 'System',
      message: `Acknowledged clinical vital alarm for ${name}.`,
      patient: name,
      details: `Clinician marked alert as acknowledged. Continued telemetry monitoring requested.`
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      {/* Dialer Overlay Popup */}
      {activeCall && (
        <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-800 text-white rounded-3xl p-5 shadow-2xl z-50 w-72 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center animate-pulse">
            <Phone className="w-8 h-8 text-blue-400 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-bold">{activeCall.patientName}</h4>
            <span className="text-[10px] text-slate-400">Secure Clinical Telehealth Link</span>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-2">{formatDuration(activeCall.duration)}</div>
          </div>
          <button
            onClick={handleEndCall}
            className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1 transition-all"
          >
            <Ban className="w-4 h-4" /> End Call & Log Note
          </button>
        </div>
      )}

      {/* Main Overlay Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-2xl w-full rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-800 dark:text-slate-100"
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest block">Executive Command Hub</span>
            <h3 className="text-lg font-extrabold text-slate-950 dark:text-white uppercase tracking-tight">
              {activeOverlay.replace('-', ' ')}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 rounded-xl transition-all border border-slate-100 dark:border-slate-800"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* 1. Today's Appointments Agenda View */}
          {activeOverlay === 'today-appointments' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Scheduled clinical agenda and consultation objectives for today:</p>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">08:30 AM</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Eleanor Vance</h4>
                    <p className="text-xs text-slate-400">Evaluation: Post-PCI 6-week rehab review.</p>
                  </div>
                  <span className="text-xs text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg font-bold">Completed</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">10:00 AM</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Clara Oswald</h4>
                    <p className="text-xs text-slate-400">Consultation: Severe postural tachycardia flare-ups.</p>
                  </div>
                  <span className="text-xs text-blue-600 bg-blue-500/10 px-2.5 py-1 rounded-lg font-bold animate-pulse">In Progress</span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">11:15 AM</span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">Harvey Dent</h4>
                    <p className="text-xs text-slate-400">Emergency: Acute congestive dyspnea evaluation.</p>
                  </div>
                  <span className="text-xs text-slate-500 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-bold">Scheduled</span>
                </div>
              </div>
              <button
                onClick={() => { onNavigate('appointments'); onClose(); }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all flex justify-center items-center gap-1 shadow-md"
              >
                Go to Dedicated Schedulers Center <Activity className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* 2. Patients Waiting Lobby Queue Board */}
          {activeOverlay === 'patients-waiting' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Patients currently checking in at the front lobby desk:</p>
              <div className="space-y-3">
                {waitingQueue.length === 0 ? (
                  <div className="text-center py-6 text-slate-400 text-xs">No patients waiting in the lobby queue.</div>
                ) : (
                  waitingQueue.map((wq) => (
                    <div key={wq.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 flex justify-between items-center gap-3">
                      <div className="flex items-center gap-3">
                        <img src={wq.avatar} alt={wq.patientName} className="w-10 h-10 rounded-full object-cover" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{wq.patientName}</h4>
                            <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${wq.triageColor}`}>
                              {wq.triage}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{wq.condition}</p>
                          <span className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-1 block">Waiting Time: {wq.waitTime} mins</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCallInPatient(wq.id, wq.patientName, wq.room)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Play className="w-3 h-3" /> Call to {wq.room.split(' ')[2]}
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 3. Completed Consultations SOAP Archive */}
          {activeOverlay === 'completed-consultations' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Consultation records closed today. Select to review or synchronize with Cloud EHR database:</p>
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Marcus Thompson</h4>
                    <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full">Synchronized (HL7)</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Specialty Review: Metabolic syndrome and glycemic lipid targets. Session Duration: 22 mins.</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40">
                  <div className="flex justify-between">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Eleanor Vance</h4>
                    <span className="text-[10px] text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded-full">Pending Cloud Sync</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Evaluation: Post-PCI radial site inspection. Session Duration: 28 mins.</p>
                </div>
              </div>
              
              {/* Sync controls */}
              <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-2xl text-center space-y-3">
                <h4 className="text-xs font-bold">Electronic Health Registry (HL7 Gateway)</h4>
                <p className="text-[11px] text-slate-400">Transmit all pending clinical diagnostics to regional databases.</p>
                <div className="flex justify-center gap-2">
                  <button
                    onClick={handleRunHl7Sync}
                    disabled={isSyncing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-blue-500/10"
                  >
                    {isSyncing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                    <span>{isSyncing ? 'Synchronizing EHR...' : 'Execute EHR Sync'}</span>
                  </button>
                </div>
                {syncStatus === 'success' && (
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 animate-pulse mt-1">✓ Electronic records fully synchronized. HL7 verified.</div>
                )}
              </div>
            </div>
          )}

          {/* 4. Critical Alarm and Telemetry Monitoring Center */}
          {activeOverlay === 'critical-alerts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                <span className="text-xs font-extrabold text-red-500 uppercase flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 animate-bounce" /> Real-time Telemetry ECG Logs
                </span>
                <span className="text-[10px] font-mono text-slate-400">Bed Gateway #CAR-ICU-08</span>
              </div>

              {/* Beating heart EKG simulation */}
              <div className="h-28 bg-slate-950 border border-slate-800/80 rounded-2xl p-2 relative overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={ekgWaveData}>
                    <defs>
                      <linearGradient id="ekgGlow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EF4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#ekgGlow)" />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="absolute top-2 right-2 flex items-center gap-1.5 text-[10px] font-mono text-slate-500 font-semibold bg-slate-900/80 px-2 py-0.5 rounded-lg border border-slate-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>HEART RATE: 78 BPM</span>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {alerts.map((al) => (
                  <div key={al.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800/60 bg-slate-50 dark:bg-slate-950 flex justify-between items-start gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{al.patientName}</h4>
                        <span className="text-[10px] text-slate-500">{al.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 leading-normal">{al.trigger}</p>
                    </div>
                    {!al.acknowledged ? (
                      <button
                        onClick={() => handleAcknowledgeAlarm(al.id, al.patientName)}
                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-[10px] shrink-0"
                      >
                        Acknowledge
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded-lg">Acknowledged</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. Telehealth Checklist with Call Dialer Stopwatch */}
          {activeOverlay === 'follow-ups' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Perform telehealth calls to check on patient medication compliance and cardiac rehab:</p>
              <div className="space-y-3">
                {followups.map((f) => (
                  <div key={f.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 flex justify-between items-center gap-3">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{f.patientName}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{f.reason}</p>
                      <span className="text-[10px] font-mono text-slate-400">{f.phone} • {f.type}</span>
                    </div>
                    {f.status === 'Completed' ? (
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-lg">Completed</span>
                    ) : (
                      <button
                        onClick={() => handleStartCall(f.id, f.patientName)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-[10px] flex items-center gap-1 transition-all"
                      >
                        <Phone className="w-3.5 h-3.5" /> Call Dialer
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. Hospital Resource Bed Map Layout */}
          {activeOverlay === 'hospital-overview' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">Real-time resource capacity metrics for DOCO Medical Center:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 space-y-2">
                  <h4 className="text-xs font-bold flex items-center gap-1 text-red-500">
                    <BedDouble className="w-4 h-4" /> Cardiology ICU Beds
                  </h4>
                  <div className="text-2xl font-black font-mono">{hospitalOverview.cardiologyBeds}</div>
                  <span className="text-[10px] text-slate-400 block">Critical care monitoring reserved.</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: `${hospitalOverview.icuOccupancy}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 space-y-2">
                  <h4 className="text-xs font-bold flex items-center gap-1 text-blue-600 dark:text-blue-400">
                    <Activity className="w-4 h-4" /> Ventilators In Use
                  </h4>
                  <div className="text-2xl font-black font-mono">{hospitalOverview.ventilatorsInUse} / 10</div>
                  <span className="text-[10px] text-slate-400 block">Mechanical respiratory systems available.</span>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full animate-pulse" style={{ width: `${(hospitalOverview.ventilatorsInUse / 10) * 100}%` }} />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 space-y-2">
                  <h4 className="text-xs font-bold flex items-center gap-1 text-slate-800 dark:text-slate-200">
                    <Users className="w-4 h-4" /> Active Staff on Shift
                  </h4>
                  <div className="text-2xl font-black font-mono">{hospitalOverview.activeStaff} / 28</div>
                  <span className="text-[10px] text-slate-400 block">Physicians, practitioners, and CCU nurses on roster.</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 space-y-2">
                  <h4 className="text-xs font-bold flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                    <Clock className="w-4 h-4" /> Door-to-Balloon Time
                  </h4>
                  <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">{hospitalOverview.averageDoorToBalloon}</div>
                  <span className="text-[10px] text-slate-400 block">Average stenting latency. National target: &lt; 90m.</span>
                </div>
              </div>
            </div>
          )}

          {/* 7. Quick Action Meds Form */}
          {activeOverlay === 'quick-action-med' && (
            <form onSubmit={handlePrescribeSubmit} className="space-y-4 text-xs font-semibold">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Issue a secure digital medication prescription sent to local pharmacist logs:</p>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patient Selection</label>
                <select
                  value={medPatient}
                  onChange={(e) => setMedPatient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                >
                  <option value="Robert Miller">Robert Miller (Hypertension)</option>
                  <option value="Eleanor Vance">Eleanor Vance (Post-MI CAD)</option>
                  <option value="Marcus Thompson">Marcus Thompson (Diabetes/Lipidemia)</option>
                  <option value="Clara Oswald">Clara Oswald (POTS Dysautonomia)</option>
                  <option value="Harvey Dent">Harvey Dent (Dilated Cardiomyopathy)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={(e) => setMedName(e.target.value)}
                    placeholder="e.g. Atorvastatin Succinate"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Dosage & Frequency</label>
                  <input
                    type="text"
                    required
                    value={medDose}
                    onChange={(e) => setMedDose(e.target.value)}
                    placeholder="e.g. 20mg once daily"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1 shadow-md"
              >
                <CheckCircle className="w-4 h-4" /> Issue Secure Electronic Rx
              </button>
            </form>
          )}

          {/* 8. Quick Action Labs Form */}
          {activeOverlay === 'quick-action-lab' && (
            <form onSubmit={handleLabSubmit} className="space-y-4 text-xs font-semibold">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium font-sans">Request a clinical laboratory evaluation panel and dispatch diagnostics:</p>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patient Selection</label>
                <select
                  value={labPatient}
                  onChange={(e) => setLabPatient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                >
                  <option value="Clara Oswald">Clara Oswald</option>
                  <option value="Robert Miller">Robert Miller</option>
                  <option value="Harvey Dent">Harvey Dent</option>
                  <option value="Eleanor Vance">Eleanor Vance</option>
                  <option value="Marcus Thompson">Marcus Thompson</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Evaluation Type</label>
                  <select
                    value={labType}
                    onChange={(e) => setLabType(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                  >
                    <option value="Lipid Panel & HbA1c">Lipid Panel & HbA1c</option>
                    <option value="STAT Troponin & BMP">STAT Troponin & BMP (Cardiac)</option>
                    <option value="12-Lead Ambulatory EKG">12-Lead Ambulatory EKG</option>
                    <option value="Continuous Telemetry Audit">Continuous Telemetry Audit</option>
                    <option value="Echocardiography Report">Echocardiography Report</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clinical Urgency</label>
                  <select
                    value={labUrgency}
                    onChange={(e) => setLabUrgency(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                  >
                    <option value="Routine">Routine (24h turnaround)</option>
                    <option value="Urgent">Urgent (4h turnaround)</option>
                    <option value="STAT">STAT (Immediate emergency)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1 shadow-md"
              >
                <Check className="w-4 h-4" /> Request Laboratory Panel Order
              </button>
            </form>
          )}

          {/* 9. Quick Action Emergency CCU Admission Form */}
          {activeOverlay === 'quick-action-admit' && (
            <form onSubmit={handleAdmitSubmit} className="space-y-4 text-xs font-semibold">
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Coordinate emergency admittance to high-risk observation units:</p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Vulnerable Patient</label>
                <select
                  value={admitPatient}
                  onChange={(e) => setAdmitPatient(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                >
                  <option value="Harvey Dent">Harvey Dent (Decompensated Heart Failure)</option>
                  <option value="Robert Miller">Robert Miller (Hypertensive Warning)</option>
                  <option value="Clara Oswald">Clara Oswald (POTS Syncope High-Risk)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Clinical Target Ward</label>
                <select
                  value={admitUnit}
                  onChange={(e) => setAdmitUnit(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600"
                >
                  <option value="Cardiology ICU">Cardiology Intensive Care (ICU Bed 8)</option>
                  <option value="Coronary Care CCU">Coronary Care Unit (CCU Ward B)</option>
                  <option value="Preventative Care Wing">Preventative Cardiology Ward</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Admission Diagnosis & Directives</label>
                <textarea
                  required
                  rows={3}
                  value={admitReason}
                  onChange={(e) => setAdmitReason(e.target.value)}
                  placeholder="e.g. Severe dyspnea secondary to ADHF. Administer IV Furosemide 40mg and monitor pulmonary edema."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs outline-none focus:border-blue-600 resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1 shadow-md shadow-red-500/10"
              >
                <AlertTriangle className="w-4 h-4" /> Issue Emergency Ward Admission
              </button>
            </form>
          )}

          {/* 10. Audit log timeline audit */}
          {activeOverlay === 'activity-audit' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-bold">Chronological EHR Audit Logs</span>
                <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">HIPAA Secure Log</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-[11px] font-mono leading-normal max-h-64 overflow-y-auto space-y-3.5">
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">07:30 AM</span> • SYSTEM SYNC: Synchronized 18 records with regional HL7 database. Safe certificate #D-82346.
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">08:15 AM</span> • CONSULTATION CHECKLIST: Initialized telemetry ward warning logs for Harvey Dent (NYHA III).
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">08:30 AM</span> • PATIENT VISIT: Completed evaluation of Eleanor Vance. Left radial stenting access fully resolved.
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">09:45 AM</span> • PHARMACY DISPATCH: Electronically transmitted Metoprolol Rx for Eleanor Vance.
                </div>
                <div>
                  <span className="text-blue-600 dark:text-blue-400 font-bold">10:15 AM</span> • TELEMETRY ALARM: Acknowledged postural pulse spike alert (124 bpm) for Clara Oswald POTS check.
                </div>
              </div>
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
