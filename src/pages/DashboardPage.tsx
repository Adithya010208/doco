import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Calendar, Clock, Award, TrendingUp, AlertTriangle, 
  ArrowRight, HeartPulse, Activity, UserPlus, Check, X,
  ShieldAlert, Sparkles, BedDouble, Shield, RefreshCw, Layers,
  Cloud, Mic, QrCode, CalendarCheck, Camera, Search, User
} from 'lucide-react';
import { Patient, Appointment } from '../types';
import { mockPatients } from '../mockData';

// Modular Component Imports
import InteractiveCharts from '../components/InteractiveCharts';
import HybridAiSandbox from '../components/HybridAiSandbox';
import DashboardOverlays from '../components/DashboardOverlays';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onSelectPatient: (patient: Patient) => void;
  onStartConsultation: (patient: Patient, autoRecord?: boolean) => void;
  appointments: Appointment[];
  setAppointments: Dispatch<SetStateAction<Appointment[]>>;
}

export default function DashboardPage({ 
  onNavigate, 
  onSelectPatient,
  onStartConsultation,
  appointments,
  setAppointments
}: DashboardPageProps) {
  
  // 1. STATE: Active Modal Overlay state
  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);

  // Custom Consultation Initiation States
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);
  const [consultationStep, setConsultationStep] = useState<'options' | 'scanning' | 'manual'>('options');
  const [scanStatus, setScanStatus] = useState<'idle' | 'searching' | 'processing' | 'found'>('idle');
  const [scannedPatient, setScannedPatient] = useState<Patient | null>(null);
  const [manualSearchQuery, setManualSearchQuery] = useState('');
  const [scanProgress, setScanProgress] = useState(0);

  // 2. STATE: Patients Waiting Queue State (Lobby Queue)
  const [waitingQueue, setWaitingQueue] = useState([
    { id: 'wq-1', patientName: 'Clara Oswald', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150', waitTime: 12, triage: 'Standard', room: 'Exam Room 3', condition: 'POTS Pulse Spike check', triageColor: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' },
    { id: 'wq-2', patientName: 'Robert Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150', waitTime: 5, triage: 'Urgent', room: 'Exam Room 1', condition: 'Post-adjustment EKG review', triageColor: 'border-amber-500/20 bg-amber-500/5 text-amber-600 dark:text-amber-400' },
    { id: 'wq-3', patientName: 'Harvey Dent', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150', waitTime: 25, triage: 'Critical', room: 'Triage Room B', condition: 'Acute congestive failure evaluation', triageColor: 'border-red-500/20 bg-red-500/5 text-red-500' }
  ]);

  // 3. STATE: Follow-up Telehealth Checklist due today
  const [followups, setFollowups] = useState([
    { id: 'fu-1', patientName: 'Marcus Thompson', reason: 'Review blood glucose and cholesterol lab results', phone: '+1 (555) 456-7890', status: 'Pending', type: 'Lab Review' },
    { id: 'fu-2', patientName: 'Robert Miller', reason: 'Phone check-in on adjusted Lisinopril tolerance', phone: '+1 (555) 123-4567', status: 'Pending', type: 'Medication Check' },
    { id: 'fu-3', patientName: 'Eleanor Vance', reason: 'Cardiac rehabilitation progress check-in', phone: '+1 (555) 987-6543', status: 'Completed', type: 'Rehab Follow-up' }
  ]);

  // 4. STATE: Critical Telemetry Alerts
  const [alerts, setAlerts] = useState([
    { id: 'alt-1', patientName: 'Harvey Dent', trigger: 'Fluid retention warning: Daily weight spike +5.2 lbs in 48h. NYHA Class III-IV.', time: '10 mins ago', severity: 'Critical', acknowledged: false },
    { id: 'alt-2', patientName: 'Clara Oswald', trigger: 'Standing heart rate biometric warning: exceeded 125 bpm.', time: '1 hour ago', severity: 'High', acknowledged: false },
    { id: 'alt-3', patientName: 'Robert Miller', trigger: 'Telemetry Warning: Systolic blood pressure at 155/90 mmHg (baseline 135/80).', time: '4 hours ago', severity: 'Moderate', acknowledged: true }
  ]);

  // 5. STATE: Hospital Resource Overview Map
  const [hospitalOverview, setHospitalOverview] = useState({
    icuOccupancy: 80,
    ventilatorsInUse: 6,
    activeStaff: 24,
    cardiologyBeds: '8/10',
    averageDoorToBalloon: '42 mins',
    erCongestion: 'Busy',
  });

  // 6. STATE: Dynamic Timeline Actions (Recent Activity Timeline)
  const [timeline, setTimeline] = useState([
    { id: 'act-1', time: '10:45 AM', type: 'AI' as const, message: 'Optimized AI compiled clinical transcription to structured SOAP summary format for Clara Oswald.', patient: 'Clara Oswald', details: 'Transcribed 14-minute dialog. De-identified and exported safely.' },
    { id: 'act-2', time: '10:15 AM', type: 'Medication' as const, message: 'Electronically transmitted Metoprolol Rx for Eleanor Vance to clinic pharmacy.', patient: 'Eleanor Vance', details: 'Dose: 25mg QD. Managed radial catheter access healing. Verified compliance.' },
    { id: 'act-3', time: '09:42 AM', type: 'System' as const, message: 'DOCO Cloud Sync completed successfully with central regional databases.', patient: 'System', details: 'Synchronized 18 patient files, 4 laboratory reports, and 2 EKG charts.' },
    { id: 'act-4', time: '08:30 AM', type: 'Consultation' as const, message: 'Conducted 6-week post-PCI clinical evaluation for Eleanor Vance.', patient: 'Eleanor Vance', details: 'Auscultated chest, radial entry site inspection. Fully closed.' }
  ]);

  // Method to append live actions from any sub-component / overlay
  const handleAddTimelineActivity = (newActivity: {
    type: 'AI' | 'Medication' | 'System' | 'Consultation';
    message: string;
    patient: string;
    details: string;
  }) => {
    const formattedTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    setTimeline(prev => [
      {
        id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        time: formattedTime,
        ...newActivity
      },
      ...prev
    ]);
  };

  // 1. QR Code Scanning Simulation logic
  useEffect(() => {
    let interval: any;
    if (isConsultationModalOpen && consultationStep === 'scanning' && scanStatus === 'searching') {
      interval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            // Select random patient (exclude dummy system ones, pick from actual patient list)
            const availablePatients = mockPatients.filter(p => p.id.startsWith('pat-'));
            const randomPatient = availablePatients[Math.floor(Math.random() * availablePatients.length)];
            setScannedPatient(randomPatient);
            setScanStatus('found');
            handleAddTimelineActivity({
              type: 'System',
              message: `Scanned LifeQR code successfully. Fetched patient files.`,
              patient: randomPatient.name,
              details: `Decrypted patient ID: ${randomPatient.id}. Synced clinical telemetry profile.`
            });
            return 100;
          }
          return prev + 10;
        });
      }, 120);
    }
    return () => clearInterval(interval);
  }, [isConsultationModalOpen, consultationStep, scanStatus]);

  // 2. Auto-Navigate and Start Consultation after QR scan
  useEffect(() => {
    let timeout: any;
    if (isConsultationModalOpen && scanStatus === 'found' && scannedPatient) {
      timeout = setTimeout(() => {
        setIsConsultationModalOpen(false);
        onStartConsultation(scannedPatient, true); // true sets autoStartRecording!
      }, 2000); // 2 seconds confirmation screen
    }
    return () => clearTimeout(timeout);
  }, [isConsultationModalOpen, scanStatus, scannedPatient]);

  // Filter today's appointments
  const todaysAppointments = appointments.filter(a => a.date === '2026-07-03');
  const pendingVisits = todaysAppointments.filter(a => a.status === 'Scheduled' || a.status === 'Waiting' || a.status === 'Consulting');
  const completedVisits = todaysAppointments.filter(a => a.status === 'Completed');

  // Animation constants for entry stagger
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="space-y-6">
      {/* Clinician Greeting & Live Operational Banner */}
      <div className="bg-gradient-to-r from-[#003B73] via-[#007198] to-[#00a8cc] p-8 md:p-10 rounded-[32px] relative overflow-hidden shadow-lg border border-slate-100/10">
        {/* Ambient glow backgrounds */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-4">
            {/* Simulated Date Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 text-white border border-white/15 backdrop-blur-sm shadow-sm select-none w-fit">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-pulse" />
              <span>Friday, July 3, 2026</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                Welcome back, Aditi 👋
              </h2>
              <p className="text-cyan-50/90 text-sm md:text-base max-w-xl leading-relaxed font-medium">
                You have <strong className="text-white font-extrabold">18 appointments</strong> today. 2 critical alerts need your attention.
              </p>
            </div>

            {/* Bottom buttons inside the banner */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => {
                  setIsConsultationModalOpen(true);
                  setConsultationStep('options');
                  setScanStatus('idle');
                  setScannedPatient(null);
                  setScanProgress(0);
                }}
                className="px-5 py-3 bg-white hover:bg-cyan-50 text-[#006f8e] font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-md shadow-slate-900/10 cursor-pointer"
              >
                <Mic className="w-4 h-4 text-cyan-600" />
                <span>Start Consultation</span>
              </button>
              <button
                onClick={() => {
                  setIsConsultationModalOpen(true);
                  setConsultationStep('scanning');
                  setScanStatus('searching');
                  setScannedPatient(null);
                  setScanProgress(0);
                }}
                className="px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/20 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 backdrop-blur-sm cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-cyan-200" />
                <span>Scan LifeQR</span>
              </button>
            </div>
          </div>

          {/* Right Side Glass Card (Hybrid AI Status) */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl text-white max-w-sm w-full lg:w-80 shrink-0 shadow-lg">
            <div className="flex items-center gap-2 text-white/80">
              <Cloud className="w-4 h-4 text-cyan-200 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-wider">Hybrid AI Status</span>
            </div>
            
            <div className="mt-3 flex items-center gap-3">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
              </span>
              <h3 className="text-xl font-black tracking-tight text-white">
                Cloud AI • Connected
              </h3>
            </div>

            <p className="mt-4 text-[10px] text-cyan-100/70 font-mono leading-relaxed">
              Latency 42 ms · Region: ap-south-1 · Model: DOCO-Med v3
            </p>
          </div>
        </div>
      </div>

      {/* EXECUTIVE KPI BENTO GRID (Clickable Cards) */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-5 gap-4"
      >
        {/* KPI 1: Today's Appointments */}
        <motion.div
          id="kpi-card-appointments"
          variants={itemVariants}
          onClick={() => setActiveOverlay('today-appointments')}
          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:border-[#00a8cc] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-40"
        >
          <div className="bg-blue-500/10 text-blue-600 dark:text-blue-400 p-2.5 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white leading-none tracking-tight">
              {todaysAppointments.length || 18}
            </h3>
            <p className="text-[11px] font-bold text-slate-550 dark:text-slate-400 mt-2 leading-none">
              Today's Appointments
            </p>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 block">
              +12%
            </span>
          </div>
        </motion.div>

        {/* KPI 2: Patients Waiting */}
        <motion.div
          id="kpi-card-waiting"
          variants={itemVariants}
          onClick={() => setActiveOverlay('patients-waiting')}
          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:border-[#00a8cc] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-40"
        >
          <div className="bg-amber-500/10 text-amber-500 p-2.5 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white leading-none tracking-tight">
              {waitingQueue.length || 8}
            </h3>
            <p className="text-[11px] font-bold text-slate-550 dark:text-slate-400 mt-2 leading-none">
              Patients Waiting
            </p>
            <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mt-1 block animate-pulse">
              LIVE
            </span>
          </div>
        </motion.div>

        {/* KPI 3: Completed */}
        <motion.div
          id="kpi-card-completed"
          variants={itemVariants}
          onClick={() => setActiveOverlay('completed-consultations')}
          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:border-[#00a8cc] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-40"
        >
          <div className="bg-emerald-500/10 text-emerald-550 dark:text-emerald-400 p-2.5 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white leading-none tracking-tight">
              {completedVisits.length || 3}
            </h3>
            <p className="text-[11px] font-bold text-slate-550 dark:text-slate-400 mt-2 leading-none">
              Completed
            </p>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 block">
              +3
            </span>
          </div>
        </motion.div>

        {/* KPI 4: Critical Alerts */}
        <motion.div
          id="kpi-card-alerts"
          variants={itemVariants}
          onClick={() => setActiveOverlay('critical-alerts')}
          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:border-[#00a8cc] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-40"
        >
          <div className="bg-rose-500/10 text-rose-500 p-2.5 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white leading-none tracking-tight">
              {alerts.filter(a => !a.acknowledged).length || 2}
            </h3>
            <p className="text-[11px] font-bold text-slate-550 dark:text-slate-400 mt-2 leading-none">
              Critical Alerts
            </p>
            <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest mt-1 block">
              URGENT
            </span>
          </div>
        </motion.div>

        {/* KPI 5: Follow-ups Today */}
        <motion.div
          id="kpi-card-followups"
          variants={itemVariants}
          onClick={() => setActiveOverlay('follow-ups')}
          className="bg-white dark:bg-slate-900 border border-slate-150 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:border-[#00a8cc] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group flex flex-col justify-between h-40 col-span-2 md:col-span-1"
        >
          <div className="bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 p-2.5 rounded-full w-10 h-10 flex items-center justify-center shrink-0">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-3xl font-black text-slate-950 dark:text-white leading-none tracking-tight">
              {followups.filter(f => f.status === 'Pending').length || 4}
            </h3>
            <p className="text-[11px] font-bold text-slate-550 dark:text-slate-400 mt-2 leading-none">
              Follow-ups Today
            </p>
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1 block">
              +2
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* TWO COLUMN WORKSPACE WORKFLOW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT AREA: Clinic Operations & AI Sandbox (Col Span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Interactive Command Analytics Chart */}
          <InteractiveCharts />

          {/* Hybrid AI Status Spec Panels and Prompter Playground */}
          <HybridAiSandbox 
            patients={mockPatients.map(p => ({ id: p.id, name: p.name, condition: p.condition }))}
            onAddTimelineActivity={handleAddTimelineActivity}
          />

          {/* Clinician Recent Action Audit Timeline */}
          <div id="recent-activity-timeline-card" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
              <div>
                <h3 className="text-base font-extrabold text-slate-950 dark:text-white tracking-tight">Recent Activity Timeline</h3>
                <p className="text-[11px] text-slate-500">Live clinical audit trail of diagnostics, prescriptions, and hybrid AI completions</p>
              </div>
              <button 
                onClick={() => setActiveOverlay('activity-audit')}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-500 text-xs font-bold flex items-center gap-1 group"
              >
                <span>Full Audit Log</span> 
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Timeline Nodes */}
            <div className="space-y-4 pt-1">
              {timeline.map((act) => (
                <div key={act.id} className="relative pl-6 pb-2 last:pb-0">
                  {/* Spine connection line */}
                  <div className="absolute left-2.5 top-2 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800/80 last:hidden" />
                  
                  {/* Custom node marker */}
                  <div className="absolute left-1 top-2.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-500/10" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">{act.time}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        act.type === 'AI' 
                          ? 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                          : act.type === 'Medication' 
                          ? 'bg-blue-500/10 text-blue-600' 
                          : act.type === 'System' 
                          ? 'bg-emerald-500/10 text-emerald-600' 
                          : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        {act.type}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{act.message}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{act.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT AREA: Critical Observational Watch, Hospital overview & Actions (Col Span 1) */}
        <div className="space-y-6">
          
          {/* Hospital Overview (Clickable Bed Occupancy) */}
          <div 
            id="hospital-overview-card"
            onClick={() => setActiveOverlay('hospital-overview')}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:border-blue-500/40 hover:-translate-y-0.5 transition-all cursor-pointer group space-y-4"
          >
            <div>
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Resource Status</h3>
              <h4 className="text-base font-bold text-slate-950 dark:text-white tracking-tight mt-0.5">Hospital Operations</h4>
            </div>

            <div className="space-y-3">
              {/* ICU bed occupancy meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Cardiology ICU Bed Cap</span>
                  <span className="text-red-500 font-mono">{hospitalOverview.cardiologyBeds} filled</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800/40">
                  <div className="bg-red-500 h-full rounded-full transition-all duration-300" style={{ width: `${hospitalOverview.icuOccupancy}%` }} />
                </div>
              </div>

              {/* Ventilator occupancy meter */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span>Ventilators In Use</span>
                  <span className="text-blue-600 dark:text-blue-400 font-mono">{hospitalOverview.ventilatorsInUse} / 10 active</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-100 dark:border-slate-800/40">
                  <div className="bg-blue-600 h-full rounded-full transition-all duration-300 animate-pulse" style={{ width: `${(hospitalOverview.ventilatorsInUse / 10) * 100}%` }} />
                </div>
              </div>
            </div>

            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mt-1">Click to view CCU layouts & reserve beds ➜</span>
          </div>

          {/* Clinician Quick Action Cards (Modular overlays) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-3.5">
            <div>
              <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Action Hub</h3>
              <h4 className="text-base font-bold text-slate-950 dark:text-white tracking-tight mt-0.5">Quick Action Panels</h4>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                onClick={() => setActiveOverlay('quick-action-med')}
                className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 dark:bg-slate-950 dark:hover:bg-blue-600 border border-slate-150 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 hover:text-white font-bold rounded-2xl text-xs flex items-center justify-between px-4 transition-all group"
              >
                <span>Prescribe Medication</span>
                <span className="text-blue-600 dark:text-blue-400 group-hover:text-white font-mono">➜</span>
              </button>

              <button
                onClick={() => setActiveOverlay('quick-action-lab')}
                className="w-full py-2.5 bg-slate-50 hover:bg-blue-600 dark:bg-slate-950 dark:hover:bg-blue-600 border border-slate-150 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 hover:text-white font-bold rounded-2xl text-xs flex items-center justify-between px-4 transition-all group"
              >
                <span>Request Lab Panel Order</span>
                <span className="text-blue-600 dark:text-blue-400 group-hover:text-white font-mono">➜</span>
              </button>

              <button
                onClick={() => setActiveOverlay('quick-action-admit')}
                className="w-full py-2.5 bg-slate-50 hover:bg-red-600 dark:bg-slate-950 dark:hover:bg-red-600 border border-slate-150 dark:border-slate-800/60 text-slate-800 dark:text-slate-200 hover:text-white font-bold rounded-2xl text-xs flex items-center justify-between px-4 transition-all group"
              >
                <span>Direct Emergency CCU Admit</span>
                <span className="text-red-500 group-hover:text-white font-mono">➜</span>
              </button>
            </div>
          </div>

          {/* Critical Patients Observation watchlist */}
          <div 
            id="watchlist-alerts-card"
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-slate-150 dark:border-slate-800/60">
              <AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
              <div>
                <h3 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">High Risk Watch</h3>
                <h4 className="text-base font-bold text-slate-950 dark:text-white tracking-tight">Active Telemetry Alarms</h4>
              </div>
            </div>

            <div className="space-y-3.5">
              {alerts.filter(a => !a.acknowledged).slice(0, 2).map((al) => (
                <div 
                  key={al.id} 
                  onClick={() => setActiveOverlay('critical-alerts')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-800/40 cursor-pointer transition-all group space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold text-red-500 uppercase tracking-wider block font-mono">⚠️ {al.severity} Severity</span>
                    <span className="text-[10px] text-slate-400 font-bold">{al.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {al.patientName}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">{al.trigger}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveOverlay('critical-alerts')}
              className="w-full py-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900 border border-slate-150 dark:border-slate-800/40 text-slate-700 dark:text-slate-300 font-bold rounded-2xl text-xs flex justify-center items-center gap-1.5 transition-all"
            >
              Open Live Telemetry Waveforms <HeartPulse className="w-3.5 h-3.5 text-red-500" />
            </button>
          </div>

          {/* Clinical Guidelines / Decision Support Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 border border-slate-800 text-white p-6 rounded-3xl relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl" />
            <HeartPulse className="w-8 h-8 text-blue-400 mb-4 animate-pulse" />
            <h4 className="text-sm font-extrabold text-white tracking-tight uppercase">Clinical Decision Support</h4>
            <p className="text-slate-400 text-[11px] leading-relaxed mt-2 font-sans">
              For patients exhibiting acute heart failure signs, secure continuous telemetry logs first, confirm blood potassium, and trigger local clinical pathways if ejection fraction falls below 40%.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>Guideline ID: HF-2026</span>
              <span className="text-blue-400 font-bold hover:underline cursor-pointer">Protocol PDF</span>
            </div>
          </div>

        </div>

      </div>

      {/* DASHBOARD MODAL OVERLAYS */}
      <DashboardOverlays 
        activeOverlay={activeOverlay}
        onClose={() => setActiveOverlay(null)}
        waitingQueue={waitingQueue}
        setWaitingQueue={setWaitingQueue}
        followups={followups}
        setFollowups={setFollowups}
        alerts={alerts}
        setAlerts={setAlerts}
        hospitalOverview={hospitalOverview}
        setHospitalOverview={setHospitalOverview}
        onAddTimelineActivity={handleAddTimelineActivity}
        onNavigate={onNavigate}
        onSelectPatient={(p) => {
          // Cross link patient profiles safely
          const fullPat = mockPatients.find(mockP => mockP.name === p.name || mockP.id === p.id);
          if (fullPat) {
            onSelectPatient(fullPat);
          }
        }}
      />

      {/* START CONSULTATION / QR CODE SIMULATOR MODAL */}
      <AnimatePresence>
        {isConsultationModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-center px-6 py-5 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-950/20">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-950 dark:text-white tracking-tight uppercase">Consultation Launchpad</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Verify credentials & register session</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsConsultationModalOpen(false)}
                  className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6">
                {consultationStep === 'options' && (
                  <div className="space-y-4">
                    <p className="text-slate-500 dark:text-slate-400 text-xs text-center pb-2 leading-relaxed">
                      Before beginning the clinic voice synthesis diagnostic tracker, please verify the patient identity either by scanning their LifeQR band or entering manually.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Scan QR Option */}
                      <button
                        onClick={() => {
                          setConsultationStep('scanning');
                          setScanStatus('searching');
                          setScanProgress(0);
                        }}
                        className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-cyan-50/40 to-cyan-500/[0.02] dark:from-cyan-950/20 dark:to-cyan-950/[0.02] border border-cyan-100 dark:border-cyan-900/30 hover:border-cyan-400 rounded-3xl transition-all group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-cyan-100/50 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <QrCode className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Scan Patient QR</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">Simulate QR scanning to fetch ID automatically</p>
                      </button>

                      {/* Manual Option */}
                      <button
                        onClick={() => {
                          setConsultationStep('manual');
                          setManualSearchQuery('');
                        }}
                        className="flex flex-col items-center text-center p-6 bg-gradient-to-b from-indigo-50/40 to-indigo-500/[0.02] dark:from-indigo-950/20 dark:to-indigo-950/[0.02] border border-indigo-100 dark:border-indigo-900/30 hover:border-indigo-400 rounded-3xl transition-all group cursor-pointer"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-indigo-100/50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                          <Users className="w-6 h-6" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-950 dark:text-white mb-1">Select Manually</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">Select a patient directly from the clinic directory</p>
                      </button>
                    </div>
                  </div>
                )}

                {consultationStep === 'scanning' && (
                  <div className="space-y-6">
                    {/* Viewfinder simulation container */}
                    <div className="relative w-full aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 flex flex-col items-center justify-center shadow-inner">
                      
                      {/* Grid lines pattern */}
                      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />

                      {/* Corner viewfinder brackets */}
                      <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                      <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                      <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                      <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                      {/* Sweeping Laser Line */}
                      {scanStatus === 'searching' && (
                        <div className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_12px_#22d3ee] animate-bounce" />
                      )}

                      {/* Inner Scan Target */}
                      <div className="relative z-10 flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 rounded-2xl border-2 border-cyan-400/30 flex items-center justify-center bg-cyan-950/40 backdrop-blur-sm">
                          <QrCode className={`w-8 h-8 text-cyan-400 ${scanStatus === 'searching' ? 'animate-pulse' : ''}`} />
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">
                          {scanStatus === 'searching' ? 'Target Lock Seeking...' : 'Identity Decrypted ✓'}
                        </span>
                      </div>

                      {/* Tech Telemetry Overlay */}
                      <div className="absolute bottom-3 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-slate-500">
                        <span>SYS: OPT-DIS-2026</span>
                        <span>FPS: 60.00</span>
                      </div>
                    </div>

                    {/* Progress details */}
                    <div className="space-y-3">
                      {scanStatus === 'searching' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <RefreshCw className="w-3.5 h-3.5 text-cyan-500 animate-spin" />
                              Scanning simulated LifeQR bracelet...
                            </span>
                            <span>{scanProgress}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-cyan-500 transition-all duration-150"
                              style={{ width: `${scanProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-emerald-500/5 border border-emerald-500/15 rounded-2xl space-y-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <h5 className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">PATIENT ENCRYPTED LEDGER VERIFIED</h5>
                              <p className="text-[10px] text-slate-400">Auto-loading record context to DOCO core</p>
                            </div>
                          </div>

                          {scannedPatient && (
                            <div className="flex items-center gap-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800/80">
                              <img 
                                src={scannedPatient.avatar} 
                                alt={scannedPatient.name} 
                                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/10"
                              />
                              <div className="flex-1 min-w-0">
                                <h6 className="text-xs font-black text-slate-950 dark:text-white leading-tight truncate">{scannedPatient.name}</h6>
                                <span className="text-[10px] text-slate-400 font-bold block uppercase mt-0.5">
                                  ID: {scannedPatient.id} • {scannedPatient.age} y/o • {scannedPatient.gender}
                                </span>
                              </div>
                              <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 uppercase tracking-wide">
                                Active Queue
                              </span>
                            </div>
                          )}

                          <p className="text-[10px] text-slate-400 text-center font-mono">
                            Auto-starting consultation in 2 seconds...
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {consultationStep === 'manual' && (
                  <div className="space-y-4">
                    {/* Search bar */}
                    <div className="relative">
                      <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search patient by name, ID or symptom..."
                        value={manualSearchQuery}
                        onChange={(e) => setManualSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>

                    {/* Scrollable list */}
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {mockPatients
                        .filter(p => p.id.startsWith('pat-') && (
                          p.name.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
                          p.id.toLowerCase().includes(manualSearchQuery.toLowerCase()) ||
                          p.condition.toLowerCase().includes(manualSearchQuery.toLowerCase())
                        ))
                        .map(patient => (
                          <div
                            key={patient.id}
                            onClick={() => {
                              setIsConsultationModalOpen(false);
                              onStartConsultation(patient, true); // true starts recording automatically
                            }}
                            className="flex items-center justify-between p-3.5 bg-slate-50 hover:bg-blue-500/5 dark:bg-slate-950/40 dark:hover:bg-blue-950/20 border border-slate-100 dark:border-slate-800/40 rounded-2xl cursor-pointer transition-all group"
                          >
                            <div className="flex items-center gap-3">
                              <img 
                                src={patient.avatar} 
                                alt={patient.name} 
                                className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800/80"
                              />
                              <div>
                                <h5 className="text-xs font-black text-slate-950 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                  {patient.name}
                                </h5>
                                <span className="text-[9px] text-slate-400 font-bold block uppercase mt-0.5">
                                  {patient.id} • {patient.gender}, {patient.age} y/o
                                </span>
                              </div>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] font-extrabold text-slate-600 dark:text-slate-300 block">
                                {patient.condition}
                              </span>
                              <span className="text-[8px] text-slate-400 uppercase tracking-wider block mt-0.5">
                                Last Visit: {patient.lastVisit}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Back Button */}
                    <button
                      onClick={() => setConsultationStep('options')}
                      className="w-full py-2.5 text-center text-xs font-bold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
                    >
                      ← Back to Options
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
