/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, Activity, BarChart2, Heart, Award, 
  Users, Calendar, ThumbsUp, DollarSign, Clock, ArrowUpRight, 
  ArrowDownRight, Download, FileText, Filter, Printer, Share2, 
  Building, ChevronRight, CheckSquare, Sparkles, CheckCircle, Info, PieChart as PieIcon, Stethoscope, Droplet, Pill
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';

// ==========================================
// HIGH-FIDELITY EXEC-LEVEL DATASETS
// ==========================================

const timeframes = [
  { id: '30days', label: 'Last 30 Days' },
  { id: '6months', label: 'Last 6 Months' },
  { id: 'ytd', label: 'Year-to-Date' }
];

const departments = [
  { id: 'all', label: 'All Departments' },
  { id: 'cardiology', label: 'Cardiology Clinic' },
  { id: 'internal', label: 'Internal Medicine' },
  { id: 'emergency', label: 'Emergency Trauma' }
];

// Historical Patient & Revenue Trends
const monthlyDatasets = {
  '30days': [
    { name: 'Week 1', newPatients: 42, regularVisits: 180, revenue: 26500, consultTime: 22.1, followups: 85 },
    { name: 'Week 2', newPatients: 48, regularVisits: 195, revenue: 29800, consultTime: 21.8, followups: 92 },
    { name: 'Week 3', newPatients: 38, regularVisits: 172, revenue: 24200, consultTime: 21.3, followups: 78 },
    { name: 'Week 4', newPatients: 55, regularVisits: 210, revenue: 33100, consultTime: 20.9, followups: 104 },
  ],
  '6months': [
    { name: 'Jan 2026', newPatients: 155, regularVisits: 720, revenue: 109000, consultTime: 22.4, followups: 340 },
    { name: 'Feb 2026', newPatients: 168, regularVisits: 750, revenue: 114000, consultTime: 22.1, followups: 365 },
    { name: 'Mar 2026', newPatients: 195, regularVisits: 810, revenue: 125600, consultTime: 21.7, followups: 390 },
    { name: 'Apr 2026', newPatients: 180, regularVisits: 790, revenue: 121000, consultTime: 21.9, followups: 370 },
    { name: 'May 2026', newPatients: 210, regularVisits: 860, revenue: 134500, consultTime: 21.5, followups: 415 },
    { name: 'Jun 2026', newPatients: 245, regularVisits: 920, revenue: 148000, consultTime: 21.1, followups: 460 },
  ],
  'ytd': [
    { name: 'Q1 2026', newPatients: 518, regularVisits: 2280, revenue: 348600, consultTime: 22.1, followups: 1095 },
    { name: 'Q2 2026', newPatients: 635, regularVisits: 2570, revenue: 403500, consultTime: 21.5, followups: 1245 },
    { name: 'Q3 2026', newPatients: 710, regularVisits: 2900, revenue: 452000, consultTime: 21.0, followups: 1380 },
  ]
};

