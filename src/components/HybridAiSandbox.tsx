import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, Zap, Globe, Shield, Sparkles, Send, 
  Terminal, CheckCircle, RefreshCw, AlertCircle,
  Wifi, WifiOff, Loader2, ShieldAlert, Check, Database
} from 'lucide-react';

interface PatientOption {
  id: string;
  name: string;
  condition: string;
}

interface HybridAiSandboxProps {
  patients: PatientOption[];
  onAddTimelineActivity: (activity: {
    type: 'AI' | 'Medication' | 'System' | 'Consultation';
    message: string;
    patient: string;
    details: string;
  }) => void;
}

// Pre-defined realistic cardiology SOAP summaries for simulation
const SOAP_SUMMARIES: Record<string, string> = {
  'pat-001': `CLINICAL SOAP NOTE SUMMARY (DE-IDENTIFIED PROTOCOL)
---------------------------------------------
[COMPLIANCE CHECK: HIPAA SCRUBBER COMPLETED - NO PHI SENT TO CLOUD]
TIMESTAMP: 2026-07-03 • PRIMARY MODEL: CLOUD (GEMINI 1.5 PRO)

CHIEF COMPLAINT:
- Mild fatigue and occasional morning palpitations.

VITAL SIGNS:
- BP: 138/84 mmHg, HR: 74 bpm (Sinus with rare PVCs), Temp: 98.6°F.

SUBJECTIVE:
- Patient reports excellent adherence to low-sodium diet and walking regimen of 30 minutes daily. Reports brief, transient "fluttering" sensations in chest, primarily in early morning. No chest pressure, orthopnea, or dyspnea on exertion.

OBJECTIVE:
- Cardiorespiratory: Lungs clear bilaterally. S1/S2 normal, no murmurs.
- EKG Analysis: Normal sinus rhythm with infrequent, monomorphic premature ventricular contractions (PVCs). No ST-segment deviations or ischemic depressions.
- Extremities: Warm, no peripheral edema. 

ASSESSMENT:
- 1. Chronic Essential Hypertension, well-controlled on Lisinopril.
- 2. Mild Ventricular Arrhythmia (PVCs), clinically stable. No immediate ischemic signals.

PLAN:
- Continue current Lisinopril 20mg once daily.
- Order 24-hour ambulatory Holter monitoring to quantify PVC burden.
- Reassure patient; return for follow-up evaluation in 3 months.`,

  'pat-002': `CLINICAL SOAP NOTE SUMMARY (DE-IDENTIFIED PROTOCOL)
---------------------------------------------
[COMPLIANCE CHECK: HIPAA SCRUBBER COMPLETED - NO PHI SENT TO CLOUD]
TIMESTAMP: 2026-07-03 • PRIMARY MODEL: OPTIMIZED (GEMINI FLASH)

CHIEF COMPLAINT:
- 6-week post-PCI (LAD stenting) evaluation and cardiac rehab tolerance.

VITAL SIGNS:
- BP: 118/72 mmHg, HR: 62 bpm, Temp: 98.4°F, O2 Sat: 99% RA.

SUBJECTIVE:
- Patient reports feeling exceptionally well. Completing Phase II Cardiac Rehabilitation twice weekly with robust exercise tolerance. Reports rare dry cough, denying chest pain, tightness, or shortness of breath.

OBJECTIVE:
- Cardiovascular: Regular rate and rhythm, normal S1/S2, no murmurs or gallops.
- Surgical Access: Left radial catheterization puncture site fully closed, no erythema, hematoma, or bruits.
- Pulmonary: Lungs resonant to percussion, normal breath sounds.

ASSESSMENT:
- 1. Coronary Artery Disease, status post-LAD PCI with drug-eluting stent (stent age 6 weeks).
- 2. High-quality recovery and compliant functional rehabilitation.

PLAN:
- Maintain dual antiplatelet therapy (DAPT: Aspirin 81mg QD + Clopidogrel 75mg QD).
- Continue Metoprolol Succinate 25mg QD.
- Recommend completion of remaining rehab modules. Echo scheduled in 6 months.`,

  'pat-004': `CLINICAL SOAP NOTE SUMMARY (DE-IDENTIFIED PROTOCOL)
---------------------------------------------
[COMPLIANCE CHECK: HIPAA SCRUBBER COMPLETED - NO PHI SENT TO CLOUD]
TIMESTAMP: 2026-07-03 • PRIMARY MODEL: CLOUD (GEMINI 1.5 PRO)

CHIEF COMPLAINT:
- Morning postural tachycardia flare-ups and transient dizziness.

VITAL SIGNS:
- BP (Supine): 112/70 mmHg, HR: 68 bpm.
- BP (Standing - 3 min): 108/68 mmHg, HR: 118 bpm (Symptomatic).

SUBJECTIVE:
- Patient complains of severe morning lightheadedness and tachycardia immediately upon standing. Reports increased symptoms in warm weather. No syncope. Reports drinking 2L fluids daily.

OBJECTIVE:
- Neurological: Alert, oriented, normal cranial nerves.
- Cardiac: Postural tachycardia demonstrated (+50 bpm increase upon standing). regular rhythm. No peripheral edema.

ASSESSMENT:
- 1. Postural Orthostatic Tachycardia Syndrome (POTS) / Dysautonomia.
- 2. Inadequate morning fluid and sodium volume expansion.

PLAN:
- Escalate hydration target to 3.0 Liters daily.
- Increase sodium intake via dietary supplementation (6g/day).
- Wear medical-grade compression stockings (30-40 mmHg) before standing.
- Initiate low-dose Fludrocortisone 0.1mg daily as discussed.`,

  'pat-005': `CLINICAL SOAP NOTE SUMMARY (DE-IDENTIFIED PROTOCOL)
---------------------------------------------
[COMPLIANCE CHECK: HIPAA SCRUBBER COMPLETED - NO PHI SENT TO CLOUD]
TIMESTAMP: 2026-07-03 • PRIMARY MODEL: LOCAL (GEMMA 2B SECURE)

CHIEF COMPLAINT:
- Acute dyspnea on minimal exertion, orthopnea, and rapid weight gain.

VITAL SIGNS:
- BP: 145/92 mmHg, HR: 98 bpm (Sinus Tachycardia), Temp: 98.2°F, O2 Sat: 91% RA.

SUBJECTIVE:
- Patient complains of severe dyspnea limiting mobility to 10 feet. Obliged to sleep on 3 pillows due to orthopnea. Reports a weight gain of 5.2 lbs over the last 48 hours. Noted bilateral lower limb swelling.

OBJECTIVE:
- Pulmonary: Crackles (râles) present in bilateral lower lung fields up to scapular angle.
- Cardiovascular: Positive Jugular Venous Distension (JVD) at 8cm. Pitting peripheral edema (2+) bilaterally up to mid-calf. 
- Auscultation: Audible S3 gallop.

ASSESSMENT:
- 1. Acute Decompensated Heart Failure (ADHF) with severe volume overload. NYHA Class III-IV.
- 2. Impending severe pulmonary congestion.

PLAN:
- Urgent administration of IV Furosemide (Lasix) 40mg STAT.
- Place patient on supplemental nasal oxygen (2L/min) to maintain O2 sat >94%.
- Initiate strict fluid restriction of 1.2 Liters daily, check electrolytes in 4 hours.
- Direct CCU ward bed reservation requested.`
};

