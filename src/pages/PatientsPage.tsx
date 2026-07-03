/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, Dispatch, SetStateAction, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Filter, Plus, Calendar, Activity, Phone, Mail, 
  User, Clipboard, Heart, Save, X, PlusCircle, UserCheck,
  QrCode, Printer, FileText, Stethoscope, FilePlus, Eye, 
  HeartPulse, Sparkles, ChevronLeft, ChevronRight, RefreshCw, 
  AlertTriangle, Check, BookOpen, Layers, ShieldAlert, TrendingUp, Clock, Info
} from 'lucide-react';
import { Patient } from '../types';

interface PatientsPageProps {
  patients: Patient[];
  setPatients: Dispatch<SetStateAction<Patient[]>>;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  onNavigate?: (page: any) => void;
}

export default function PatientsPage({
  patients,
  setPatients,
  selectedPatient,
  setSelectedPatient,
  onNavigate
}: PatientsPageProps) {
  // 1. GRID STATE: Search, Filters, and Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [genderFilter, setGenderFilter] = useState<string>('All');
  const [bloodFilter, setBloodFilter] = useState<string>('All');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Selected small size to demonstrate pagination with 5 records

  // 2. MODAL DIALOG STATES
  const [isAddingPatient, setIsAddingPatient] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<Patient | null>(null);
  const [activeCertificateBuilder, setActiveCertificateBuilder] = useState<Patient | null>(null);
  const [activeLabViewer, setActiveLabViewer] = useState<{ patient: Patient; report: any } | null>(null);
  const [activeQrViewer, setActiveQrViewer] = useState<Patient | null>(null);

  // 3. CONSULTATION FORM STATE
  const [consultType, setConsultType] = useState('Standard Follow-up');
  const [consultBp, setConsultBp] = useState('120/80');
  const [consultHr, setConsultHr] = useState(72);
  const [consultSpo2, setConsultSpo2] = useState(98);
  const [consultTemp, setConsultTemp] = useState('98.6°F');
  const [consultWeight, setConsultWeight] = useState('160 lbs');
  const [consultGlucose, setGlucose] = useState('95 mg/dL');
  const [consultDiagnosis, setConsultDiagnosis] = useState('');
  const [consultTreatment, setConsultTreatment] = useState('');
  const [consultNotes, setConsultNotes] = useState('');

  // 4. CERTIFICATE FORM STATE
  const [certTemplate, setCertTemplate] = useState('Cardiological Fitness Clearance');
  const [certRestDays, setCertRestDays] = useState('0');
  const [certSymptomSummary, setCertSymptomSummary] = useState('Resting sinus rhythm stable, cardiac markers within normal ranges.');
  const [certRestrictions, setCertRestrictions] = useState('Avoid isometric weightlifting above 50 lbs for 2 weeks.');
  const [certGenerated, setCertGenerated] = useState<any | null>(null);

  // 5. NEW MEDICINE FORM STATE (INSIDE PROFILE)
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const [newMedFreq, setNewMedFreq] = useState('');

  // 6. NEW PATIENT REGISTRY FORM STATE
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientAge, setNewPatientAge] = useState('');
  const [newPatientGender, setNewPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [newPatientBlood, setNewPatientBlood] = useState('O+');
  const [newPatientCondition, setNewPatientCondition] = useState('');
  const [newPatientPhone, setNewPatientPhone] = useState('');
  const [newPatientEmail, setNewPatientEmail] = useState('');

  // Profile tabs state
  const [profileTab, setProfileTab] = useState<'overview' | 'history' | 'meds' | 'labs' | 'tracker'>('overview');

  // Handle resetting pagination on filter updates
  const handleSetStatusFilter = (val: string) => {
    setStatusFilter(val);
    setCurrentPage(1);
  };

  const handleSetGenderFilter = (val: string) => {
    setGenderFilter(val);
    setCurrentPage(1);
  };

  const handleSetBloodFilter = (val: string) => {
    setBloodFilter(val);
    setCurrentPage(1);
  };

  // Filter logic
  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.condition.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || patient.status === statusFilter;
    const matchesGender = genderFilter === 'All' || patient.gender === genderFilter;
    const matchesBlood = bloodFilter === 'All' || patient.bloodType === bloodFilter;
    return matchesSearch && matchesStatus && matchesGender && matchesBlood;
  });

  // Pagination calculation
  const totalItems = filteredPatients.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handle registering a new patient
  const handleCreatePatient = (e: FormEvent) => {
    e.preventDefault();
    if (!newPatientName || !newPatientAge || !newPatientCondition) return;

    const newPatient: Patient = {
      id: `pat-${String(patients.length + 1).padStart(3, '0')}`,
      name: newPatientName,
      age: parseInt(newPatientAge) || 35,
      gender: newPatientGender,
      bloodType: newPatientBlood,
      phone: newPatientPhone || '+1 (555) 000-0000',
      email: newPatientEmail || `${newPatientName.toLowerCase().replace(/\s+/g, '')}@email.com`,
      condition: newPatientCondition,
      status: 'Stable',
      lastVisit: new Date().toISOString().split('T')[0],
      avatar: `https://images.unsplash.com/photo-${1500000000000 + patients.length * 15000}?auto=format&fit=crop&q=80&w=150`,
      vitals: {
        bloodPressure: '120/80',
        heartRate: 72,
        oxygenLevel: 98,
        temperature: '98.6°F',
        weight: '165 lbs',
        glucose: '90 mg/dL',
        recordedAt: `${new Date().toISOString().split('T')[0]} 08:00 AM`
      },
      allergies: ['None reported'],
      currentMedications: [],
      previousPrescriptions: [],
      emergencyContacts: [
        { name: 'Family Contact', relationship: 'Next of Kin', phone: '+1 (555) 011-2233' }
      ],
      labReports: [],
      healthTrackerMetrics: [
        { date: new Date().toISOString().split('T')[0], steps: 5000, sleepHours: 7, activeCalories: 250, restingHeartRate: 72 }
      ],
      lifeQrCode: `DOCO_PAT_${String(patients.length + 1).padStart(3, '0')}_EMERGENCY`,
      history: [
        {
          date: new Date().toISOString().split('T')[0],
          diagnosis: newPatientCondition,
          treatment: 'Registry Intake Evaluation Completed',
          notes: 'Added to EMR database. Baseline clinic charts set up.'
        }
      ]
    };

    setPatients(prev => [newPatient, ...prev]);
    setIsAddingPatient(false);
    
    // Clear state
    setNewPatientName('');
    setNewPatientAge('');
    setNewPatientGender('Male');
    setNewPatientCondition('');
    setNewPatientPhone('');
    setNewPatientEmail('');
    setCurrentPage(1);
  };

  // Handle appending active medications inside Profile
  const handleAddMedication = (e: FormEvent, patientId: string) => {
    e.preventDefault();
    if (!newMedName || !newMedDosage) return;

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const meds = p.currentMedications || [];
        const updatedMeds = [
          ...meds,
          {
            name: newMedName,
            dosage: newMedDosage,
            frequency: newMedFreq || 'Once daily',
            startDate: new Date().toISOString().split('T')[0],
            status: 'Active' as const
          }
        ];
        const updated = { ...p, currentMedications: updatedMeds };
        if (selectedPatient?.id === patientId) setSelectedPatient(updated);
        return updated;
      }
      return p;
    }));

    setNewMedName('');
    setNewMedDosage('');
    setNewMedFreq('');
  };

  // Toggle medication status
  const handleToggleMedStatus = (patientId: string, medName: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId && p.currentMedications) {
        const updatedMeds = p.currentMedications.map(m => {
          if (m.name === medName) {
            return {
              ...m,
              status: m.status === 'Active' ? ('Discontinued' as const) : ('Active' as const)
            };
          }
          return m;
        });
        const updated = { ...p, currentMedications: updatedMeds };
        if (selectedPatient?.id === patientId) setSelectedPatient(updated);
        return updated;
      }
      return p;
    }));
  };

  // Start Consultation trigger init
  const handleOpenConsultation = (patient: Patient) => {
    if (onNavigate) {
      setSelectedPatient(patient);
      onNavigate('consultation');
      return;
    }
    setActiveConsultation(patient);
    setConsultBp(patient.vitals?.bloodPressure || '120/80');
    setConsultHr(patient.vitals?.heartRate || 72);
    setConsultSpo2(patient.vitals?.oxygenLevel || 98);
    setConsultTemp(patient.vitals?.temperature || '98.6°F');
    setConsultWeight(patient.vitals?.weight || '160 lbs');
    setGlucose(patient.vitals?.glucose || '95 mg/dL');
    setConsultDiagnosis(patient.condition);
    setConsultTreatment('');
    setConsultNotes('');
  };

  // Submit live consultation records
  const handleSubmitConsultation = (e: FormEvent) => {
    e.preventDefault();
    if (!activeConsultation) return;

    const patientId = activeConsultation.id;
    const dateStr = new Date().toISOString().split('T')[0];

    const newHistoryItem = {
      date: dateStr,
      diagnosis: consultDiagnosis || 'Routine Cardiovascular Clearance',
      treatment: consultTreatment || 'Continued current medical therapy.',
      notes: consultNotes || 'Regular consult completed. Stable metrics checked.'
    };

    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        const updated = {
          ...p,
          status: consultHr > 100 || consultSpo2 < 95 ? ('Under Observation' as const) : p.status,
          condition: consultDiagnosis || p.condition,
          lastVisit: dateStr,
          vitals: {
            bloodPressure: consultBp,
            heartRate: consultHr,
            oxygenLevel: consultSpo2,
            temperature: consultTemp,
            weight: consultWeight,
            glucose: consultGlucose,
            recordedAt: `${dateStr} ${new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
          },
          history: [newHistoryItem, ...p.history]
        };
        setSelectedPatient(updated);
        return updated;
      }
      return p;
    }));

    setActiveConsultation(null);
  };

  // Open Certificate Builder
  const handleOpenCertificate = (patient: Patient) => {
    setActiveCertificateBuilder(patient);
    setCertTemplate('Cardiological Fitness Clearance');
    setCertRestDays('0');
    setCertSymptomSummary(`Patient assessed post evaluation. Blood pressure is stable. Clear cardiac sounds with no focal arrhythmias.`);
    setCertRestrictions('No strenuous coronary exertion. Standard hydration recommended.');
    setCertGenerated(null);
  };

  // Generate certificate
  const handleGenerateCertSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeCertificateBuilder) return;

    const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const referenceId = `DOCO-CERT-${Math.floor(100000 + Math.random() * 900000)}`;

    setCertGenerated({
      patientName: activeCertificateBuilder.name,
      patientId: activeCertificateBuilder.id,
      age: activeCertificateBuilder.age,
      gender: activeCertificateBuilder.gender,
      bloodType: activeCertificateBuilder.bloodType,
      date: dateStr,
      referenceId,
      template: certTemplate,
      restDays: certRestDays,
      symptoms: certSymptomSummary,
      restrictions: certRestrictions,
      signedBy: 'Dr. Adithi, MD',
      signatureStamp: 'DOCO_SECURE_AUTH_ADITHI_CRITICAL_CARDIO'
    });
  };

  return (
    <div className="space-y-6">
      
      <AnimatePresence mode="wait">
        {!selectedPatient ? (
          /* ======================================================================
             1. MAIN PATIENT REGISTRY / LISTING VIEW
             ====================================================================== */
          <motion.div
            key="list-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Header section */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white tracking-tight">Patient Registry</h2>
                <p className="text-slate-500 dark:text-slate-400 text-xs">Direct care records, diagnostic histories, and emergency LifeQR telemetry keys</p>
              </div>
              <button
                onClick={() => setIsAddingPatient(true)}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-2xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
              >
                <Plus className="w-4 h-4" /> Register Patient Chart
              </button>
            </div>

            {/* Filter and Advanced Search Widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row gap-3.5 items-center">
                {/* Search Input */}
                <div className="relative flex-1 w-full">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search patient by name, primary diagnosis, EMR ID..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 rounded-2xl py-2.5 pl-10 pr-4 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Tag/Filter Selectors Row */}
              <div className="flex flex-wrap gap-4 items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
                <div className="flex flex-wrap gap-3 items-center">
                  {/* Status filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-slate-500 dark:text-slate-400">
                    <Activity className="w-3.5 h-3.5 text-blue-500" />
                    <span className="font-bold">Status:</span>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => handleSetStatusFilter(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer pr-1"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Stable">Stable</option>
                      <option value="Recovering">Recovering</option>
                      <option value="Under Observation">Under Observation</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  {/* Gender filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-slate-500 dark:text-slate-400">
                    <User className="w-3.5 h-3.5 text-indigo-500" />
                    <span className="font-bold">Gender:</span>
                    <select 
                      value={genderFilter} 
                      onChange={(e) => handleSetGenderFilter(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer pr-1"
                    >
                      <option value="All">All Genders</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {/* Blood Type filter */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-2xl border border-slate-150 dark:border-slate-800/60 text-slate-500 dark:text-slate-400">
                    <Heart className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span className="font-bold">Blood:</span>
                    <select 
                      value={bloodFilter} 
                      onChange={(e) => handleSetBloodFilter(e.target.value)}
                      className="bg-transparent font-semibold text-slate-800 dark:text-slate-200 outline-none cursor-pointer pr-1"
                    >
                      <option value="All">All Blood Types</option>
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Reset Filters Quick Button */}
                {(statusFilter !== 'All' || genderFilter !== 'All' || bloodFilter !== 'All' || searchTerm) && (
                  <button 
                    onClick={() => {
                      setStatusFilter('All');
                      setGenderFilter('All');
                      setBloodFilter('All');
                      setSearchTerm('');
                      setCurrentPage(1);
                    }}
                    className="text-xs text-blue-600 dark:text-blue-400 font-extrabold hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Patients Master Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {paginatedPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => { setSelectedPatient(patient); setProfileTab('overview'); }}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-500/40 dark:hover:border-blue-500/30 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden h-[330px]"
                >
                  {/* Subtle status left border indicator */}
                  <div className={`absolute top-0 bottom-0 left-0 w-1.5 ${
                    patient.status === 'Stable' 
                      ? 'bg-emerald-500' 
                      : patient.status === 'Recovering' 
                      ? 'bg-blue-500' 
                      : patient.status === 'Critical' 
                      ? 'bg-red-500' 
                      : 'bg-amber-500'
                  }`} />

                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={patient.avatar} 
                          alt={patient.name} 
                          className="w-12 h-12 rounded-full object-cover ring-4 ring-slate-100 dark:ring-slate-800 group-hover:scale-102 transition-transform"
                        />
                        <div>
                          <h3 className="text-sm font-black text-slate-950 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                            {patient.name}
                          </h3>
                          <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block mt-0.5">{patient.id} • {patient.gender}, {patient.age} y/o</span>
                        </div>
                      </div>
                      <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 border ${
                        patient.status === 'Stable' 
                          ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' 
                          : patient.status === 'Recovering' 
                          ? 'bg-blue-500/5 text-blue-500 border-blue-500/10' 
                          : patient.status === 'Critical' 
                          ? 'bg-red-500/5 text-red-500 border-red-500/10 animate-pulse' 
                          : 'bg-amber-500/5 text-amber-500 border-amber-500/10'
                      }`}>
                        {patient.status}
                      </span>
                    </div>

                    {/* Condition block */}
                    <div className="mt-4 bg-slate-50 dark:bg-slate-950 p-3.5 rounded-2xl border border-slate-150 dark:border-slate-800/40">
                      <span className="text-[9px] font-extrabold text-slate-400 dark:text-slate-500 block uppercase tracking-wider mb-1">Primary Diagnosis</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 line-clamp-1">{patient.condition}</p>
                    </div>

                    {/* Quick Vitals Metrics list */}
                    <div className="mt-4 grid grid-cols-2 gap-2 text-[10px]">
                      <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 p-2 rounded-xl flex items-center justify-between">
                        <span className="text-slate-400 font-medium">B.P:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-300 font-mono">{patient.vitals?.bloodPressure || '--'}</span>
                      </div>
                      <div className="bg-slate-50/50 dark:bg-slate-950/40 border border-slate-100 dark:border-slate-800/40 p-2 rounded-xl flex items-center justify-between">
                        <span className="text-slate-400 font-medium">Heart Rate:</span>
                        <span className={`font-bold font-mono ${patient.vitals && patient.vitals.heartRate > 100 ? 'text-red-500' : 'text-slate-800 dark:text-slate-300'}`}>{patient.vitals?.heartRate ? `${patient.vitals.heartRate} bpm` : '--'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-[10px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-500" /> Last Visit: {patient.lastVisit}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 dark:text-slate-300 font-mono bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">{patient.bloodType}</span>
                      <QrCode className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  </div>
                </div>
              ))}

              {filteredPatients.length === 0 && (
                <div className="col-span-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-16 text-center rounded-3xl">
                  <User className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3.5" />
                  <h4 className="text-sm font-black text-slate-800 dark:text-white">No Clinical Registry Records Found</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1.5 max-w-md mx-auto">None of the clinical files match your combined criteria. Refine your query or create a fresh electronic registry record.</p>
                </div>
              )}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-4 pb-2 text-xs text-slate-500 dark:text-slate-400">
                <span>
                  Showing <strong className="text-slate-800 dark:text-slate-200">{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong className="text-slate-800 dark:text-slate-200">{Math.min(currentPage * itemsPerPage, totalItems)}</strong> of <strong className="text-slate-800 dark:text-slate-200">{totalItems}</strong> clinical files
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-7 h-7 font-bold rounded-xl transition-all ${
                        currentPage === idx + 1
                          ? 'bg-blue-600 text-white'
                          : 'border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    className="p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          /* ======================================================================
             2. IMMERSIVE PATIENT EHR WORKSTATION / DETAIL VIEW
             ====================================================================== */
          <motion.div
            key="detail-view"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Top Back Navigation Bar & Actions Panel */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm">
              <div className="flex items-center gap-3.5">
                <button
                  onClick={() => setSelectedPatient(null)}
                  className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all border border-slate-200 dark:border-slate-800"
                >
                  ← Registry List
                </button>
                <div className="flex items-center gap-3">
                  <img 
                    src={selectedPatient.avatar} 
                    alt={selectedPatient.name} 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black text-slate-950 dark:text-white leading-tight">{selectedPatient.name}</h3>
                      <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">{selectedPatient.id}</span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {selectedPatient.gender}, {selectedPatient.age} years old • Blood: <strong className="text-slate-900 dark:text-slate-200">{selectedPatient.bloodType}</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Workstation Action Center */}
              <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
                {/* 1. START CONSULTATION */}
                <button
                  onClick={() => handleOpenConsultation(selectedPatient)}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10"
                >
                  <Stethoscope className="w-3.5 h-3.5" /> Consultation
                </button>

                {/* 2. GENERATE CERTIFICATE */}
                <button
                  onClick={() => handleOpenCertificate(selectedPatient)}
                  className="flex-1 md:flex-none px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all border border-slate-250 dark:border-slate-750 flex items-center justify-center gap-1.5"
                >
                  <FilePlus className="w-3.5 h-3.5" /> Certificate
                </button>

                {/* 3. EMERGENCY SECURE QR */}
                <button
                  onClick={() => setActiveQrViewer(selectedPatient)}
                  className="px-3.5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-extrabold uppercase tracking-wider rounded-2xl transition-all border border-red-500/20 flex items-center justify-center gap-1.5"
                >
                  <QrCode className="w-3.5 h-3.5" /> LifeQR Code
                </button>
              </div>
            </div>

            {/* Tab Navigation for Clinical Workstation */}
            <div className="border-b border-slate-200 dark:border-slate-800 flex overflow-x-auto scrollbar-none gap-1.5 pt-1">
              {[
                { id: 'overview', label: 'EHR Overview', icon: BookOpen },
                { id: 'history', label: 'Clinical History & Logs', icon: Clipboard },
                { id: 'meds', label: 'Medications & Prescriptions', icon: Activity },
                { id: 'labs', label: 'Lab & Diagnostic Reports', icon: FileText },
                { id: 'tracker', label: 'Live Health Tracker', icon: TrendingUp }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = profileTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setProfileTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 font-bold text-xs uppercase tracking-wider transition-all whitespace-nowrap border-b-2 shrink-0 ${
                      isActive 
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/10' 
                        : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Contents Frame */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                {/* ----------------- TAB: OVERVIEW ----------------- */}
                {profileTab === 'overview' && (
                  <motion.div
                    key="tab-overview"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                  >
                    {/* Left & Middle Area */}
                    <div className="lg:col-span-2 space-y-6">
                      {/* Vitals Summary Row (Bento Grid) */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm">
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800/60 mb-4">
                          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Recorded Physiological Vitals</h4>
                          <span className="text-[10px] text-slate-500 font-mono">Last Synchronized: {selectedPatient.vitals?.recordedAt || 'Just now'}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {/* BP */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/40 space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase">Blood Pressure</span>
                            <div className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1">
                              {selectedPatient.vitals?.bloodPressure || '--'}
                            </div>
                            <span className="text-[9px] text-emerald-500 font-extrabold uppercase">✓ Stable Range</span>
                          </div>

                          {/* HR */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/40 space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase">Heart Rate</span>
                            <div className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1 flex items-baseline gap-1">
                              {selectedPatient.vitals?.heartRate || '--'} <span className="text-[10px] text-slate-400 font-normal">bpm</span>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase ${selectedPatient.vitals && selectedPatient.vitals.heartRate > 100 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {selectedPatient.vitals && selectedPatient.vitals.heartRate > 100 ? '⚠️ Tachycardia' : '✓ Sinus Pace'}
                            </span>
                          </div>

                          {/* SpO2 */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/40 space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase">Oxygen Saturation</span>
                            <div className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1 flex items-baseline gap-1">
                              {selectedPatient.vitals?.oxygenLevel || '--'}<span className="text-[10px] text-slate-400 font-normal">%</span>
                            </div>
                            <span className={`text-[9px] font-extrabold uppercase ${selectedPatient.vitals && selectedPatient.vitals.oxygenLevel < 95 ? 'text-red-500' : 'text-emerald-500'}`}>
                              {selectedPatient.vitals && selectedPatient.vitals.oxygenLevel < 95 ? '⚠️ SpO2 Alert' : '✓ Normal O₂'}
                            </span>
                          </div>

                          {/* Weight */}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/40 space-y-1">
                            <span className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase">Dry Body Weight</span>
                            <div className="text-lg font-black text-slate-900 dark:text-white font-mono leading-none mt-1">
                              {selectedPatient.vitals?.weight || '--'}
                            </div>
                            <span className="text-[9px] text-slate-400 font-bold uppercase">Measured</span>
                          </div>
                        </div>
                      </div>

                      {/* Primary Diagnostic Summary */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                        <div>
                          <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Active Diagnosis Overview</h4>
                          <h5 className="text-sm font-black text-slate-900 dark:text-white mt-1.5 leading-snug">{selectedPatient.condition}</h5>
                        </div>
                        <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed font-medium">
                          Patient is currently undergoing regular clinical maintenance in the Cardiology department. Primary clinical guidelines enforce sodium containment, continuous telemetry alarm watches, and periodic lipid checks. Refer to detailed logs under the Clinical History tab.
                        </p>
                      </div>
                    </div>

                    {/* Right Sidebar: Emergency Card, Allergies, Contacts */}
                    <div className="space-y-6">
                      
                      {/* Emergency Call-out Lockscreen badge */}
                      <div className="bg-gradient-to-br from-red-950 to-slate-950 text-white p-5 rounded-3xl border border-red-900/40 space-y-4 relative overflow-hidden shadow-lg">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/5 rounded-full blur-2xl" />
                        
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/30">
                              <ShieldAlert className="w-3 h-3 text-red-500" /> Secure Emergency LifeQR
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-400 tracking-tight mt-2 uppercase">Emergency QR Medical Pass</h4>
                          </div>
                          <QrCode className="w-10 h-10 text-red-500 opacity-80" />
                        </div>

                        <div className="space-y-2 text-[11px] pt-1 border-t border-red-900/30">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Status ID:</span>
                            <span className="font-mono text-red-400 font-bold">{selectedPatient.lifeQrCode || 'DOCO-EMERG-SEC'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Allergies:</span>
                            <span className="font-bold text-red-500 line-clamp-1">
                              {selectedPatient.allergies?.join(', ') || 'No known allergies'}
                            </span>
                          </div>
                        </div>

                        <button 
                          onClick={() => setActiveQrViewer(selectedPatient)}
                          className="w-full py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-wider rounded-2xl transition-all shadow-md shadow-red-500/15"
                        >
                          View Emergency Lock-screen Card ➜
                        </button>
                      </div>

                      {/* Allergies & Emergency Contacts block */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                        {/* Allergies */}
                        <div>
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-2">Critical Allergies</span>
                          <div className="flex flex-wrap gap-1.5">
                            {selectedPatient.allergies && selectedPatient.allergies.length > 0 ? (
                              selectedPatient.allergies.map((allg, idx) => (
                                <span key={idx} className="px-2.5 py-1 rounded-xl text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/15">
                                  ⚠️ {allg}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500 font-medium">No allergies reported.</span>
                            )}
                          </div>
                        </div>

                        {/* Emergency contact info */}
                        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 space-y-2.5">
                          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Primary Emergency Contact</span>
                          {selectedPatient.emergencyContacts?.map((ec, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-800/40 text-xs">
                              <h5 className="font-extrabold text-slate-900 dark:text-white">{ec.name}</h5>
                              <p className="text-[10px] text-slate-400 font-bold mt-0.5">{ec.relationship}</p>
                              <p className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1"><Phone className="w-3 h-3" /> {ec.phone}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* ----------------- TAB: HISTORY & LOGS ----------------- */}
                {profileTab === 'history' && (
                  <motion.div
                    key="tab-history"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    {/* Clinical timeline node append tool */}
                    <div className="bg-blue-500/5 border border-blue-500/15 p-5 rounded-3xl space-y-4">
                      <div className="flex items-center gap-2">
                        <Clipboard className="w-5 h-5 text-blue-600" />
                        <div>
                          <h4 className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Append Direct Clinician Observation Log</h4>
                          <p className="text-slate-500 text-[10px] font-bold">Write a verified EMR history block directly into the timeline ledger</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="diag-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Diagnosis Title / Trigger Condition</label>
                          <input
                            id="diag-input"
                            type="text"
                            placeholder="e.g. Mild Atrial Fibrillation paroxysm checked"
                            value={consultDiagnosis}
                            onChange={(e) => setConsultDiagnosis(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                          />
                        </div>
                        <div>
                          <label htmlFor="treat-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Therapy / Prescribed Treatment adjustment</label>
                          <input
                            id="treat-input"
                            type="text"
                            placeholder="e.g. Prescribed Metoprolol 25mg QD dosage"
                            value={consultTreatment}
                            onChange={(e) => setConsultTreatment(e.target.value)}
                            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="notes-textarea" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Diagnostic Observation Notes</label>
                        <textarea
                          id="notes-textarea"
                          rows={2}
                          placeholder="Record specific patient feedback, lifestyle remarks, compliance logs..."
                          value={consultNotes}
                          onChange={(e) => setConsultNotes(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all resize-none"
                        />
                      </div>

                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          if (!consultDiagnosis || !consultTreatment) return;
                          
                          const dateStr = new Date().toISOString().split('T')[0];
                          const newHistoryItem = {
                            date: dateStr,
                            diagnosis: consultDiagnosis,
                            treatment: consultTreatment,
                            notes: consultNotes || 'No supplementary comments.'
                          };

                          setPatients(prev => prev.map(p => {
                            if (p.id === selectedPatient.id) {
                              const updated = {
                                ...p,
                                condition: consultDiagnosis,
                                lastVisit: dateStr,
                                history: [newHistoryItem, ...p.history]
                              };
                              setSelectedPatient(updated);
                              return updated;
                            }
                            return p;
                          }));

                          setConsultDiagnosis('');
                          setConsultTreatment('');
                          setConsultNotes('');
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
                      >
                        <Save className="w-3.5 h-3.5" /> Append History Ledger
                      </button>
                    </div>

                    {/* Historical clinical timeline nodes */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800/60">Verified Medical Records Timeline</h4>
                      
                      <div className="space-y-5 pt-2">
                        {selectedPatient.history.map((hist, idx) => (
                          <div key={idx} className="relative pl-6 pb-2 last:pb-0">
                            {/* Spine Line */}
                            <div className="absolute left-2.5 top-2.5 bottom-0 w-0.5 bg-slate-100 dark:bg-slate-800 last:hidden" />
                            {/* Marker dot */}
                            <div className="absolute left-1 top-2.5 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-blue-500/10" />

                            <div className="space-y-1">
                              <span className="font-mono text-[10px] text-slate-400 font-bold block">{hist.date}</span>
                              <h5 className="text-xs font-extrabold text-slate-950 dark:text-white">{hist.diagnosis}</h5>
                              <p className="text-xs text-slate-600 dark:text-slate-400 leading-normal"><strong className="text-blue-600 dark:text-blue-400 font-bold">Treatment Plan:</strong> {hist.treatment}</p>
                              <p className="text-[11px] text-slate-400 dark:text-slate-500 italic mt-1 leading-normal font-medium">Remarks: "{hist.notes}"</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ----------------- TAB: MEDICATIONS ----------------- */}
                {profileTab === 'meds' && (
                  <motion.div
                    key="tab-meds"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {/* Active Therapy prescriptions */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800/60">Active Treatment Regimens</h4>
                      
                      <div className="space-y-3 pt-1">
                        {selectedPatient.currentMedications && selectedPatient.currentMedications.length > 0 ? (
                          selectedPatient.currentMedications.map((med, idx) => (
                            <div 
                              key={idx} 
                              className={`p-4 rounded-2xl border transition-all flex justify-between items-center ${
                                med.status === 'Active' 
                                  ? 'bg-emerald-500/5 border-emerald-500/15' 
                                  : 'bg-slate-50 dark:bg-slate-950 border-slate-150 dark:border-slate-850 opacity-60'
                              }`}
                            >
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-2">
                                  <h5 className="font-extrabold text-slate-950 dark:text-white leading-none">{med.name}</h5>
                                  <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                    med.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-150 dark:bg-slate-800 text-slate-400'
                                  }`}>
                                    {med.status}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">Dosage: <strong className="text-slate-900 dark:text-slate-200 font-bold">{med.dosage}</strong> • {med.frequency}</p>
                                <p className="text-[9px] text-slate-400 font-mono">Started: {med.startDate}</p>
                              </div>

                              <button
                                onClick={() => handleToggleMedStatus(selectedPatient.id, med.name)}
                                className={`px-2.5 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all ${
                                  med.status === 'Active'
                                    ? 'border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500/10'
                                    : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10'
                                }`}
                              >
                                {med.status === 'Active' ? 'Discontinue' : 'Reactivate'}
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-xs text-slate-500">
                            No active medications found. Add standard cardiac drugs below.
                          </div>
                        )}
                      </div>

                      {/* Add new medication inline form */}
                      <form onSubmit={(e) => handleAddMedication(e, selectedPatient.id)} className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-3">
                        <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block">Add Therapy Prescription</span>
                        
                        <div className="grid grid-cols-2 gap-2.5">
                          <input
                            type="text"
                            placeholder="Drug name (e.g. Metoprolol)"
                            value={newMedName}
                            onChange={(e) => setNewMedName(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                          />
                          <input
                            type="text"
                            placeholder="Dose (e.g. 25mg)"
                            value={newMedDosage}
                            onChange={(e) => setNewMedDosage(e.target.value)}
                            required
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Frequency (e.g. Once daily QD)"
                          value={newMedFreq}
                          onChange={(e) => setNewMedFreq(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 rounded-xl px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all"
                        />
                        <button
                          type="submit"
                          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider transition-all flex justify-center items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" /> Prescribe Treatment
                        </button>
                      </form>
                    </div>

                    {/* Previous Prescriptions History ledger */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800/60">Prescription History Ledger</h4>
                      
                      <div className="space-y-3 pt-1">
                        {selectedPatient.previousPrescriptions && selectedPatient.previousPrescriptions.length > 0 ? (
                          selectedPatient.previousPrescriptions.map((rx) => (
                            <div key={rx.id} className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800/40 rounded-2xl text-xs space-y-1">
                              <div className="flex justify-between items-center">
                                <h5 className="font-extrabold text-slate-800 dark:text-slate-200">{rx.name} ({rx.dosage})</h5>
                                <span className="text-[9px] text-slate-400 font-mono">{rx.date}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Frequency: {rx.frequency} • Prescribed by {rx.doctorName}</p>
                              <p className="text-[9px] font-mono text-slate-400">Ledger ID: {rx.id} • Refills Authorized: {rx.refills}</p>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-xs text-slate-500">
                            No archived prescriptions.
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ----------------- TAB: LAB REPORTS ----------------- */}
                {profileTab === 'labs' && (
                  <motion.div
                    key="tab-labs"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4"
                  >
                    <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/60">
                      <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Laboratory Diagnostics Portal</h4>
                      <span className="text-[10px] text-slate-500 font-bold uppercase flex items-center gap-1"><Info className="w-3.5 h-3.5 text-blue-500" /> Click "View Report" for looped vector telemetry</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {selectedPatient.labReports && selectedPatient.labReports.length > 0 ? (
                        selectedPatient.labReports.map((report) => (
                          <div 
                            key={report.id} 
                            className={`p-4 rounded-3xl border flex flex-col justify-between gap-3 ${
                              report.status === 'Flagged' 
                                ? 'bg-red-500/5 border-red-500/15' 
                                : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800/40'
                            }`}
                          >
                            <div className="space-y-1 text-xs">
                              <div className="flex justify-between items-start">
                                <span className="text-[9px] font-mono text-slate-400">{report.category} • {report.id}</span>
                                <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  report.status === 'Flagged' 
                                    ? 'bg-red-500/15 text-red-500' 
                                    : report.status === 'Completed' 
                                    ? 'bg-emerald-500/10 text-emerald-500' 
                                    : 'bg-amber-500/10 text-amber-500'
                                }`}>
                                  {report.status}
                                </span>
                              </div>
                              <h5 className="font-extrabold text-slate-950 dark:text-white">{report.testName}</h5>
                              <p className="text-[10px] font-mono text-slate-400 font-bold">{report.date}</p>
                              
                              <div className="mt-2 bg-white dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60 font-mono text-[11px] leading-relaxed">
                                <span className="text-[9px] font-bold text-slate-400 block uppercase font-sans mb-0.5">Report Result</span>
                                <span className={report.status === 'Flagged' ? 'text-red-500 font-bold' : 'text-slate-800 dark:text-slate-200 font-semibold'}>{report.result}</span>
                              </div>
                              <p className="text-[9px] text-slate-400 pt-1">Ref Range: {report.referenceRange}</p>
                            </div>

                            <button
                              onClick={() => setActiveLabViewer({ patient: selectedPatient, report })}
                              className="w-full py-1.5 bg-slate-100 hover:bg-blue-600 dark:bg-slate-900 dark:hover:bg-blue-600 text-slate-800 dark:text-slate-200 hover:text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800 flex justify-center items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" /> View Telemetry Waveform
                            </button>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-12 text-xs text-slate-500">
                          No laboratory test reports on file.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ----------------- TAB: HEALTH TRACKER ----------------- */}
                {profileTab === 'tracker' && (
                  <motion.div
                    key="tab-tracker"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="space-y-6"
                  >
                    {/* Visual metrics cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Steps */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm text-xs space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Daily Steps</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-black text-slate-950 dark:text-white font-mono">{selectedPatient.healthTrackerMetrics?.[0]?.steps || '--'}</span>
                          <span className="text-[10px] text-slate-400 font-bold">/ 10k steps</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(((selectedPatient.healthTrackerMetrics?.[0]?.steps || 0) / 10000) * 100, 100)}%` }} />
                        </div>
                      </div>

                      {/* Sleep */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm text-xs space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Sleep Duration</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-black text-slate-950 dark:text-white font-mono">{selectedPatient.healthTrackerMetrics?.[0]?.sleepHours || '--'}</span>
                          <span className="text-[10px] text-slate-400 font-bold">hrs</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(((selectedPatient.healthTrackerMetrics?.[0]?.sleepHours || 0) / 8) * 100, 100)}%` }} />
                        </div>
                      </div>

                      {/* Calorie */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm text-xs space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Active Calories</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-black text-slate-950 dark:text-white font-mono">{selectedPatient.healthTrackerMetrics?.[0]?.activeCalories || '--'}</span>
                          <span className="text-[10px] text-slate-400 font-bold">kcal</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(((selectedPatient.healthTrackerMetrics?.[0]?.activeCalories || 0) / 500) * 100, 100)}%` }} />
                        </div>
                      </div>

                      {/* Resting HR */}
                      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm text-xs space-y-3">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Resting HR</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-xl font-black text-slate-950 dark:text-white font-mono">{selectedPatient.healthTrackerMetrics?.[0]?.restingHeartRate || '--'}</span>
                          <span className="text-[10px] text-slate-400 font-bold">bpm</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-950 h-2 rounded-full overflow-hidden">
                          <div className="bg-red-500 h-full rounded-full" style={{ width: `${Math.min(((selectedPatient.healthTrackerMetrics?.[0]?.restingHeartRate || 60) / 100) * 100, 100)}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Historical metric records table */}
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-5 rounded-3xl shadow-sm space-y-4">
                      <h4 className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest pb-2 border-b border-slate-100 dark:border-slate-800/60">Archived Health Tracker Logs</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="text-slate-400 border-b border-slate-100 dark:border-slate-800/60 pb-2">
                              <th className="py-2.5 font-extrabold uppercase">Date</th>
                              <th className="py-2.5 font-extrabold uppercase">Steps</th>
                              <th className="py-2.5 font-extrabold uppercase">Sleep Duration</th>
                              <th className="py-2.5 font-extrabold uppercase">Active Calories</th>
                              <th className="py-2.5 font-extrabold uppercase">Resting Heart Rate</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedPatient.healthTrackerMetrics?.map((met, idx) => (
                              <tr key={idx} className="border-b border-slate-50 dark:border-slate-850 text-slate-800 dark:text-slate-200 font-mono">
                                <td className="py-3 font-sans font-bold">{met.date}</td>
                                <td className="py-3 font-semibold">{met.steps} steps</td>
                                <td className="py-3 font-semibold">{met.sleepHours} hours</td>
                                <td className="py-3 font-semibold">{met.activeCalories} kcal</td>
                                <td className={`py-3 font-semibold ${met.restingHeartRate > 80 ? 'text-red-500' : 'text-slate-800 dark:text-slate-200'}`}>{met.restingHeartRate} bpm</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ======================================================================
         MODAL 1: START CONSULTATION MODAL SESSION
         ====================================================================== */}
      <AnimatePresence>
        {activeConsultation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveConsultation(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative z-10 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Stethoscope className="w-5 h-5 text-blue-600 animate-pulse" /> Live Telemetry Consultation Session
                </h3>
                <button onClick={() => setActiveConsultation(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/40 text-xs mb-4 flex items-center gap-3">
                <img src={activeConsultation.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="font-extrabold text-slate-950 dark:text-white">{activeConsultation.name}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">Intaking Clinical Metrics • {activeConsultation.id}</p>
                </div>
              </div>

              <form onSubmit={handleSubmitConsultation} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label htmlFor="consult-type-select" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Session Type</label>
                    <select
                      id="consult-type-select"
                      value={consultType}
                      onChange={(e) => setConsultType(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                    >
                      <option value="Standard Follow-up">Standard Follow-up</option>
                      <option value="Cardiac Check-up">Cardiac Check-up</option>
                      <option value="Emergency Assessment">Emergency Assessment</option>
                      <option value="PCI Post-OP Review">PCI Post-OP Review</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="bp-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Vitals: Blood Pressure</label>
                    <input
                      id="bp-input"
                      type="text"
                      required
                      value={consultBp}
                      onChange={(e) => setConsultBp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div>
                    <label htmlFor="hr-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Heart Rate (bpm)</label>
                    <input
                      id="hr-input"
                      type="number"
                      required
                      value={consultHr}
                      onChange={(e) => setConsultHr(parseInt(e.target.value) || 72)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="spo2-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">SpO2 (%)</label>
                    <input
                      id="spo2-input"
                      type="number"
                      required
                      value={consultSpo2}
                      onChange={(e) => setConsultSpo2(parseInt(e.target.value) || 98)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="temp-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Temp</label>
                    <input
                      id="temp-input"
                      type="text"
                      required
                      value={consultTemp}
                      onChange={(e) => setConsultTemp(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label htmlFor="glucose-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Glucose</label>
                    <input
                      id="glucose-input"
                      type="text"
                      required
                      value={consultGlucose}
                      onChange={(e) => setGlucose(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label htmlFor="diag-title-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Primary Diagnosis Updates</label>
                    <input
                      id="diag-title-input"
                      type="text"
                      placeholder="Verify heart sounds, ECG PVC level"
                      required
                      value={consultDiagnosis}
                      onChange={(e) => setConsultDiagnosis(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                    />
                  </div>

                  <div>
                    <label htmlFor="treatment-input" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Treatment Plan Updates</label>
                    <input
                      id="treatment-input"
                      type="text"
                      placeholder="e.g. Lisinopril 20mg increased QD"
                      required
                      value={consultTreatment}
                      onChange={(e) => setConsultTreatment(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="consult-notes" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Detailed Observation Notes</label>
                  <textarea
                    id="consult-notes"
                    rows={3}
                    placeholder="Record any visual findings, chest auscultation remarks, recovery tolerance thresholds..."
                    value={consultNotes}
                    onChange={(e) => setConsultNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all resize-none font-medium"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveConsultation(null)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800"
                  >
                    Cancel Consultation
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/10 flex justify-center items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" /> Commit Session Ledger
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================
         MODAL 2: GENERATE CRYPTOGRAPHIC CERTIFICATE MODAL
         ====================================================================== */}
      <AnimatePresence>
        {activeCertificateBuilder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCertificateBuilder(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 w-full max-w-2xl rounded-3xl p-6 shadow-2xl relative z-10 max-h-[92vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <FilePlus className="w-5 h-5 text-blue-600" /> Certificate & Clearance Builder
                </h3>
                <button onClick={() => setActiveCertificateBuilder(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!certGenerated ? (
                /* Builder Input Form */
                <form onSubmit={handleGenerateCertSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label htmlFor="cert-template" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Clearance Template</label>
                      <select
                        id="cert-template"
                        value={certTemplate}
                        onChange={(e) => setCertTemplate(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                      >
                        <option value="Cardiological Fitness Clearance">Cardiological Fitness Clearance</option>
                        <option value="Medical Sick Leave Authorization">Medical Sick Leave Authorization</option>
                        <option value="Cardiac Rehabilitation Exemption">Cardiac Rehabilitation Exemption</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="rest-days" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Rest Days Authorized</label>
                      <input
                        id="rest-days"
                        type="number"
                        min="0"
                        value={certRestDays}
                        onChange={(e) => setCertRestDays(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cert-summary" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Clinical Evaluation Summary</label>
                    <textarea
                      id="cert-summary"
                      rows={3}
                      required
                      value={certSymptomSummary}
                      onChange={(e) => setCertSymptomSummary(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all resize-none font-medium"
                    />
                  </div>

                  <div>
                    <label htmlFor="cert-restrictions" className="block text-[10px] font-black text-slate-400 uppercase mb-1">Special Restrictions & Adjustments</label>
                    <textarea
                      id="cert-restrictions"
                      rows={2}
                      required
                      value={certRestrictions}
                      onChange={(e) => setCertRestrictions(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all resize-none font-medium"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveCertificateBuilder(null)}
                      className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800"
                    >
                      Cancel Builder
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/10 flex justify-center items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-300" /> Compile Cryptographic Certificate
                    </button>
                  </div>
                </form>
              ) : (
                /* Premium certificate printable layout mockup */
                <div className="space-y-6">
                  {/* Watermarked official certificate frame */}
                  <div className="border-4 border-slate-900 dark:border-slate-800 p-6 md:p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl relative overflow-hidden text-slate-900 dark:text-slate-100">
                    {/* Watermark brand icon */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-5 dark:opacity-[0.03]">
                      <HeartPulse className="w-72 h-72" />
                    </div>

                    {/* Cert header */}
                    <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800 relative z-10">
                      <div>
                        <div className="flex items-center gap-1">
                          <HeartPulse className="w-5 h-5 text-blue-600" />
                          <span className="font-sans font-black text-sm uppercase tracking-widest text-slate-950 dark:text-white">DOCO Medical Wing</span>
                        </div>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">Advanced Clinical Diagnostics Registry</p>
                      </div>
                      <div className="text-right text-[10px] font-mono">
                        <p className="font-bold text-slate-950 dark:text-white">ID: {certGenerated.referenceId}</p>
                        <p className="text-slate-400">DATE: {certGenerated.date}</p>
                      </div>
                    </div>

                    <div className="text-center my-6 relative z-10">
                      <h4 className="text-base font-black uppercase tracking-wider text-slate-950 dark:text-white underline decoration-blue-500/50 decoration-2 underline-offset-4">
                        Official {certGenerated.template}
                      </h4>
                    </div>

                    <div className="space-y-4 text-xs relative z-10">
                      <p className="leading-relaxed">
                        This is to certify that <strong>{certGenerated.patientName}</strong> ({certGenerated.age} years of age, {certGenerated.gender}), identified under regional health chart EMR ID <strong>{certGenerated.patientId}</strong>, was evaluated at DOCO Cardiovascular Medical Wing on <strong>{certGenerated.date}</strong>.
                      </p>

                      <div className="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">Clinical Diagnostics Summary</span>
                        <p className="font-medium text-slate-800 dark:text-slate-300 italic leading-relaxed">
                          "{certGenerated.symptoms}"
                        </p>
                      </div>

                      <div className="bg-white dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-[9px] font-extrabold text-slate-400 block uppercase tracking-wider mb-1">Activity Restrictions / Mandated Adjustments</span>
                        <p className="font-medium text-slate-800 dark:text-slate-300 italic leading-relaxed">
                          "{certGenerated.restrictions}"
                        </p>
                      </div>

                      {parseInt(certGenerated.restDays) > 0 && (
                        <p className="leading-relaxed font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-amber-500 animate-pulse" /> 
                          Patient is authorized a convalescent rest leave of {certGenerated.restDays} consecutive days.
                        </p>
                      )}
                    </div>

                    {/* Cryptographic Signature stamps */}
                    <div className="mt-8 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-end relative z-10">
                      <div className="text-[9px] font-mono text-slate-400">
                        <p className="font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">Cryptographic Verification Stamp</p>
                        <p className="mt-0.5 select-all">{certGenerated.signatureStamp}</p>
                        <p className="text-[8px] mt-1 italic">Electronically compiled via DOCO Secure EMR Network</p>
                      </div>

                      <div className="text-center">
                        <div className="font-sans font-black text-xs text-slate-950 dark:text-white italic relative inline-block">
                          Dr. Adithi, MD
                          {/* Simulated cryptographic seal circle */}
                          <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full border border-dashed border-blue-500/20 rotate-45 flex items-center justify-center text-[7px] font-bold text-blue-500/30 uppercase select-none pointer-events-none">
                            DOCO SEAL
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-400 font-extrabold uppercase mt-1">Wing Director Cardiology</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setCertGenerated(null)}
                      className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-slate-200 dark:border-slate-800"
                    >
                      ← Back to Form
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/10 flex justify-center items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" /> Print / Export PDF Clearance
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================
         MODAL 3: LABORATORY DIAGNOSTIC & WAVEFORM TELEMETRY VIEWER
         ====================================================================== */}
      <AnimatePresence>
        {activeLabViewer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLabViewer(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <h3 className="text-sm font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <HeartPulse className="w-5 h-5 text-blue-600 animate-pulse" /> Telemetry Waveform Visualizer
                </h3>
                <button onClick={() => setActiveLabViewer(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 space-y-4">
                {/* Visual loop animated SVG path waveform */}
                <div className="relative">
                  <div className="absolute top-2 left-2 text-[8px] font-mono text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                    LIVE EKG SCAN SIGNAL
                  </div>
                  
                  <div className="absolute top-2 right-2 text-right text-[8px] font-mono text-slate-500 uppercase">
                    HR: <span className="text-emerald-500 font-bold">{activeLabViewer.patient.vitals?.heartRate || '72'} bpm</span>
                  </div>

                  <svg className="w-full h-28 bg-slate-950 rounded-xl border border-slate-900" viewBox="0 0 300 100">
                    {/* Simulated ECG grid pattern */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(16, 185, 129, 0.05)" strokeWidth="0.5" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* ECG wave shape */}
                    <path
                      d="M 0 50 L 30 50 L 40 50 L 45 42 L 50 58 L 55 50 L 70 50 L 80 50 L 85 15 L 90 85 L 95 50 L 110 50 L 140 50 L 150 50 L 155 42 L 160 58 L 165 50 L 180 50 L 190 50 L 195 15 L 200 85 L 205 50 L 220 50 L 250 50 L 260 50 L 265 42 L 270 58 L 275 50 L 290 50 L 300 50"
                      fill="none"
                      stroke="#10B981"
                      strokeWidth="1.5"
                      strokeDasharray="600"
                      strokeDashoffset="0"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              </div>

              <div className="mt-4 space-y-3.5 text-xs">
                <div className="bg-slate-50 dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <h5 className="font-extrabold text-slate-900 dark:text-white">{activeLabViewer.report.testName}</h5>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">Test Reference: {activeLabViewer.report.id}</p>
                  
                  <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Test Date:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{activeLabViewer.report.date}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-bold text-[9px] uppercase">Category:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{activeLabViewer.report.category}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <span className="text-slate-400 block font-bold text-[9px] uppercase">Diagnostic Outcome:</span>
                    <p className={`font-semibold ${activeLabViewer.report.status === 'Flagged' ? 'text-red-500 font-black' : 'text-slate-800 dark:text-slate-200'}`}>
                      {activeLabViewer.report.result}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1">Normal Reference: {activeLabViewer.report.referenceRange}</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveLabViewer(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black uppercase tracking-wider rounded-2xl transition-all flex justify-center items-center gap-1"
                >
                  Close Waveform Monitor
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================
         MODAL 4: EMERGENCY LOCKSCREEN LIFEQR CARD VIEWER
         ====================================================================== */}
      <AnimatePresence>
        {activeQrViewer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveQrViewer(null)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-red-950 border border-red-800 text-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-red-900/30">
                <h3 className="text-xs font-black text-red-400 uppercase tracking-widest flex items-center gap-1.5 animate-pulse">
                  <ShieldAlert className="w-5 h-5 text-red-500" /> Secure LifeQR First Responder Card
                </h3>
                <button onClick={() => setActiveQrViewer(null)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Secure EMR Medical QR Display */}
              <div className="bg-black/40 border border-red-900/40 p-4.5 rounded-2xl space-y-4 text-xs">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <img src={activeQrViewer.avatar} alt="" className="w-11 h-11 rounded-full object-cover border border-red-500/20" />
                  <div>
                    <h4 className="font-extrabold text-white text-sm">{activeQrViewer.name}</h4>
                    <span className="text-[10px] font-mono text-red-400 font-bold">EMR-PASS: {activeQrViewer.lifeQrCode}</span>
                  </div>
                </div>

                {/* Grid info */}
                <div className="grid grid-cols-2 gap-3.5 pt-3.5 border-t border-red-900/30 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Blood Type</span>
                    <span className="font-black text-white text-sm font-mono">{activeQrViewer.bloodType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider">Age & Gender</span>
                    <span className="font-bold text-white">{activeQrViewer.age} y/o • {activeQrViewer.gender}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-red-900/30">
                  <span className="text-red-400 block font-bold text-[9px] uppercase tracking-wider mb-1.5">Critical Allergies / Contraindications</span>
                  <div className="flex flex-wrap gap-1">
                    {activeQrViewer.allergies && activeQrViewer.allergies.length > 0 ? (
                      activeQrViewer.allergies.map((allg, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                          ⚠️ {allg}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">No allergies registered.</span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-red-900/30">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider mb-1">Active Cardiovascular Implants / Meds</span>
                  <div className="space-y-1 font-mono text-[10px] text-slate-200">
                    {activeQrViewer.currentMedications && activeQrViewer.currentMedications.length > 0 ? (
                      activeQrViewer.currentMedications.slice(0, 3).map((med, idx) => (
                        <p key={idx}>• {med.name} ({med.dosage}) - {med.frequency}</p>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">None registered.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-red-900/30">
                  <span className="text-slate-400 block font-bold text-[9px] uppercase tracking-wider mb-1">In Case of Emergency Contact</span>
                  {activeQrViewer.emergencyContacts?.map((ec, idx) => (
                    <div key={idx} className="text-[11px]">
                      <span className="font-bold text-white">{ec.name}</span> ({ec.relationship}) • <span className="font-mono font-bold text-red-400">{ec.phone}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex justify-center items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Print EMR badge
                </button>
                <button
                  onClick={() => setActiveQrViewer(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================================
         MODAL 5: REGISTER NEW PATIENT DIALOG MODAL
         ====================================================================== */}
      <AnimatePresence>
        {isAddingPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingPatient(false)}
              className="absolute inset-0 bg-black"
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100 dark:border-slate-800/60">
                <h3 className="text-base font-black text-slate-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                  <UserCheck className="w-5 h-5 text-blue-600" /> Register New Patient Chart
                </h3>
                <button onClick={() => setIsAddingPatient(false)} className="text-slate-400 hover:text-slate-200">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreatePatient} className="space-y-4">
                <div>
                  <label htmlFor="new-pat-name" className="block text-[10px] font-black text-slate-450 uppercase mb-1">Full Patient Name</label>
                  <input
                    id="new-pat-name"
                    type="text"
                    required
                    placeholder="e.g. Robert Downey"
                    value={newPatientName}
                    onChange={(e) => setNewPatientName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label htmlFor="new-pat-age" className="block text-[10px] font-black text-slate-455 uppercase mb-1">Age</label>
                    <input
                      id="new-pat-age"
                      type="number"
                      required
                      placeholder="e.g. 42"
                      value={newPatientAge}
                      onChange={(e) => setNewPatientAge(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>
                  <div>
                    <label htmlFor="new-pat-gender" className="block text-[10px] font-black text-slate-460 uppercase mb-1">Gender</label>
                    <select
                      id="new-pat-gender"
                      value={newPatientGender}
                      onChange={(e) => setNewPatientGender(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label htmlFor="new-pat-blood" className="block text-[10px] font-black text-slate-465 uppercase mb-1">Blood Type</label>
                    <select
                      id="new-pat-blood"
                      value={newPatientBlood}
                      onChange={(e) => setNewPatientBlood(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="new-pat-phone" className="block text-[10px] font-black text-slate-470 uppercase mb-1">Contact Phone</label>
                    <input
                      id="new-pat-phone"
                      type="text"
                      placeholder="+1 (555) 432-8765"
                      value={newPatientPhone}
                      onChange={(e) => setNewPatientPhone(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-pat-cond" className="block text-[10px] font-black text-slate-475 uppercase mb-1">Primary Heart Diagnosis / Condition</label>
                  <input
                    id="new-pat-cond"
                    type="text"
                    required
                    placeholder="e.g. Stage 2 Hypertension, Arrhythmia"
                    value={newPatientCondition}
                    onChange={(e) => setNewPatientCondition(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-all font-semibold"
                  />
                </div>

                <div className="pt-3 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingPatient(false)}
                    className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-black uppercase tracking-wider rounded-xl transition-all border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-500/10"
                  >
                    Create Clinical File
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