// Disease Progression trends
const diseaseTrendsData = {
  '30days': [
    { name: 'Wk 1', Hypertension: 48, CAD: 32, Arrhythmia: 18, HeartFailure: 22, Diabetes: 35 },
    { name: 'Wk 2', Hypertension: 52, CAD: 30, Arrhythmia: 22, HeartFailure: 25, Diabetes: 38 },
    { name: 'Wk 3', Hypertension: 45, CAD: 35, Arrhythmia: 15, HeartFailure: 20, Diabetes: 33 },
    { name: 'Wk 4', Hypertension: 58, CAD: 40, Arrhythmia: 25, HeartFailure: 28, Diabetes: 42 },
  ],
  '6months': [
    { name: 'Jan', Hypertension: 180, CAD: 120, Arrhythmia: 75, HeartFailure: 85, Diabetes: 130 },
    { name: 'Feb', Hypertension: 195, CAD: 125, Arrhythmia: 82, HeartFailure: 90, Diabetes: 142 },
    { name: 'Mar', Hypertension: 210, CAD: 135, Arrhythmia: 90, HeartFailure: 98, Diabetes: 155 },
    { name: 'Apr', Hypertension: 198, CAD: 130, Arrhythmia: 85, HeartFailure: 92, Diabetes: 148 },
    { name: 'May', Hypertension: 225, CAD: 142, Arrhythmia: 98, HeartFailure: 105, Diabetes: 168 },
    { name: 'Jun', Hypertension: 248, CAD: 155, Arrhythmia: 110, HeartFailure: 115, Diabetes: 185 },
  ],
  'ytd': [
    { name: 'Q1', Hypertension: 585, CAD: 380, Arrhythmia: 247, HeartFailure: 273, Diabetes: 427 },
    { name: 'Q2', Hypertension: 671, CAD: 407, Arrhythmia: 293, HeartFailure: 312, Diabetes: 501 },
    { name: 'Q3', Hypertension: 750, CAD: 460, Arrhythmia: 330, HeartFailure: 350, Diabetes: 570 },
  ]
};

// Top prescribed drugs
const medicineUsageData = [
  { name: 'Metoprolol', type: 'Beta Blocker', prescriptions: 342, compliance: 94.2, color: '#3B82F6' },
  { name: 'Lisinopril', type: 'ACE Inhibitor', prescriptions: 289, compliance: 91.5, color: '#10B981' },
  { name: 'Atorvastatin', type: 'Statin', prescriptions: 412, compliance: 96.1, color: '#F59E0B' },
  { name: 'Metformin', type: 'Antidiabetic', prescriptions: 220, compliance: 88.4, color: '#6366F1' },
  { name: 'Clopidogrel', type: 'Antiplatelet', prescriptions: 185, compliance: 95.0, color: '#EC4899' },
  { name: 'Furosemide', type: 'Diuretic', prescriptions: 148, compliance: 92.8, color: '#14B8A6' },
];

// Doctor Clinical Scorecard
const doctorPerformanceData = [
  { name: 'Dr. Adithi', specialty: 'Cardiology Clinic', patients: 540, satisfaction: 99.2, consultTime: '22.4 min', rating: 4.9, activeTreatments: 124 },
  { name: 'Dr. Alexander Patel', specialty: 'Internal Medicine', patients: 420, satisfaction: 96.8, consultTime: '18.5 min', rating: 4.7, activeTreatments: 98 },
  { name: 'Dr. Marcus Vance', specialty: 'Emergency Trauma', patients: 280, satisfaction: 97.4, consultTime: '14.2 min', rating: 4.8, activeTreatments: 45 },
  { name: 'Dr. Emily Taylor', specialty: 'Rehab & Recovery', patients: 360, satisfaction: 98.9, consultTime: '25.1 min', rating: 4.9, activeTreatments: 110 },
];

// Weekly load & Schedulers load
const appointmentTrendsWeekly = [
  { day: 'Mon', Completed: 34, Cancelled: 2, Pending: 5, WalkIn: 4 },
  { day: 'Tue', Completed: 38, Cancelled: 1, Pending: 4, WalkIn: 6 },
  { day: 'Wed', Completed: 42, Cancelled: 3, Pending: 8, WalkIn: 5 },
  { day: 'Thu', Completed: 31, Cancelled: 0, Pending: 6, WalkIn: 3 },
  { day: 'Fri', Completed: 45, Cancelled: 4, Pending: 10, WalkIn: 8 },
  { day: 'Sat', Completed: 18, Cancelled: 1, Pending: 3, WalkIn: 2 },
];

// Demographic analysis
const demographicData = [
  { name: 'Under 18', value: 120, color: '#6366F1' },
  { name: '18-34', value: 380, color: '#3B82F6' },
  { name: '35-54', value: 720, color: '#10B981' },
  { name: '55-74', value: 980, color: '#F59E0B' },
  { name: '75+', value: 450, color: '#EF4444' }
];