export default function HybridAiSandbox({ patients, onAddTimelineActivity }: HybridAiSandboxProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('pat-001');
  const [selectedModel, setSelectedModel] = useState<'cloud' | 'optimized' | 'local'>('optimized');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [progressStep, setProgressStep] = useState<number>(0);
  const [generatedNote, setGeneratedNote] = useState<string>('');
  const [typingText, setTypingText] = useState<string>('');
  const [activeModelTab, setActiveModelTab] = useState<'cloud' | 'optimized' | 'local'>('optimized');

  // Network & Hybrid Simulation States
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'offline' | 'syncing'>('excellent');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncProgress, setSyncProgress] = useState<number>(0);
  const [offlineDrafts, setOfflineDrafts] = useState<number>(0);
  const [preOfflineModel, setPreOfflineModel] = useState<'cloud' | 'optimized' | 'local'>('optimized');
  const [syncLog, setSyncLog] = useState<string[]>([]);
  const [showSyncSuccessToast, setShowSyncSuccessToast] = useState<boolean>(false);

  // Specs for AI models
  const modelSpecs = {
    cloud: {
      name: 'DOCO-Cloud (Gemini 1.5 Pro)',
      engine: 'Google Gemini Pro Engine',
      latency: '420 ms',
      throughput: '120 tokens/sec',
      safety: 'Compliance level: 100% HIPAA Cert',
      specialty: 'Clinical trials matching, deep cross-record EMR auditing, multi-modal lab imaging analysis',
      status: 'Active / Low Latency',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20'
    },
    optimized: {
      name: 'DOCO-Optimized (Gemini 1.5 Flash)',
      engine: 'Google Gemini Flash Engine',
      latency: '110 ms',
      throughput: '450 tokens/sec',
      safety: 'Compliance level: 100% HIPAA Cert',
      specialty: 'Real-time conversational audio transcription, instant consultation structuring, clinical speech translation',
      status: 'Active / High Throughput',
      color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 border-indigo-500/20'
    },
    local: {
      name: 'DOCO-Local (Gemma 2B Secure)',
      engine: 'On-device Offline Sandbox',
      latency: '14 ms',
      throughput: '85 tokens/sec',
      safety: 'Compliance level: Zero Data-Out (Offline)',
      specialty: 'Local EMR PHI scrubbing, local de-identification preprocessing, on-device quick clipboard summaries',
      status: 'Standby / Air-gapped Secure',
      color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
    }
  };

  // Simulating typing effect for the generated note
  useEffect(() => {
    if (!generatedNote) {
      setTypingText('');
      return;
    }

    let index = 0;
    const intervalTime = 3; // fast speed
    setTypingText('');

    const timer = setInterval(() => {
      setTypingText((prev) => prev + generatedNote.charAt(index));
      index++;
      if (index >= generatedNote.length) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [generatedNote]);

  // Simulate loss of internet (Failover)
  const handleSimulateInternetLoss = () => {
    if (!isOnline) return;
    setPreOfflineModel(selectedModel);
    setIsOnline(false);
    setConnectionQuality('offline');
    setSelectedModel('local');
    setActiveModelTab('local');
    
    // Log recent activity
    onAddTimelineActivity({
      type: 'System',
      message: 'Internet connection lost. DOCO failover protocol activated.',
      patient: 'System',
      details: 'Intelligently transitioned from Cloud to Local on-device Gemma 2B model without interrupting clinical consultation workspace.'
    });
  };

  // Simulate internet return (Synchronization)
  const handleRestoreInternet = () => {
    if (isOnline || isSyncing) return;
    setIsSyncing(true);
    setConnectionQuality('syncing');
    setSyncProgress(0);
    setSyncLog([
      'Initializing secure connection tunnel...',
      'Conducting remote ledger TLS handshake...',
      'Verifying digital HIPAA-compliance envelope integrity...'
    ]);

    // Progressive visual steps
    setTimeout(() => {
      setSyncProgress(35);
      setSyncLog(prev => [...prev, `Uploading ${offlineDrafts} cached on-device EMR draft(s) safely...`]);
    }, 800);

    setTimeout(() => {
      setSyncProgress(70);
      setSyncLog(prev => [...prev, 'Integrating offline transcript segments into central cloud ledger database...']);
    }, 1600);

    setTimeout(() => {
      setSyncProgress(90);
      setSyncLog(prev => [...prev, 'Validating clinical summaries with cloud safety rules...']);
    }, 2400);

    setTimeout(() => {
      setSyncProgress(100);
      setIsSyncing(false);
      setIsOnline(true);
      setConnectionQuality('excellent');
      
      // Auto restore back to preferred model
      const restoredModel = preOfflineModel === 'local' ? 'optimized' : preOfflineModel;
      setSelectedModel(restoredModel);
      setActiveModelTab(restoredModel);

      const draftText = offlineDrafts > 0 ? `${offlineDrafts} offline clinical SOAP draft(s) merged.` : 'Zero drafts cached.';
      onAddTimelineActivity({
        type: 'System',
        message: 'Internet connection restored. Central EMR synchronized.',
        patient: 'System',
        details: `Successfully merged local EMR cache back to cloud ledger. ${draftText} Restored active model to ${restoredModel.toUpperCase()}.`
      });
      setOfflineDrafts(0);

      setShowSyncSuccessToast(true);
      setTimeout(() => setShowSyncSuccessToast(false), 4000);
    }, 3200);
  };

  const handleRunAiAnalysis = () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    setProgressStep(1);
    setGeneratedNote('');
    setTypingText('');

    const targetModel = isOnline ? selectedModel : 'local';

    // Step 1: Local Scrubbing (Simulating Gemma 2B)
    setTimeout(() => {
      setProgressStep(2);
      
      // Step 2: Model routing and API compilation
      setTimeout(() => {
        setProgressStep(3);

        // Step 3: Response compilation
        setTimeout(() => {
          setIsProcessing(false);
          setProgressStep(4);
          const patientName = patients.find(p => p.id === selectedPatientId)?.name || 'Patient';
          const finalNote = SOAP_SUMMARIES[selectedPatientId] || 'No summary configured for this patient.';
          setGeneratedNote(finalNote);

          // Append action to the chronological timeline
          if (!isOnline) {
            setOfflineDrafts(prev => prev + 1);
            onAddTimelineActivity({
              type: 'AI',
              message: `[OFFLINE] On-device clinical SOAP note prepared for ${patientName}.`,
              patient: patientName,
              details: `Gemma 2B successfully compiled transcription while offline. Saved securely to encrypted on-device local cache (Pending Cloud Sync).`
            });
          } else {
            onAddTimelineActivity({
              type: 'AI',
              message: `Hybrid AI compiled clinical SOAP draft for ${patientName} using ${modelSpecs[targetModel].name}.`,
              patient: patientName,
              details: `Scrubbed PHI in ${modelSpecs.local.latency}. Routed to ${modelSpecs[targetModel].name} for clinical synthesis. HIPAA certified.`
            });
          }
        }, 1200);
      }, 1000);
    }, 800);
  };

  return (
    <div id="hybrid-ai-sandbox" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 rounded-3xl shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-950 dark:text-white tracking-tight flex items-center gap-1.5">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-pulse" />
            <span>Hybrid Clinical AI Status</span>
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">Air-gapped local processing combined with optimized cloud clinical reasoning</p>
        </div>

        {/* Dynamic connection quality pill */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Signal Quality:
          </span>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <span className={`h-2 w-2 rounded-full ${
              isOnline 
                ? 'bg-emerald-500 animate-pulse' 
                : isSyncing 
                ? 'bg-amber-500 animate-spin' 
                : 'bg-red-500 animate-pulse'
            }`} />
            <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">
              {isOnline ? 'Excellent (Cloud Ready)' : isSyncing ? 'Syncing Ledger' : 'On-Device Backup Only'}
            </span>
          </div>
        </div>
      </div>

      {/* Connection Controls Toolbar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            isOnline 
              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
              : isSyncing 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
              : 'bg-red-500/10 text-red-600'
          }`}>
            {isOnline ? (
              <Wifi className="w-5 h-5" />
            ) : isSyncing ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <WifiOff className="w-5 h-5" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">
                Network Sandbox Mode
              </span>
              <span className={`inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                isOnline 
                  ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400' 
                  : isSyncing 
                  ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400' 
                  : 'bg-red-100 dark:bg-red-950/40 text-red-600'
              }`}>
                {isOnline ? 'ONLINE' : isSyncing ? 'SYNCING' : 'OFFLINE'}
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-0.5">
              {isOnline 
                ? 'High-speed cloud pipelines operational.' 
                : isSyncing 
                ? 'Uploading secure drafts to regional database.' 
                : 'Air-gapped secure container activated.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {isOnline ? (
            <button
              onClick={handleSimulateInternetLoss}
              className="w-full sm:w-auto px-3.5 py-1.5 text-[10px] font-extrabold tracking-wider text-red-600 hover:bg-red-500/10 border border-red-500/20 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <WifiOff className="w-3.5 h-3.5" /> Simulate Internet Loss
            </button>
          ) : (
            <button
              onClick={handleRestoreInternet}
              disabled={isSyncing}
              className="w-full sm:w-auto px-3.5 py-1.5 text-[10px] font-extrabold tracking-wider text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all uppercase flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Synchronizing...
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5" /> Restore Internet
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Offline Failover Alert Banner */}
      <AnimatePresence>
        {!isOnline && !isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4.5 flex items-start gap-3.5 text-red-950 dark:text-red-200 animate-pulse"
          >
            <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-black uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-1.5">
                On-Device Secure Failover Protocol Engaged
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                Local connectivity is severed. DOCO has automatically hot-swapped your AI execution engine to the air-gapped on-device <strong className="text-red-600 dark:text-red-400">Gemma 2B Secure Sandbox</strong>. Continue typing prompts or processing summaries as usual. Data remains encrypted on-device and will auto-sync upon reconnection.
              </p>
              {offlineDrafts > 0 && (
                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-600 dark:text-red-400 mt-1 font-mono border border-red-500/30">
                  <Database className="w-3 h-3 animate-pulse" /> {offlineDrafts} Offline Draft{offlineDrafts > 1 ? 's' : ''} Cached Locally
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Synchronization Progress Panel */}
      <AnimatePresence>
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-indigo-500/5 border border-indigo-500/10 rounded-2xl p-5 space-y-4"
          >
            <div className="flex justify-between items-center pb-2.5 border-b border-indigo-500/10">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin" />
                <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                  DOCO Sync Engine Progress Ledger
                </span>
              </div>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                {syncProgress}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
              <motion.div 
                className="bg-gradient-to-r from-indigo-500 to-blue-600 h-full rounded-full"
                animate={{ width: `${syncProgress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Sync Steps Logs */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-900 font-mono text-[10px] text-indigo-300 space-y-1.5 max-h-32 overflow-y-auto shadow-inner">
              {syncLog.map((log, index) => (
                <div key={index} className="flex items-start gap-1.5">
                  <span className="text-indigo-500">➜</span>
                  <p className="leading-normal text-slate-300">{log}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Synchronization Success Toast Banner */}
      <AnimatePresence>
        {showSyncSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            className="bg-emerald-500 text-white rounded-2xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/20 border border-emerald-400/20"
          >
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-xl">
                <Check className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-extrabold uppercase tracking-widest leading-none">Database Ledger Synced</h5>
                <p className="text-[10px] text-emerald-100 mt-1">All offline sessions successfully committed to central clinical database.</p>
              </div>
            </div>
            <button 
              onClick={() => setShowSyncSuccessToast(false)}
              className="text-[10px] font-black uppercase tracking-wider bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg transition-all cursor-pointer"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of 3 AI models */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        {(Object.keys(modelSpecs) as Array<keyof typeof modelSpecs>).map((modelKey) => {
          const m = modelSpecs[modelKey];
          const isSelectedTab = activeModelTab === modelKey;
          const isModelAvailable = isOnline || modelKey === 'local';

          return (
            <div
              key={modelKey}
              onClick={() => {
                if (!isModelAvailable) return;
                setActiveModelTab(modelKey);
                setSelectedModel(modelKey);
              }}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all hover:-translate-y-0.5 flex flex-col justify-between h-40 ${
                !isModelAvailable
                  ? 'bg-slate-100/50 dark:bg-slate-950/40 border-slate-200/50 dark:border-slate-800/20 opacity-50 cursor-not-allowed'
                  : isSelectedTab
                  ? 'border-indigo-600 bg-indigo-500/5 shadow-md shadow-indigo-500/5 dark:bg-indigo-950/20'
                  : 'bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900/80 border-slate-100 dark:border-slate-800/40'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${m.color}`}>
                    {modelKey === 'cloud' ? <Globe className="w-3 h-3 inline-block mr-1" /> : modelKey === 'optimized' ? <Zap className="w-3 h-3 inline-block mr-1" /> : <Cpu className="w-3 h-3 inline-block mr-1" />}
                    {modelKey.toUpperCase()} ENGINE
                  </span>
                  <span className="flex h-2 w-2 relative">
                    {isModelAvailable ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-slate-400 dark:bg-slate-600"></span>
                    )}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-1">{m.name}</h4>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-normal mt-0.5">{m.specialty}</p>
              </div>
              <div className="border-t border-slate-200/50 dark:border-slate-800/60 pt-2 mt-2 flex justify-between text-[10px] font-mono text-slate-400">
                <span>Latency: <strong className="text-slate-700 dark:text-slate-300">{isModelAvailable ? m.latency : 'N/A'}</strong></span>
                <span>Status: <strong className={isModelAvailable ? 'text-emerald-500 font-bold' : 'text-slate-500 font-bold'}>{isModelAvailable ? 'Ready' : 'Offline'}</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Prompt and Interactive Playground */}
      <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800/80 pb-2.5">
          <span className="text-[11px] font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1.5 font-mono">
            <Terminal className="w-4 h-4" /> SOAP Generator Sandbox
          </span>
          <span className="text-[10px] font-medium text-slate-400">HIPAA Protected air-gapped pipeline</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Patient dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Patient Subject</label>
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              disabled={isProcessing}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.condition})</option>
              ))}
            </select>
          </div>

          {/* Model selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Model Selector</label>
            <select
              value={selectedModel}
              onChange={(e) => {
                if (!isOnline && e.target.value !== 'local') return;
                setSelectedModel(e.target.value as any);
                setActiveModelTab(e.target.value as any);
              }}
              disabled={isProcessing}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-900 dark:text-white outline-none focus:border-indigo-500 disabled:opacity-50"
            >
              <option value="optimized" disabled={!isOnline}>DOCO-Optimized (Gemini Flash) {!isOnline && '— [OFFLINE]'}</option>
              <option value="cloud" disabled={!isOnline}>DOCO-Cloud (Gemini Pro) {!isOnline && '— [OFFLINE]'}</option>
              <option value="local">DOCO-Local (Gemma Secure)</option>
            </select>
          </div>

          {/* Run button */}
          <div className="flex items-end">
            <button
              onClick={handleRunAiAnalysis}
              disabled={isProcessing}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-1.5 transition-all shadow-md shadow-indigo-500/10 cursor-pointer"
            >
              {isProcessing ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              <span>{isProcessing ? 'Processing...' : 'Run Pipeline'}</span>
            </button>
          </div>
        </div>

        {/* Processing State Anim */}
        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-2 bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3 text-xs"
            >
              <div className="flex items-center gap-2">
                <Shield className={`w-4 h-4 text-emerald-500 ${progressStep === 1 ? 'animate-pulse' : ''}`} />
                <span className={`font-medium ${progressStep >= 1 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                  Step 1: Local PHI air-gap de-identification scrub (Gemma 2B) - {progressStep > 1 ? 'COMPLETE' : 'SCRUBBING...'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Cpu className={`w-4 h-4 text-indigo-500 ${progressStep === 2 ? 'animate-spin' : ''}`} />
                <span className={`font-medium ${progressStep >= 2 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                  Step 2: {isOnline ? `Routing de-identified tokens to ${modelSpecs[selectedModel].name}` : 'Local secure sandbox in-memory buffer routing'} - {progressStep > 2 ? 'COMPLETE' : progressStep === 2 ? (isOnline ? 'ROUTING...' : 'BUFFERING...') : 'PENDING'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className={`w-4 h-4 text-amber-500 ${progressStep === 3 ? 'animate-bounce' : ''}`} />
                <span className={`font-medium ${progressStep >= 3 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                  Step 3: Synthesizing medical transcription & diagnostics - {progressStep > 3 ? 'COMPLETE' : progressStep === 3 ? 'SYNTHESIZING...' : 'PENDING'}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Streaming text area */}
        {(typingText || isProcessing) && (
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 h-56 overflow-y-auto font-mono text-[11px] text-slate-800 dark:text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
            {typingText ? (
              <div>
                {typingText}
                <span className="inline-block w-1.5 h-4 bg-indigo-500 animate-pulse ml-0.5" />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
                <span className="text-[10px]">Assembling clinical records & EMR data logs...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
