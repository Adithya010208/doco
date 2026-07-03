/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  QrCode, AlertTriangle, ShieldCheck, HeartPulse, User, Phone, 
  Clock, Shield, Plus, PlusCircle, Activity, ClipboardList, CheckCircle, 
  RotateCcw, Sparkles, Send, Volume2, VolumeX, Eye, Info, Search, FileText,
  UserCheck, MapPin, Skull, Droplets, Camera, Wifi, History, Lock
} from 'lucide-react';
import { Patient } from '../types';

interface LifeQrPageProps {
  patients: Patient[];
  onNavigateToPatient?: (patient: Patient) => void;
}

interface ScanHistoryItem {
  id: string;
  patientName: string;
  patientId: string;
  avatar: string;
  timestamp: string;
  status: 'Critical' | 'Stable' | 'Under Observation';
  bloodType: string;
}

interface EmergencyTimelineEvent {
  id: string;
  status: string;
  timestamp: string;
  description: string;
  author: string;
}

export default function LifeQrPage({ patients, onNavigateToPatient }: LifeQrPageProps) {
  // Preset Patients for Simulation including a John Doe
  const emergencyPresets = [
    {
      id: 'pat-002',
      name: 'Eleanor Vance',
      age: 45,
      gender: 'Female',
      bloodType: 'O-',
      condition: 'Post-Myocardial Infarction / Sudden Syncope',
      status: 'Critical',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      allergies: ['Aspirin (Mild GI distress)', 'Contrast dye'],
      chronicDiseases: ['Coronary Artery Disease (CAD)', 'Prior MI with LAD stent (2026)'],
      currentMedications: [
        'Metoprolol Succinate 25mg QD',
        'Clopidogrel (Plavix) 75mg QD',
        'Aspirin Enteric Coated 81mg QD'
      ],
      emergencyContacts: [
        { name: 'Thomas Vance', relationship: 'Husband', phone: '+1 (555) 987-6544' }
      ],
      accessConfirmed: true,
      notes: 'Admitted following sudden syncope at grocery store. High risk of cardiovascular relapse.',
      lifeQrCode: 'DOCO_PAT_002_VANCE_EMERGENCY_SECURE'
    },
    {
      id: 'pat-001',
      name: 'Robert Miller',
      age: 64,
      gender: 'Male',
      bloodType: 'A+',
      condition: 'Hypertensive Emergency & Arrhythmia Flare-up',
      status: 'Under Observation',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      allergies: ['Penicillin', 'Peanuts', 'Sulfa drugs'],
      chronicDiseases: ['Chronic Stage 2 Hypertension', 'Mild Arrhythmia / Premature Ventricular Contractions'],
      currentMedications: [
        'Lisinopril 20mg QD',
        'Atorvastatin 20mg QD'
      ],
      emergencyContacts: [
        { name: 'Linda Miller', relationship: 'Spouse', phone: '+1 (555) 123-4568' }
      ],
      accessConfirmed: false,
      notes: 'Systolic blood pressure measured at 185 mmHg by paramedics on scene.',
      lifeQrCode: 'DOCO_PAT_001_MILLER_EMERGENCY_SECURE'
    },
    {
      id: 'pat-003',
      name: 'Marcus Thompson',
      age: 52,
      gender: 'Male',
      bloodType: 'B+',
      condition: 'Diabetic Ketoacidosis Suspect',
      status: 'Stable',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      allergies: ['None Declared'],
      chronicDiseases: ['Type 2 Diabetes Mellitus', 'Hyperlipidemia', 'Metabolic Syndrome'],
      currentMedications: [
        'Metformin HCl 1000mg BID',
        'Atorvastatin 20mg QD'
      ],
      emergencyContacts: [
        { name: 'Sarah Thompson', relationship: 'Daughter', phone: '+1 (555) 456-7891' }
      ],
      accessConfirmed: true,
      notes: 'Glucose level measured 280 mg/dL by EMS on arrival.',
      lifeQrCode: 'DOCO_PAT_003_THOMPSON_EMERGENCY_SECURE'
    },
    {
      id: 'pat-doe',
      name: 'John Doe (Unresponsive)',
      age: 35, // Estimated
      gender: 'Male',
      bloodType: 'AB- (Triage Typed)',
      condition: 'Trauma / Intracranial Hemorrhage Suspect',
      status: 'Critical',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150', // Gray placeholder face
      allergies: ['Unknown - Patient Unresponsive'],
      chronicDiseases: ['Unknown - Trauma Ward Admission'],
      currentMedications: ['Unknown'],
      emergencyContacts: [
        { name: 'Trauma Coordinator', relationship: 'Staff Duty Officer', phone: '+1 (555) 911-0000' }
      ],
      accessConfirmed: false,
      notes: 'Patient was brought in without ID by ambulance. High-speed motor vehicle collision survivor.',
      lifeQrCode: 'DOCO_PAT_UNKNOWN_DOE_EMERGENCY_SECURE'
    }
  ];

  // Current active scanned patient state (begins with Eleanor Vance pre-loaded for high-fidelity presentation)
  const [activePatient, setActivePatient] = useState<typeof emergencyPresets[0] | null>(emergencyPresets[0]);

  // Scanning simulation states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('pat-002');

  // Interactive recent scans history log
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([
    {
      id: 'scan-1',
      patientName: 'Eleanor Vance',
      patientId: 'pat-002',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      timestamp: 'Today at 08:05 AM',
      status: 'Critical',
      bloodType: 'O-'
    },
    {
      id: 'scan-2',
      patientName: 'Robert Miller',
      patientId: 'pat-001',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
      timestamp: 'Yesterday at 04:12 PM',
      status: 'Under Observation',
      bloodType: 'A+'
    },
    {
      id: 'scan-3',
      patientName: 'Marcus Thompson',
      patientId: 'pat-003',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
      timestamp: '2026-07-01 at 11:22 AM',
      status: 'Stable',
      bloodType: 'B+'
    }
  ]);

  // Hospital Access Confirmation Token Log
  const [isAccessConfirmed, setIsAccessConfirmed] = useState(true);
  const [verifierName, setVerifierName] = useState('Dr. Sarah Chen, MD');
  const [verifierDept, setVerifierDept] = useState('Cardiology ICU');

  // Emergency Clinical Notes & Timeline States
  const [noteText, setNoteText] = useState('');
  const [noteAuthor, setNoteAuthor] = useState('Dr. Sarah Chen, MD');
  
  const [timelineEvents, setTimelineEvents] = useState<EmergencyTimelineEvent[]>([
    {
      id: 'e-1',
      status: 'Emergency Admittance',
      timestamp: '08:00 AM',
      description: 'Patient arrived via ambulance. Triage scale 1 (Immediate). Suspicion of myocardial infarct recurrence.',
      author: 'Medic Captain Rodgers (EMS Unit 14)'
    },
    {
      id: 'e-2',
      status: 'LifeQR Decrypted',
      timestamp: '08:05 AM',
      description: 'Physical LifeQR wristband scanned. EHR emergency profile retrieved. HIPAA access log token #QR-88214 authorized.',
      author: 'Nurse J. Smith, RN'
    },
    {
      id: 'e-3',
      status: 'Clinical Note',
      timestamp: '08:12 AM',
      description: 'Dual antiplatelet therapy confirmed via LifeQR list. Avoiding administration of contraindicated aspirin protocols due to acute severe nausea.',
      author: 'Dr. Sarah Chen, MD'
    }
  ]);

  // Sound generator simulation (Visual/Audio helper)
  const triggerBeepSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1000, ctx.currentTime); // 1KHz beep
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch (e) {
      console.warn('Audio synthesis blocked or unsupported.', e);
    }
  };

  // Perform Simulated Scanning Loop
  const handlePerformScan = (presetId: string) => {
    setIsScanning(true);
    setScanStep('Initializing Optical Hardware...');
    
    // Step 1: hardware link
    setTimeout(() => {
      setScanStep('Detecting Secure NFC & Visual Watermark...');
      triggerBeepSound();
    }, 600);

    // Step 2: reading code
    setTimeout(() => {
      setScanStep('Contacting DOCO Cryptographic Health Ledger...');
    }, 1200);

    // Step 3: Decrypting HIPAA Token
    setTimeout(() => {
      setScanStep('Verifying Institutional Access Token...');
    }, 1800);

    // Final: Resolve Profile
    setTimeout(() => {
      const selectedPatientPreset = emergencyPresets.find(p => p.id === presetId);
      if (selectedPatientPreset) {
        setActivePatient(selectedPatientPreset);
        setIsAccessConfirmed(selectedPatientPreset.accessConfirmed);
        
        // Add to Scan history
        const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const newHistoryItem: ScanHistoryItem = {
          id: `scan-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          patientName: selectedPatientPreset.name,
          patientId: selectedPatientPreset.id,
          avatar: selectedPatientPreset.avatar,
          timestamp: `Today at ${nowStr}`,
          status: selectedPatientPreset.status as any,
          bloodType: selectedPatientPreset.bloodType
        };

        setScanHistory(prev => [newHistoryItem, ...prev.filter(item => item.patientId !== selectedPatientPreset.id)].slice(0, 5));

        // Reset timeline events based on the scanned patient
        const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        setTimelineEvents([
          {
            id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-1`,
            status: 'Emergency Admission',
            timestamp: '08:00 AM',
            description: `Admitted under critical clinical state. Presentation: ${selectedPatientPreset.condition}.`,
            author: 'Triage Nurse'
          },
          {
            id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}-2`,
            status: 'LifeQR Scanned & Decrypted',
            timestamp: formattedTime,
            description: `LifeQR token [${selectedPatientPreset.lifeQrCode}] resolved. Blood Type: ${selectedPatientPreset.bloodType}. Allergies: ${selectedPatientPreset.allergies.join(', ')}.`,
            author: 'Dr. Sarah Chen, MD'
          }
        ]);
      }
      
      setIsScanning(false);
      setScanStep('');
      triggerBeepSound();
    }, 2400);
  };

  // Quick Action Presets for rapid paramedic notes
  const presetClinicalNotes = [
    'IV line secured with 18G cannula. Normal Saline 0.9% running at KVO.',
    '12-Lead ECG completed. Negative for acute ST-elevation.',
    'Supplemental oxygen initiated at 3L/min via nasal cannula. SpO2 stable.',
    'Pre-loaded medications verified against LifeQR contraindications matrix.',
    'Emergency cardiac crash cart positioned in trauma bay.'
  ];

  // Handle Note Logging
  const handleAddClinicalNote = (text: string) => {
    if (!text.trim()) return;

    const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newEvent: EmergencyTimelineEvent = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: 'Clinical Note Added',
      timestamp: formattedTime,
      description: text,
      author: noteAuthor
    };

    setTimelineEvents(prev => [...prev, newEvent]);
    setNoteText('');
  };

  const handleCustomNoteSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleAddClinicalNote(noteText);
  };

  return (
    <div className="space-y-6">
      
      {/* ================= EMERGENCY BRANDING HEADER ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-rose-600 dark:bg-rose-950/40 text-white p-5 rounded-3xl border border-rose-500/20 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest bg-rose-700 dark:bg-rose-900 px-2 py-0.5 rounded-full">
              DOCO Trauma Core v2.4
            </span>
          </div>
          <h2 className="text-xl font-black tracking-tight flex items-center gap-2 mt-1">
            <HeartPulse className="w-5 h-5 text-white animate-pulse" /> Emergency LifeQR Ledger
          </h2>
          <p className="text-rose-100 dark:text-rose-300 text-xs mt-0.5">
            Instantaneous retrieval of medical safety profiles, medication lists, and emergency contacts via HIPAA-encrypted QR protocols
          </p>
        </div>

        {/* Audio simulator toggler */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
            soundEnabled 
              ? 'bg-rose-700 dark:bg-rose-900 text-white border border-rose-500/20 shadow-sm' 
              : 'bg-white/10 hover:bg-white/20 text-rose-100'
          }`}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-300" /> Sound Simulator: ON
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-rose-300" /> Sound Simulator: OFF
            </>
          )}
        </button>
      </div>

      {/* ================= MAIN SPLIT GRID ================= */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        
        {/* ======================================================================
           COLUMN 1: HIGH-TECH SCANNERS & LIVE CAMERA MOCKUP (XL:COL-4)
           ====================================================================== */}
        <div className="xl:col-span-4 space-y-6">
          
          {/* Virtual Camera Viewport Card */}
          <div className="bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden">
            
            {/* Camera Frame Corners Decors */}
            <div className="absolute top-4 left-4 w-5 h-5 border-t-2 border-l-2 border-rose-500" />
            <div className="absolute top-4 right-4 w-5 h-5 border-t-2 border-r-2 border-rose-500" />
            <div className="absolute bottom-4 left-4 w-5 h-5 border-b-2 border-l-2 border-rose-500" />
            <div className="absolute bottom-4 right-4 w-5 h-5 border-b-2 border-r-2 border-rose-500" />

            <div className="flex justify-between items-center mb-3">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1.5 font-mono">
                <Camera className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> SIMULATED CAM FEED
              </span>
              <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
                <Wifi className="w-3 h-3" /> LATENCY: 2ms
              </span>
            </div>

            {/* Simulated QR Video Container */}
            <div className="bg-slate-950 aspect-video rounded-2xl flex flex-col justify-center items-center relative overflow-hidden border border-slate-800/80">
              
              {/* Scan Beam Effect */}
              {isScanning && (
                <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_rgba(239,68,68,1)] animate-bounce z-10" />
              )}

              {/* Grid Background Mock */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />

              {/* Camera Lens Circle with Mock QR */}
              <div className="relative w-28 h-28 border border-slate-800 rounded-2xl bg-slate-900 flex items-center justify-center shadow-inner group">
                
                {/* Embedded QR Symbol Graphic */}
                <QrCode className={`w-20 h-20 transition-all ${
                  isScanning 
                    ? 'text-rose-500 scale-105 opacity-90 blur-[0.5px]' 
                    : 'text-slate-600 scale-100 group-hover:text-slate-400'
                }`} />

                {/* Pulsing target indicators */}
                <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-slate-500" />
                <div className="absolute top-2 right-2 w-3 h-3 border-t border-r border-slate-500" />
                <div className="absolute bottom-2 left-2 w-3 h-3 border-b border-l border-slate-500" />
                <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-slate-500" />
              </div>

              {/* Live HUD telemetry overlays */}
              <div className="absolute bottom-3 left-3 text-[9px] font-mono text-slate-500 space-y-0.5">
                <div>RES: 1080P SDR 60FPS</div>
                <div>FOCUS: AUTO AUTO-LOCK</div>
              </div>
              <div className="absolute bottom-3 right-3 text-[9px] font-mono text-slate-500 space-y-0.5 text-right">
                <div>ISO: 640 SPEED: 1/120s</div>
                <div>LEDGER LINK: SECURE</div>
              </div>

              {/* Scanning status message container */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-slate-950/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center z-20"
                  >
                    <div className="w-10 h-10 rounded-full border-2 border-rose-500 border-t-transparent animate-spin mb-3" />
                    <span className="text-xs font-black text-white font-mono tracking-wide uppercase">
                      Decrypting Medical QR
                    </span>
                    <span className="text-[10px] text-slate-400 mt-1 font-mono">
                      {scanStep}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action Scan Trigger Control */}
            <div className="mt-4 space-y-3">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                  Select Patient Preset to Scan
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {emergencyPresets.map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPresetId(preset.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all text-left truncate flex items-center gap-1.5 ${
                        selectedPresetId === preset.id
                          ? 'bg-rose-600 text-white font-bold ring-2 ring-rose-500/20'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                      }`}
                    >
                      <User className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{preset.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handlePerformScan(selectedPresetId)}
                disabled={isScanning}
                className="w-full py-3 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-800 text-white text-xs font-extrabold rounded-2xl transition-all shadow-md shadow-rose-500/10 flex justify-center items-center gap-2 uppercase tracking-wider"
              >
                <QrCode className="w-4 h-4" /> Trigger Simulated Scan
              </button>
            </div>
          </div>

          {/* Recent Scans ER Log */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl shadow-sm">
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 mb-3">
              <History className="w-4 h-4 text-rose-500" /> Recent emergency Scans
            </h3>

            <div className="space-y-2.5">
              {scanHistory.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    const matchedPreset = emergencyPresets.find(p => p.id === item.patientId);
                    if (matchedPreset) {
                      setActivePatient(matchedPreset);
                      setIsAccessConfirmed(matchedPreset.accessConfirmed);
                    }
                  }}
                  className={`p-3 border rounded-2xl transition-all flex items-center justify-between gap-2 cursor-pointer ${
                    activePatient?.id === item.patientId
                      ? 'border-rose-500 bg-rose-50/5 dark:bg-rose-950/5'
                      : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={item.avatar}
                      alt={item.patientName}
                      className="w-8.5 h-8.5 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white leading-none truncate">
                        {item.patientName}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 truncate font-mono">
                        Scanned: {item.timestamp}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-500 uppercase">
                      {item.bloodType}
                    </span>
                    <span className={`w-2 h-2 rounded-full ${
                      item.status === 'Critical' 
                        ? 'bg-red-500 animate-pulse' 
                        : item.status === 'Under Observation' 
                        ? 'bg-amber-500' 
                        : 'bg-emerald-500'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ======================================================================
           COLUMN 2: DETAILED PATIENT EMERGENCY CARD & EMR VAULT (XL:COL-8)
           ====================================================================== */}
        <div className="xl:col-span-8 space-y-6">
          
          {activePatient ? (
            <div className="space-y-6">
              
              {/* Emergency Health Pass Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
                
                {/* Emergency Card Alert Banner */}
                <div className={`p-4.5 flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                  activePatient.status === 'Critical'
                    ? 'bg-red-600 text-white'
                    : 'bg-amber-500 text-slate-950'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 animate-bounce shrink-0" />
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                        {activePatient.status} LEVEL STATUS
                      </span>
                      <h3 className="text-sm font-bold tracking-tight mt-0.5">
                        Active Emergency Alert: {activePatient.condition}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono px-2 py-1 bg-black/15 rounded-lg">
                      ID: {activePatient.id}
                    </span>
                    <span className="text-xs font-bold font-mono px-2 py-1 bg-black/15 rounded-lg flex items-center gap-1">
                      <QrCode className="w-3.5 h-3.5" /> SECURE
                    </span>
                  </div>
                </div>

                {/* Primary Demographics Grid */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/30 dark:bg-slate-950/10">
                  <div className="flex flex-col md:flex-row gap-5 items-start justify-between">
                    
                    <div className="flex items-center gap-4">
                      <img
                        src={activePatient.avatar}
                        alt={activePatient.name}
                        className="w-16 h-16 rounded-3xl object-cover ring-4 ring-slate-100 dark:ring-slate-800 shrink-0"
                      />
                      <div>
                        <h3 className="text-lg font-black text-slate-950 dark:text-white leading-tight">
                          {activePatient.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {activePatient.gender} • {activePatient.age} years old
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-500 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            <ShieldCheck className="w-3 h-3" /> LifeQR Decrypted
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                            Key: {activePatient.lifeQrCode}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Critical Vitals Indicators / Blood Drop */}
                    <div className="flex items-center gap-4 self-stretch md:self-auto justify-between md:justify-start border-t md:border-t-0 border-slate-150 dark:border-slate-800/80 pt-4 md:pt-0">
                      
                      {/* Blood Drop Big Icon */}
                      <div className="bg-rose-500/10 border border-rose-500/25 p-3 rounded-2xl flex items-center gap-3">
                        <Droplets className="w-8 h-8 text-rose-500 fill-rose-500 animate-pulse shrink-0" />
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Blood Group</span>
                          <span className="text-xl font-black text-rose-500 font-mono leading-none">{activePatient.bloodType}</span>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>

                {/* Emergency Health Profiles Cards Grid */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Allergies & Medicines */}
                  <div className="space-y-5">
                    
                    {/* Allergies Warning Card */}
                    <div className="border border-red-500/20 dark:border-red-500/15 bg-red-500/5 rounded-2xl p-4 space-y-2.5">
                      <h4 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 shrink-0" /> ALLERGIES & CONTRAINDICATIONS
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {activePatient.allergies.map((allergy, i) => (
                          <span 
                            key={i} 
                            className="text-xs font-bold px-2.5 py-1 rounded-xl bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/30"
                          >
                            {allergy}
                          </span>
                        ))}
                      </div>
                      {activePatient.id === 'pat-002' && (
                        <p className="text-[11px] text-red-500/90 leading-relaxed font-mono">
                          ⚠️ CRITICAL: Avoid standard high-dose aspirin interventions until enteric tolerability is mapped.
                        </p>
                      )}
                    </div>

                    {/* Current Medications */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <ClipboardList className="w-4 h-4 text-blue-500 shrink-0" /> CURRENT REGULAR MEDICINES
                      </h4>
                      <div className="space-y-1.5">
                        {activePatient.currentMedications.map((med, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-900/40"
                          >
                            <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                            <span className="font-semibold">{med}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Chronic Diseases & Emergency Contacts */}
                  <div className="space-y-5">
                    
                    {/* Chronic Conditions */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" /> CHRONIC MEDICAL ISSUES
                      </h4>
                      <div className="space-y-1.5">
                        {activePatient.chronicDiseases.map((disease, i) => (
                          <div 
                            key={i} 
                            className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-350 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-900/40"
                          >
                            <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                            <span className="font-semibold">{disease}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next-of-Kin Emergency Contacts */}
                    <div className="border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-2.5">
                      <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                        <Phone className="w-4 h-4 text-emerald-500 shrink-0" /> EMERGENCY CONTACTS (NEXT OF KIN)
                      </h4>
                      <div className="space-y-2.5">
                        {activePatient.emergencyContacts.map((contact, i) => (
                          <div 
                            key={i} 
                            className="p-2.5 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center justify-between gap-2"
                          >
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-black text-slate-950 dark:text-white">
                                  {contact.name}
                                </span>
                                <span className="text-[9px] font-black px-1.5 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 uppercase tracking-wider rounded">
                                  {contact.relationship}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
                                {contact.phone}
                              </p>
                            </div>

                            <a
                              href={`tel:${contact.phone}`}
                              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors flex items-center gap-1"
                            >
                              <Phone className="w-3 h-3 fill-slate-950" /> Call
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>

                {/* Secure EMR deep link access footer */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-150 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs">
                  <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-blue-500" /> Full medical histories, lab metrics, and ECG panels are locked inside DOCO secure EHR.
                  </span>
                  {onNavigateToPatient && (
                    <button
                      onClick={() => {
                        const originalPatientObj = patients.find(p => p.id === activePatient.id);
                        if (originalPatientObj) {
                          onNavigateToPatient(originalPatientObj);
                        }
                      }}
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-bold flex items-center gap-1 group"
                    >
                      Unlock Full Clinical EMR File <Sparkles className="w-3.5 h-3.5 animate-pulse group-hover:scale-110 transition-transform" />
                    </button>
                  )}
                </div>

              </div>

              {/* Secure Hospital Access Log Confirmation */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
                <div className="flex justify-between items-start flex-wrap gap-2">
                  <div>
                    <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Lock className="w-4 h-4 text-emerald-500" /> INSTITUTIONAL PRIVACY COMPLIANCE AUDIT
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                      Under federal emergency regulations, medical access can be authorized. Log your institutional credentials.
                    </p>
                  </div>

                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    isAccessConfirmed
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
                      : 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/25'
                  }`}>
                    {isAccessConfirmed ? '✓ HIPAA ACCESS RECORDED' : '⚠ ACCESS UNVERIFIED'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900/60">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Clinician Signature</label>
                    <input
                      type="text"
                      value={verifierName}
                      onChange={(e) => setVerifierName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1">Assigned trauma Department</label>
                    <input
                      type="text"
                      value={verifierDept}
                      onChange={(e) => setVerifierDept(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-1.5 px-3 text-xs font-semibold outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    {isAccessConfirmed ? (
                      <div className="w-full py-1.5 text-center text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-500/10 rounded-xl border border-emerald-500/25">
                        Access Key Signed
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setIsAccessConfirmed(true);
                          triggerBeepSound();
                        }}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <UserCheck className="w-4 h-4" /> Confirm Access Auth
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Emergency Timeline & Paramedic Incident Logger */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-5">
                
                <div>
                  <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-rose-500" /> LIVE ADMITTANCE TIMELINE & PARAMEDIC LOGS
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                    Trace incident timeline from emergency scene through optical scanning, and log rapid interventions.
                  </p>
                </div>

                {/* Paramedic notes quick input panel */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900/60 space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-1.5">
                      Quick Log Clinical Interventions
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {presetClinicalNotes.map((preset, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleAddClinicalNote(preset)}
                          className="px-2.5 py-1 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-350 text-[10px] font-bold rounded-xl transition-colors"
                        >
                          + {preset.split(' ')[0]} {preset.split(' ')[1]} {preset.split(' ')[2]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <form onSubmit={handleCustomNoteSubmit} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Type custom paramedic or clinical note to append to ledger..."
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:border-rose-500 focus:ring-1 focus:ring-rose-500 rounded-xl py-2 px-3 text-xs outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!noteText.trim()}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Log Note
                    </button>
                  </form>
                </div>

                {/* Incident Log Vertical Timeline */}
                <div className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-800 ml-2 space-y-5">
                  {timelineEvents.map((evt) => (
                    <div key={evt.id} className="relative">
                      {/* Timeline dot marker */}
                      <span className="absolute -left-[27px] top-1 w-3 h-3 rounded-full bg-rose-500 border-2 border-white dark:border-slate-900 shadow-sm" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-black text-slate-950 dark:text-white uppercase tracking-wide">
                            {evt.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 font-bold bg-slate-50 dark:bg-slate-950 px-2 py-0.5 rounded">
                            {evt.timestamp}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 font-mono">
                          Author: {evt.author}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-1 leading-relaxed">
                        {evt.description}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          ) : (
            /* Prompt to trigger initial scan */
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center shadow-sm">
              <QrCode className="w-16 h-16 text-slate-350 dark:text-slate-700 mx-auto mb-4 animate-pulse" />
              <h3 className="text-lg font-black text-slate-950 dark:text-white">Optical scan Pending</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 max-w-md mx-auto">
                Align the patient's physical Emergency LifeQR bracelet or card in front of the camera, or select a preset patient on the left to simulate optical data retrieval.
              </p>
              
              <div className="mt-6 flex justify-center gap-3">
                <button
                  onClick={() => handlePerformScan('pat-002')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-2xl transition-all"
                >
                  Scan Eleanor Vance
                </button>
                <button
                  onClick={() => handlePerformScan('pat-001')}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-200 text-xs font-extrabold rounded-2xl transition-all"
                >
                  Scan Robert Miller
                </button>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