export default function AnalyticsPage() {
  // Filters State
  const [selectedTimeframe, setSelectedTimeframe] = useState<'30days' | '6months' | 'ytd'>('6months');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  
  // Interactive Active Tab for visual panel
  const [activeTab, setActiveTab] = useState<'financial' | 'diseases' | 'medicines' | 'doctors'>('financial');

  // Export Modal state
  const [isExporting, setIsExporting] = useState(false);
  const [exportStep, setExportStep] = useState<string>('');
  const [showReportPreview, setShowReportPreview] = useState(false);
  const [selectedSections, setSelectedSections] = useState({
    summary: true,
    kpi: true,
    financials: true,
    diseases: true,
    prescriptions: true,
    doctors: true
  });

  // Dynamically calculate cumulative statistics based on timeframe filter
  const calculatedKpis = useMemo(() => {
    const dataset = monthlyDatasets[selectedTimeframe];
    
    let totalPatientsCount = 0;
    let totalRevenueSum = 0;
    let avgConsultTimeSum = 0;
    let totalFollowups = 0;
    let totalConsults = 0;

    dataset.forEach(item => {
      totalPatientsCount += item.newPatients + item.regularVisits;
      totalRevenueSum += item.revenue;
      avgConsultTimeSum += item.consultTime;
      totalFollowups += item.followups;
      totalConsults += item.regularVisits;
    });

    const avgConsultTimeCalculated = (avgConsultTimeSum / dataset.length).toFixed(1);
    
    // Simulate Follow-up rate calculation
    const followUpRateCalculated = ((totalFollowups / (totalPatientsCount || 1)) * 100).toFixed(1);

    // Apply department multiplier adjustments for high-fidelity interactive simulation
    let multiplier = 1;
    if (selectedDept === 'cardiology') multiplier = 0.45;
    else if (selectedDept === 'internal') multiplier = 0.35;
    else if (selectedDept === 'emergency') multiplier = 0.20;

    return {
      totalPatients: Math.round(totalPatientsCount * multiplier),
      totalRevenue: Math.round(totalRevenueSum * multiplier),
      avgConsultTime: (parseFloat(avgConsultTimeCalculated) * (selectedDept === 'emergency' ? 0.7 : 1)).toFixed(1),
      followUpRate: (parseFloat(followUpRateCalculated) * (selectedDept === 'emergency' ? 0.4 : selectedDept === 'cardiology' ? 1.15 : 1)).toFixed(1)
    };
  }, [selectedTimeframe, selectedDept]);

  // Handle fake PDF generation and compilation
  const handleCompileReport = () => {
    setIsExporting(true);
    setExportStep('Extracting Clinical Datasets from Secure EHR...');
    
    setTimeout(() => {
      setExportStep('Formatting Recharts Vector Plots to PDF Space...');
    }, 800);

    setTimeout(() => {
      setExportStep('Encrypting Cryptographic Ledger Access Stamp...');
    }, 1500);

    setTimeout(() => {
      setIsExporting(false);
      setExportStep('');
      setShowReportPreview(true);
    }, 2200);
  };

  return (
    <div className="space-y-6">
      
      {/* ======================================================================
         OPERATIONAL HEADER & INTERACTIVE FILTERS
         ====================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-sm flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="w-5.5 h-5.5 text-blue-600 dark:text-blue-400" /> Clinical Intelligence Dashboard
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">
            Enterprise analytics of cardiology intake, revenue, disease patterns, and clinician workflows.
          </p>
        </div>

        {/* Dropdown Filters Strip */}
        <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
          
          {/* Timeframe Filter Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold shadow-inner">
            {timeframes.map(tf => (
              <button
                key={tf.id}
                onClick={() => setSelectedTimeframe(tf.id as any)}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  selectedTimeframe === tf.id
                    ? 'bg-white dark:bg-slate-950 text-slate-950 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-950'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>

          {/* Department Filter Dropdown */}
          <div className="relative">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 pl-3 pr-8 text-xs font-bold text-slate-700 dark:text-slate-300 outline-none appearance-none cursor-pointer"
            >
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.label}
                </option>
              ))}
            </select>
            <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export Corporate PDF Trigger */}
          <button
            onClick={() => handleCompileReport()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-500/10 flex items-center gap-1.5 uppercase tracking-wide"
          >
            <Download className="w-3.5 h-3.5" /> Export Report
          </button>

        </div>
      </div>

      {/* ======================================================================
         TOP STATISTICAL OVERVIEW STRIP (PATIENTS, REVENUE, CARE TIME, RETENTION)
         ====================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Patients Care Volume */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm flex items-center gap-3.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />
          
          <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
            <Users className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Patients Volume</span>
            <span className="text-xl font-black text-slate-950 dark:text-white font-mono mt-0.5 block">
              {calculatedKpis.totalPatients.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4% vs last period
            </span>
          </div>
        </div>

        {/* Metric 2: Financial Revenue Strip */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm flex items-center gap-3.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />

          <div className="p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <DollarSign className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total Revenue</span>
            <span className="text-xl font-black text-slate-950 dark:text-white font-mono mt-0.5 block">
              ${calculatedKpis.totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8.1% growth rate
            </span>
          </div>
        </div>

        {/* Metric 3: Average Care Consultation Time */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm flex items-center gap-3.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />

          <div className="p-3 bg-violet-500/10 text-violet-600 dark:text-violet-400 rounded-xl">
            <Clock className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Avg Consult Time</span>
            <span className="text-xl font-black text-slate-950 dark:text-white font-mono mt-0.5 block">
              {calculatedKpis.avgConsultTime} min
            </span>
            <span className="text-[10px] text-blue-500 font-bold flex items-center gap-0.5 mt-0.5">
              <ArrowDownRight className="w-3.5 h-3.5" /> -4.5% optimization
            </span>
          </div>
        </div>

        {/* Metric 4: Follow-up rate & Retention */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4.5 rounded-2xl shadow-sm flex items-center gap-3.5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full group-hover:scale-110 transition-transform" />

          <div className="p-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
            <ThumbsUp className="w-5.5 h-5.5" />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Follow-up Retention</span>
            <span className="text-xl font-black text-slate-950 dark:text-white font-mono mt-0.5 block">
              {calculatedKpis.followUpRate}%
            </span>
            <span className="text-[10px] text-amber-500 font-bold block mt-0.5">
              Excelled Ret. Benchmark
            </span>
          </div>
        </div>

      </div>

      {/* ======================================================================
         INTERACTIVE TABS CONTAINER FOR HISTORICAL PLOTS
         ====================================================================== */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Navigation tabs row */}
        <div className="border-b border-slate-100 dark:border-slate-800/80 p-4 bg-slate-50/50 dark:bg-slate-950/20 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('financial')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'financial'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" /> Operational & Financials
          </button>
          <button
            onClick={() => setActiveTab('diseases')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'diseases'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" /> Disease & Diagnosis trends
          </button>
          <button
            onClick={() => setActiveTab('medicines')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'medicines'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Pill className="w-4 h-4" /> Prescriptions Allocation
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
              activeTab === 'doctors'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor clinical scorecards
          </button>
        </div>

        {/* Dynamic tab contents rendering */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === 'financial' && (
              <motion.div
                key="financial"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="text-base font-black text-slate-950 dark:text-white">Monthly Clinical Intake vs Billing Revenue</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Dual visualization tracing absolute registration totals, returning visits, and net income values.</p>
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold font-mono text-slate-400">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-500 rounded" /> NEW REGISTRATIONS</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-900 dark:bg-indigo-400 rounded" /> BILLING VALUE ($)</span>
                  </div>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyDatasets[selectedTimeframe]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="revenueColor" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                          borderColor: '#1E293B', 
                          borderRadius: '12px',
                          color: '#FFF',
                          fontSize: '11px'
                        }}
                      />
                      <Area type="monotone" dataKey="revenue" name="Financial Revenue ($)" stroke="#4F46E5" fillOpacity={1} fill="url(#revenueColor)" strokeWidth={2.5} />
                      <Bar dataKey="newPatients" name="Newly Enrolled" fill="#3B82F6" radius={[4, 4, 0, 0]} barSize={22} />
                      <Bar dataKey="regularVisits" name="Returning Consults" fill="#94A3B8" radius={[4, 4, 0, 0]} barSize={12} opacity={0.3} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === 'diseases' && (
              <motion.div
                key="diseases"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white">Epidemiological Disease Frequency Analysis</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Chronological line diagnostics for patient cases classified under critical cardiovascular or hypertensive categories.</p>
                </div>

                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={diseaseTrendsData[selectedTimeframe]} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" vertical={false} />
                      <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                          borderColor: '#1E293B', 
                          borderRadius: '12px',
                          color: '#FFF',
                          fontSize: '11px'
                        }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                      <Line type="monotone" dataKey="Hypertension" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="CAD" stroke="#3B82F6" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Arrhythmia" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="HeartFailure" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="Diabetes" stroke="#8B5CF6" strokeWidth={2.5} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            )}

            {activeTab === 'medicines' && (
              <motion.div
                key="medicines"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6"
              >
                {/* Horizontal Bar Chart (Col 8) */}
                <div className="lg:col-span-8 space-y-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">Top Prescribed Cardiac Pharmacotherapy</h3>
                    <p className="text-slate-500 text-xs mt-0.5">Volume comparison of primary medications combined with audited daily patient compliance scores.</p>
                  </div>

                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={medicineUsageData} layout="vertical" margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" horizontal={false} />
                        <XAxis type="number" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                        <YAxis dataKey="name" type="category" stroke="#94A3B8" fontSize={11} width={80} tickLine={false} axisLine={false} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                            borderColor: '#1E293B', 
                            borderRadius: '12px',
                            color: '#FFF',
                            fontSize: '11px'
                          }}
                        />
                        <Bar dataKey="prescriptions" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                          {medicineUsageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Legend list with compliance grades (Col 4) */}
                <div className="lg:col-span-4 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 p-4 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2.5 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Compliance Auditing
                    </h4>
                    <p className="text-[11px] text-slate-500 leading-relaxed mb-4">
                      Average therapeutic adherence measured through secure smart pharmacy logging API records.
                    </p>

                    <div className="space-y-3">
                      {medicineUsageData.map((item, idx) => (
                        <div key={item.name} className="space-y-1">
                          <div className="flex justify-between items-center text-[11px] font-semibold">
                            <span className="text-slate-800 dark:text-slate-300 flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                              {item.name} <span className="text-slate-400 font-normal">({item.type})</span>
                            </span>
                            <span className="font-mono text-emerald-500">{item.compliance}%</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ backgroundColor: item.color, width: `${item.compliance}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'doctors' && (
              <motion.div
                key="doctors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div>
                  <h3 className="text-base font-black text-slate-950 dark:text-white">Clinician Performance Scorecards</h3>
                  <p className="text-slate-500 text-xs mt-0.5">Operational throughput metrics, satisfaction benchmarks, and consultation length times per physician.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {doctorPerformanceData.map((doc, idx) => (
                    <div 
                      key={doc.name} 
                      className="border border-slate-200 dark:border-slate-800 p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-inner flex flex-col justify-between gap-4 relative overflow-hidden group"
                    >
                      <div className="absolute top-0 right-0 w-12 h-12 bg-blue-500/5 rounded-bl-3xl group-hover:scale-105 transition-transform" />
                      
                      <div className="space-y-1">
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          {doc.specialty}
                        </span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mt-1.5">{doc.name}</h4>
                        <div className="flex items-center gap-1 text-xs mt-1">
                          <span className="text-slate-400 font-semibold">Care Rating:</span>
                          <span className="font-bold text-amber-500 flex items-center gap-0.5 font-mono">★ {doc.rating} ({doc.satisfaction}%)</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 border-t border-slate-100 dark:border-slate-800/60 pt-3 text-[11px] font-semibold font-mono">
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Total Patients</span>
                          <span className="text-slate-800 dark:text-slate-200 block mt-0.5">{doc.patients}</span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Avg Consult</span>
                          <span className="text-slate-800 dark:text-slate-200 block mt-0.5">{doc.consultTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* ======================================================================
         SECONDARY INSIGHTS ROW (WEEKLY TRENDS vs PATIENT DEMOGRAPHICS)
         ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly load: Completed vs Cancelled stack bar chart (Col 7) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Schedulers Appointment Volume trends</h3>
            <p className="text-xs text-slate-500 mt-0.5">Weekly volume breakdown mapping Completed, Pending, and Walk-In clinical sessions.</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={appointmentTrendsWeekly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.2)" vertical={false} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: '#1E293B', 
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', marginTop: '10px' }} />
                <Bar dataKey="Completed" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Pending" stackId="a" fill="#3B82F6" radius={[0, 0, 0, 0]} />
                <Bar dataKey="WalkIn" stackId="a" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Patient Demographics age profile donut chart (Col 5) */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider">Patient Age Demographics</h3>
            <p className="text-xs text-slate-500 mt-0.5">Comprehensive segmentation profile of current clinic database registry.</p>
          </div>

          <div className="h-44 w-full relative flex items-center justify-center my-3">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={demographicData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {demographicData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', 
                    borderColor: '#1E293B', 
                    borderRadius: '12px',
                    color: '#FFF',
                    fontSize: '11px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="absolute text-center select-none pointer-events-none">
              <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Median Age</span>
              <span className="text-xl font-black text-slate-950 dark:text-white">52</span>
              <span className="text-[9px] text-slate-400 block font-semibold">Years Old</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/60 pt-3">
            {demographicData.map((item, idx) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: <strong className="text-slate-950 dark:text-white font-mono">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ======================================================================
         EXPORT COMPILER MODAL / PREVIEW DRAWER (PORTAL PDF COMPILATION)
         ====================================================================== */}
      <AnimatePresence>
        {isExporting && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 text-white max-w-sm w-full p-6 rounded-3xl text-center shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent animate-spin mx-auto mb-4" />
              <h3 className="text-base font-black tracking-tight">Compiling Hospital Report</h3>
              <p className="text-slate-400 text-xs mt-1.5 font-mono">{exportStep}</p>
            </motion.div>
          </motion.div>
        )}

        {showReportPreview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white text-slate-950 max-w-3xl w-full rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            >
              
              {/* Report Header Action Strip */}
              <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-blue-400 leading-none">DOCO Enterprise Report</h3>
                    <h4 className="text-sm font-bold tracking-tight mt-1 leading-none">Executive Performance Audit.pdf</h4>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      window.print();
                    }}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print File
                  </button>
                  <button
                    onClick={() => setShowReportPreview(false)}
                    className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg transition-colors"
                  >
                    Dismiss Preview
                  </button>
                </div>
              </div>

              {/* Physical Document Paper Space */}
              <div className="p-8 space-y-6 max-h-[75vh] overflow-y-auto bg-slate-50 font-sans">
                
                {/* Physical Hospital Letterhead */}
                <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-black text-slate-900 tracking-tight">DOCO CARDIOLOGY INSTITUTIONS</h2>
                    <p className="text-xs text-slate-500 font-semibold font-mono mt-0.5">300 Health Science Blvd, Suite 140 • Cardiology ICU Division</p>
                    <p className="text-xs text-slate-500 font-semibold font-mono">Institutional Sync Ledger ID: #DOCO-EHR-88204-NYC</p>
                  </div>
                  <div className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                    <div>DATE: July 3, 2026</div>
                    <div>STATUS: CLASSIFIED EXECUTIVE</div>
                  </div>
                </div>

                {/* Report Meta Summary Block */}
                <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">1. Operational Executive Executive Summary</h3>
                  <p className="text-xs text-slate-700 leading-relaxed font-semibold">
                    This document certifies the calculated clinic and billing throughputs recorded in the DOCO clinical databases. During the audited period ({selectedTimeframe === '30days' ? 'Last 30 Days' : selectedTimeframe === '6months' ? 'Last 6 Months' : 'Year-to-Date'}), patient registries logged an enrollment flow exceeding {calculatedKpis.totalPatients} verified participants, generating a billing ledger reconciliation sum of ${calculatedKpis.totalRevenue.toLocaleString()}.
                  </p>
                </div>

                {/* Audited Metrics Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">2. Performance Auditing Metrics</h3>
                  
                  <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                          <th className="p-3">Audit Domain Category</th>
                          <th className="p-3 text-right">Target Bench</th>
                          <th className="p-3 text-right">Audited Value</th>
                          <th className="p-3 text-right">Adherence status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-150">
                          <td className="p-3 font-semibold text-slate-800">Total Patients Care Intake</td>
                          <td className="p-3 text-right font-mono text-slate-500">&gt; 100 cases</td>
                          <td className="p-3 text-right font-bold font-mono">{calculatedKpis.totalPatients} Cases</td>
                          <td className="p-3 text-right text-emerald-600 font-bold">✓ Exceeded</td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="p-3 font-semibold text-slate-800">Billing Financial Reconciliation</td>
                          <td className="p-3 text-right font-mono text-slate-500">N/A</td>
                          <td className="p-3 text-right font-bold font-mono">${calculatedKpis.totalRevenue.toLocaleString()}</td>
                          <td className="p-3 text-right text-emerald-600 font-bold">✓ Complete</td>
                        </tr>
                        <tr className="border-b border-slate-150">
                          <td className="p-3 font-semibold text-slate-800">Average Consultation Length</td>
                          <td className="p-3 text-right font-mono text-slate-500">&lt; 25 mins</td>
                          <td className="p-3 text-right font-bold font-mono">{calculatedKpis.avgConsultTime} mins</td>
                          <td className="p-3 text-right text-emerald-600 font-bold">✓ Optimized</td>
                        </tr>
                        <tr>
                          <td className="p-3 font-semibold text-slate-800">Follow-up Patient Retention</td>
                          <td className="p-3 text-right font-mono text-slate-500">&gt; 70.0%</td>
                          <td className="p-3 text-right font-bold font-mono">{calculatedKpis.followUpRate}%</td>
                          <td className="p-3 text-right text-emerald-600 font-bold">✓ Exceptional</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Prescribed Pharmaceutics Audit */}
                <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-sm space-y-2">
                  <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">3. Pharmaceutical Prescription Distribution</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {medicineUsageData.slice(0, 3).map((med, i) => (
                      <div key={i} className="border border-slate-100 p-2.5 rounded-lg bg-slate-50/50">
                        <span className="text-[9px] font-bold text-slate-400 block uppercase">{med.name}</span>
                        <strong className="text-xs text-slate-800 font-mono mt-0.5 block">{med.prescriptions} Prescribed</strong>
                        <span className="text-[10px] text-emerald-600 font-bold font-mono mt-0.5 block">{med.compliance}% compliance</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corporate Signature Blocks */}
                <div className="pt-8 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-semibold font-mono">
                  <div>
                    <div className="w-40 border-b border-slate-400 h-10" />
                    <p className="mt-1">Chief Executive Hospital Director</p>
                  </div>
                  <div className="text-right">
                    <p>Secured Verification ID: #QR-9942</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">HIPAA COMPLIANT DIGITAL ENVELOPE</p>
                  </div>
                </div>

              </div>

              {/* Dismiss footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => setShowReportPreview(false)}
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wide rounded-xl transition-all"
                >
                  Confirm & Lock Report
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
