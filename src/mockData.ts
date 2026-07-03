/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Doctor, Patient, Appointment, Notification } from './types';

export const mockDoctor: Doctor = {
  id: 'doc-101',
  name: 'Dr. Sarah Chen, MD',
  email: 'sarah.chen@docohealth.com',
  specialty: 'Cardiovascular Medicine',
  hospital: 'DOCO Medical Center',
  avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300',
  availability: 'available',
  phone: '+1 (555) 382-9401',
  bio: 'Senior Consultant Cardiologist with over 12 years of experience specializing in interventional cardiology, heart failure management, and preventive cardiovascular healthcare.'
};

export const mockPatients: Patient[] = [
  {
    id: 'pat-001',
    name: 'Robert Miller',
    age: 64,
    gender: 'Male',
    bloodType: 'A+',
    phone: '+1 (555) 123-4567',
    email: 'robert.miller@email.com',
    condition: 'Chronic Hypertension & Mild Arrhythmia',
    status: 'Under Observation',
    lastVisit: '2026-06-20',
    nextAppointment: '2026-07-04',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    vitals: {
      bloodPressure: '138/85',
      heartRate: 72,
      oxygenLevel: 98,
      temperature: '98.4°F',
      weight: '182 lbs',
      glucose: '98 mg/dL',
      recordedAt: '2026-07-02 09:15 AM'
    },
    allergies: ['Penicillin', 'Peanuts', 'Sulfa drugs'],
    currentMedications: [
      { name: 'Lisinopril', dosage: '20mg', frequency: 'Once daily (QD)', startDate: '2026-03-12', status: 'Active' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (QD) at bedtime', startDate: '2026-03-12', status: 'Active' }
    ],
    previousPrescriptions: [
      { id: 'rx-101', date: '2025-09-10', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', doctorName: 'Dr. Sarah Chen, MD', refills: 0 },
      { id: 'rx-102', date: '2026-03-12', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', doctorName: 'Dr. Sarah Chen, MD', refills: 1 }
    ],
    emergencyContacts: [
      { name: 'Linda Miller', relationship: 'Spouse', phone: '+1 (555) 123-4568' }
    ],
    labReports: [
      { id: 'lab-201', testName: 'Lipid Panel', date: '2026-06-19', status: 'Completed', result: 'Total: 210 mg/dL, LDL: 115 mg/dL, HDL: 45 mg/dL', referenceRange: 'Total < 200, LDL < 100, HDL > 40', category: 'Biochemistry' },
      { id: 'lab-202', testName: '12-Lead EKG', date: '2026-06-20', status: 'Completed', result: 'Normal sinus rhythm with occasional PVCs', referenceRange: 'Normal EKG', category: 'Cardiology' },
      { id: 'lab-203', testName: 'HbA1c Glycated Hemoglobin', date: '2026-06-19', status: 'Completed', result: '5.8%', referenceRange: '4.0% - 5.6% (Normal)', category: 'Endocrinology' }
    ],
    healthTrackerMetrics: [
      { date: '2026-07-02', steps: 6540, sleepHours: 7.2, activeCalories: 340, restingHeartRate: 65 },
      { date: '2026-07-01', steps: 5890, sleepHours: 6.8, activeCalories: 290, restingHeartRate: 67 },
      { date: '2026-06-30', steps: 7120, sleepHours: 7.5, activeCalories: 380, restingHeartRate: 64 }
    ],
    lifeQrCode: 'DOCO_PAT_001_MILLER_EMERGENCY_SECURE',
    history: [
      {
        date: '2026-06-20',
        diagnosis: 'Hypertensive Heart Disease',
        treatment: 'Adjusted Lisinopril dosage to 20mg daily',
        notes: 'Patient reports mild fatigue. Coronary calcium score is stable. EKG shows normal sinus rhythm with occasional PVCs.'
      },
      {
        date: '2026-03-12',
        diagnosis: 'Stage 2 Hypertension',
        treatment: 'Lisinopril 10mg & Amlodipine 5mg',
        notes: 'Initial cardiac workup completed. Cholesterol levels slightly elevated. Prescribed low-sodium diet and daily exercise regimen.'
      }
    ]
  },
  {
    id: 'pat-002',
    name: 'Eleanor Vance',
    age: 45,
    gender: 'Female',
    bloodType: 'O-',
    phone: '+1 (555) 987-6543',
    email: 'eleanor.v@email.com',
    condition: 'Post-Myocardial Infarction Recovery',
    status: 'Recovering',
    lastVisit: '2026-06-15',
    nextAppointment: '2026-07-03',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    vitals: {
      bloodPressure: '118/72',
      heartRate: 68,
      oxygenLevel: 99,
      temperature: '98.2°F',
      weight: '142 lbs',
      glucose: '88 mg/dL',
      recordedAt: '2026-07-03 08:15 AM'
    },
    allergies: ['Aspirin (Mild GI distress)', 'Contrast dye'],
    currentMedications: [
      { name: 'Metoprolol Succinate', dosage: '25mg', frequency: 'Once daily (QD)', startDate: '2026-05-01', status: 'Active' },
      { name: 'Clopidogrel (Plavix)', dosage: '75mg', frequency: 'Once daily (QD)', startDate: '2026-05-01', status: 'Active' },
      { name: 'Aspirin Enteric Coated', dosage: '81mg', frequency: 'Once daily (QD)', startDate: '2026-05-01', status: 'Active' }
    ],
    previousPrescriptions: [
      { id: 'rx-201', date: '2026-05-01', name: 'Morphine Sulfate', dosage: '2mg IV', frequency: 'Single Dose', doctorName: 'ER Physician', refills: 0 }
    ],
    emergencyContacts: [
      { name: 'Thomas Vance', relationship: 'Husband', phone: '+1 (555) 987-6544' }
    ],
    labReports: [
      { id: 'lab-301', testName: 'Cardiac Troponin T', date: '2026-05-01', status: 'Completed', result: '1.45 ng/mL (Elevated)', referenceRange: '< 0.01 ng/mL', category: 'Cardiac Biomarkers' },
      { id: 'lab-302', testName: 'Echocardiogram', date: '2026-05-03', status: 'Completed', result: 'LVEF: 52%, Akinesis of mid-anteroseptal wall', referenceRange: 'LVEF 55% - 70%', category: 'Imaging' }
    ],
    healthTrackerMetrics: [
      { date: '2026-07-02', steps: 8400, sleepHours: 8.0, activeCalories: 410, restingHeartRate: 62 },
      { date: '2026-07-01', steps: 7850, sleepHours: 7.8, activeCalories: 370, restingHeartRate: 63 }
    ],
    lifeQrCode: 'DOCO_PAT_002_VANCE_EMERGENCY_SECURE',
    history: [
      {
        date: '2026-06-15',
        diagnosis: 'CAD Post-PCI Recovery',
        treatment: 'Dual Antiplatelet Therapy (DAPT) & Metoprolol',
        notes: 'Surgical wounds fully healed. Cardiac rehabilitation program is being completed with excellent tolerance.'
      },
      {
        date: '2026-05-01',
        diagnosis: 'Acute Coronary Syndrome',
        treatment: 'Emergency PCI with drug-eluting stent to LAD',
        notes: 'Admitted via emergency, stent deployed successfully. Left ventricular ejection fraction is 52% post-procedure.'
      }
    ]
  },
  {
    id: 'pat-003',
    name: 'Marcus Thompson',
    age: 52,
    gender: 'Male',
    bloodType: 'B+',
    phone: '+1 (555) 456-7890',
    email: 'm.thompson@email.com',
    condition: 'Type 2 Diabetes & Hyperlipidemia',
    status: 'Stable',
    lastVisit: '2026-05-28',
    nextAppointment: '2026-07-12',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    vitals: {
      bloodPressure: '134/82',
      heartRate: 74,
      oxygenLevel: 97,
      temperature: '98.6°F',
      weight: '215 lbs',
      glucose: '135 mg/dL',
      recordedAt: '2026-05-28 10:30 AM'
    },
    allergies: ['None declared'],
    currentMedications: [
      { name: 'Metformin HCl', dosage: '1000mg', frequency: 'Twice daily (BID) with meals', startDate: '2025-08-14', status: 'Active' },
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily (QD) at bedtime', startDate: '2025-11-20', status: 'Active' }
    ],
    previousPrescriptions: [
      { id: 'rx-301', date: '2025-08-14', name: 'Glipizide', dosage: '5mg', frequency: 'Once daily', doctorName: 'Dr. Sarah Chen, MD', refills: 0 }
    ],
    emergencyContacts: [
      { name: 'Sarah Thompson', relationship: 'Daughter', phone: '+1 (555) 456-7891' }
    ],
    labReports: [
      { id: 'lab-401', testName: 'HbA1c Glycated Hemoglobin', date: '2026-05-27', status: 'Completed', result: '6.9% (In-control)', referenceRange: '< 5.7% (Normal), > 6.5% (Diabetic)', category: 'Endocrinology' },
      { id: 'lab-402', testName: 'Lipid Panel', date: '2026-05-27', status: 'Flagged', result: 'Total Chol: 224 mg/dL, LDL: 130 mg/dL, Triglycerides: 185 mg/dL', referenceRange: 'LDL < 100, Triglycerides < 150', category: 'Biochemistry' },
      { id: 'lab-403', testName: 'Basic Renal Panel (eGFR)', date: '2026-05-27', status: 'Completed', result: '84 mL/min/1.73m²', referenceRange: '> 60 mL/min/1.73m²', category: 'Nephrology' }
    ],
    healthTrackerMetrics: [
      { date: '2026-07-02', steps: 4210, sleepHours: 6.5, activeCalories: 210, restingHeartRate: 68 },
      { date: '2026-07-01', steps: 5100, sleepHours: 7.0, activeCalories: 260, restingHeartRate: 69 }
    ],
    lifeQrCode: 'DOCO_PAT_003_THOMPSON_EMERGENCY_SECURE',
    history: [
      {
        date: '2026-05-28',
        diagnosis: 'Metabolic Syndrome',
        treatment: 'Metformin 1000mg twice daily & Atorvastatin 20mg',
        notes: 'HbA1c decreased from 7.8% to 6.9%. Lipid panel shows 35% decrease in LDL. Encouraged to continue carbohydrate restriction.'
      }
    ]
  },
  {
    id: 'pat-004',
    name: 'Clara Oswald',
    age: 29,
    gender: 'Female',
    bloodType: 'AB+',
    phone: '+1 (555) 321-7654',
    email: 'clara.oswald@email.com',
    condition: 'Postural Orthostatic Tachycardia (POTS)',
    status: 'Stable',
    lastVisit: '2026-06-02',
    nextAppointment: '2026-07-03',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    vitals: {
      bloodPressure: '102/64',
      heartRate: 78,
      oxygenLevel: 99,
      temperature: '98.1°F',
      weight: '121 lbs',
      glucose: '92 mg/dL',
      recordedAt: '2026-07-03 09:30 AM'
    },
    allergies: ['CT Contrast Dye', 'Shellfish'],
    currentMedications: [
      { name: 'Fludrocortisone', dosage: '0.1mg', frequency: 'Once daily (QD)', startDate: '2026-06-02', status: 'Active' },
      { name: 'Midodrine HCl', dosage: '5mg', frequency: 'Three times daily (TID)', startDate: '2026-06-02', status: 'Active' }
    ],
    previousPrescriptions: [
      { id: 'rx-401', date: '2026-01-15', name: 'Propranolol HCl', dosage: '10mg', frequency: 'As needed (PRN) for severe tachycardia', doctorName: 'Dr. Sarah Chen, MD', refills: 2 }
    ],
    emergencyContacts: [
      { name: 'Danny Pink', relationship: 'Partner', phone: '+1 (555) 321-7655' }
    ],
    labReports: [
      { id: 'lab-501', testName: 'Tilt Table Test', date: '2026-06-01', status: 'Completed', result: 'Positive. Sustained HR increase of +42 bpm upon standing without orthostatic hypotension.', referenceRange: 'Normal response < 30 bpm increase', category: 'Autonomic Studies' },
      { id: 'lab-502', testName: 'Basic Metabolic Panel', date: '2026-06-02', status: 'Completed', result: 'Serum Sodium: 142 mEq/L, Potassium: 4.1 mEq/L', referenceRange: 'Sodium 136-145, Potassium 3.5-5.1', category: 'Biochemistry' }
    ],
    healthTrackerMetrics: [
      { date: '2026-07-02', steps: 9540, sleepHours: 7.8, activeCalories: 480, restingHeartRate: 72 },
      { date: '2026-07-01', steps: 8820, sleepHours: 8.2, activeCalories: 440, restingHeartRate: 74 }
    ],
    lifeQrCode: 'DOCO_PAT_004_OSWALD_EMERGENCY_SECURE',
    history: [
      {
        date: '2026-06-02',
        diagnosis: 'Dysautonomia / POTS',
        treatment: 'Fludrocortisone 0.1mg & High Sodium Intake',
        notes: 'Tilt table test positive. Recommending compression stockings (30-40 mmHg) and hydration of 3 liters daily.'
      }
    ]
  },
  {
    id: 'pat-005',
    name: 'Harvey Dent',
    age: 41,
    gender: 'Male',
    bloodType: 'O+',
    phone: '+1 (555) 246-8101',
    email: 'harvey.d@email.com',
    condition: 'Dilated Cardiomyopathy',
    status: 'Critical',
    lastVisit: '2026-06-28',
    nextAppointment: '2026-07-03',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    vitals: {
      bloodPressure: '108/60',
      heartRate: 88,
      oxygenLevel: 94,
      temperature: '97.9°F',
      weight: '198 lbs',
      glucose: '105 mg/dL',
      recordedAt: '2026-07-03 07:15 AM'
    },
    allergies: ['Lisinopril (Causes severe angioedema)'],
    currentMedications: [
      { name: 'Sacubitril/Valsartan (Entresto)', dosage: '49/51mg', frequency: 'Twice daily (BID)', startDate: '2026-06-28', status: 'Active' },
      { name: 'Spironolactone', dosage: '25mg', frequency: 'Once daily (QD)', startDate: '2026-06-28', status: 'Active' },
      { name: 'Furosemide (Lasix)', dosage: '40mg', frequency: 'Once daily (QD)', startDate: '2026-06-28', status: 'Active' }
    ],
    previousPrescriptions: [
      { id: 'rx-501', date: '2026-06-15', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', doctorName: 'Dr. Sarah Chen, MD', refills: 0 }
    ],
    emergencyContacts: [
      { name: 'Gilda Dent', relationship: 'Spouse', phone: '+1 (555) 246-8102' }
    ],
    labReports: [
      { id: 'lab-601', testName: 'B-Type Natriuretic Peptide (BNP)', date: '2026-06-27', status: 'Flagged', result: '1200 pg/mL (Critical Elevation)', referenceRange: '< 100 pg/mL', category: 'Heart Failure Markers' },
      { id: 'lab-602', testName: 'Chest X-Ray (AP View)', date: '2026-06-28', status: 'Flagged', result: 'Mild cardiomegaly, bilateral pleural effusions with pulmonary venous congestion.', referenceRange: 'Normal chest radiograph', category: 'Imaging' },
      { id: 'lab-603', testName: 'Renal Function (Creatinine & BUN)', date: '2026-06-27', status: 'Completed', result: 'Creatinine: 1.4 mg/dL, BUN: 28 mg/dL', referenceRange: 'Creatinine 0.7-1.3, BUN 8-21', category: 'Biochemistry' }
    ],
    healthTrackerMetrics: [
      { date: '2026-07-02', steps: 1820, sleepHours: 5.4, activeCalories: 95, restingHeartRate: 82 },
      { date: '2026-07-01', steps: 2100, sleepHours: 5.8, activeCalories: 110, restingHeartRate: 80 }
    ],
    lifeQrCode: 'DOCO_PAT_005_DENT_EMERGENCY_SECURE',
    history: [
      {
        date: '2026-06-28',
        diagnosis: 'Congestive Heart Failure NYHA Class III',
        treatment: 'Sacubitril/Valsartan (Entresto) & Spironolactone',
        notes: 'Patient exhibits peripheral edema 2+. Elevated BNP levels (1200 pg/ml). Placed on water restriction (1.5L/day) and strict daily weight log.'
      }
    ]
  }
];

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pat-002',
    patientName: 'Eleanor Vance',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-03',
    time: '08:30 AM',
    type: 'Follow-up',
    status: 'Completed',
    reason: '6-week cardiac rehab evaluation and stenting check-up.',
    notes: 'Prioritize wound inspection and Metoprolol tolerance review.',
    isWalkIn: false,
    reminderStatus: 'Delivered',
    timeline: [
      { status: 'Scheduled', timestamp: '2026-06-25 09:00 AM', description: 'Appointment booked by clinical coordinator' },
      { status: 'Reminder Sent', timestamp: '2026-07-02 08:30 AM', description: 'Automated SMS reminder dispatched to patient' },
      { status: 'Arrived / Waiting', timestamp: '2026-07-03 08:15 AM', description: 'Patient checked in at front desk, vitals recorded' },
      { status: 'Consulting', timestamp: '2026-07-03 08:32 AM', description: 'Consultation with Dr. Chen started' },
      { status: 'Completed', timestamp: '2026-07-03 08:55 AM', description: 'Consultation completed. EMR notes filed' }
    ]
  },
  {
    id: 'apt-002',
    patientId: 'pat-004',
    patientName: 'Clara Oswald',
    patientAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-03',
    time: '10:00 AM',
    type: 'Consultation',
    status: 'Consulting',
    reason: 'Severe morning tachycardia flare-ups and dizziness.',
    notes: 'Examine standing and supine blood pressure.',
    isWalkIn: false,
    reminderStatus: 'Sent',
    timeline: [
      { status: 'Scheduled', timestamp: '2026-06-28 02:15 PM', description: 'Appointment booked via Web Portal' },
      { status: 'Reminder Sent', timestamp: '2026-07-02 10:00 AM', description: 'Email reminder sent' },
      { status: 'Arrived / Waiting', timestamp: '2026-07-03 09:45 AM', description: 'Patient checked in, waiting in lounge' },
      { status: 'Consulting', timestamp: '2026-07-03 10:02 AM', description: 'Active consultation with Dr. Chen' }
    ]
  },
  {
    id: 'apt-003',
    patientId: 'pat-005',
    patientName: 'Harvey Dent',
    patientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-03',
    time: '11:15 AM',
    type: 'Emergency',
    status: 'Waiting',
    reason: 'Acute shortness of breath and rapid weight gain (5 lbs in 2 days).',
    notes: 'Prepare portable ultrasound machine for pulmonary congestion scanning.',
    isWalkIn: true,
    reminderStatus: 'None',
    timeline: [
      { status: 'Arrived / Waiting', timestamp: '2026-07-03 11:05 AM', description: 'Patient presented with acute dyspnea, fast-tracked to triage lounge' }
    ]
  },
  {
    id: 'apt-004',
    patientId: 'pat-001',
    patientName: 'Robert Miller',
    patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-03',
    time: '01:30 PM',
    type: 'Check-up',
    status: 'Scheduled',
    reason: 'Routine lipid panel review and EKG comparison.',
    notes: 'Verify if fasting test results arrived from pathology lab.',
    isWalkIn: false,
    reminderStatus: 'Pending',
    timeline: [
      { status: 'Scheduled', timestamp: '2026-06-20 11:30 AM', description: 'Routine follow-up scheduled' }
    ]
  },
  {
    id: 'apt-005',
    patientId: 'pat-003',
    patientName: 'Marcus Thompson',
    patientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-03',
    time: '07:30 AM',
    type: 'Check-up',
    status: 'Missed',
    reason: 'Glycemic control and lipid panel follow-up.',
    notes: 'Patient was unreachable via registered contact phone.',
    isWalkIn: false,
    reminderStatus: 'Delivered',
    timeline: [
      { status: 'Scheduled', timestamp: '2026-06-22 04:00 PM', description: 'Routine diabetic check scheduled' },
      { status: 'Reminder Sent', timestamp: '2026-07-02 07:30 AM', description: 'SMS reminder delivered' },
      { status: 'Missed', timestamp: '2026-07-03 08:00 AM', description: 'Patient failed to attend scheduled appointment. Marked as missed.' }
    ]
  },
  {
    id: 'apt-006',
    patientId: 'pat-001',
    patientName: 'Robert Miller',
    patientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-04',
    time: '09:00 AM',
    type: 'Check-up',
    status: 'Scheduled',
    reason: 'Routine lipid panel review and EKG comparison.',
    notes: 'Verify if fasting test results arrived from pathology lab.',
    isWalkIn: false,
    reminderStatus: 'Pending',
    timeline: [
      { status: 'Scheduled', timestamp: '2026-06-20 11:30 AM', description: 'Routine follow-up scheduled' }
    ]
  },
  {
    id: 'apt-007',
    patientId: 'pat-003',
    patientName: 'Marcus Thompson',
    patientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    date: '2026-07-12',
    time: '02:30 PM',
    type: 'Check-up',
    status: 'Scheduled',
    reason: 'Glycemic control and lipid panel follow-up.',
    isWalkIn: false,
    reminderStatus: 'None'
  },
  {
    id: 'apt-008',
    patientId: 'pat-002',
    patientName: 'Eleanor Vance',
    patientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    date: '2026-06-15',
    time: '11:00 AM',
    type: 'Consultation',
    status: 'Completed',
    reason: 'First cardiac diagnostic testing after initial referral.',
    notes: 'Completed successfully without any adverse reactions.',
    isWalkIn: false,
    reminderStatus: 'Delivered',
    timeline: [
      { status: 'Scheduled', timestamp: '2026-06-01 10:00 AM', description: 'Referral booking processed' },
      { status: 'Completed', timestamp: '2026-06-15 11:45 AM', description: 'Consultation completed' }
    ]
  }
];

export const mockNotifications: Notification[] = [
  {
    id: 'not-1',
    title: 'Critical Patient Update',
    message: 'Harvey Dent (pat-005) logged daily weight: +3.2 lbs. Edema warning triggered.',
    time: '10 mins ago',
    type: 'alert',
    read: false
  },
  {
    id: 'not-2',
    title: 'Lab Report Completed',
    message: 'Robert Miller (pat-001) Lipid Panel and HbA1c results are now available.',
    time: '1 hour ago',
    type: 'patient',
    read: false
  },
  {
    id: 'not-3',
    title: 'New Appointment Scheduled',
    message: 'Eleanor Vance confirmed appointment for Friday, July 3rd at 8:30 AM.',
    time: '3 hours ago',
    type: 'appointment',
    read: true
  },
  {
    id: 'not-4',
    title: 'System Optimization Complete',
    message: 'DOCO Cloud Sync successfully synchronized 12 clinical records.',
    time: '1 day ago',
    type: 'system',
    read: true
  }
];

export const mockAnalytics = {
  vitalsAndMetrics: {
    totalPatients: 142,
    patientsChange: '+12% from last month',
    activeAppointments: 18,
    appointmentsChange: '+4 today',
    averageCareTime: '24 mins',
    careTimeChange: '-3% optimization',
    satisfactionRate: '98.4%',
    satisfactionChange: '+0.8% increase'
  },
  weeklyAppointmentData: [
    { day: 'Mon', consultations: 8, followups: 4, emergencies: 0 },
    { day: 'Tue', consultations: 10, followups: 5, emergencies: 1 },
    { day: 'Wed', consultations: 7, followups: 8, emergencies: 2 },
    { day: 'Thu', consultations: 12, followups: 3, emergencies: 0 },
    { day: 'Fri', consultations: 9, followups: 6, emergencies: 3 },
    { day: 'Sat', consultations: 4, followups: 2, emergencies: 0 }
  ],
  patientStatusDistribution: [
    { name: 'Stable', value: 72, color: '#10B981' }, // emerald-500
    { name: 'Recovering', value: 38, color: '#3B82F6' }, // blue-500
    { name: 'Under Obs.', value: 24, color: '#F59E0B' }, // amber-500
    { name: 'Critical', value: 8, color: '#EF4444' } // red-500
  ],
  monthlyPatientTraffic: [
    { month: 'Jan', newPatients: 15, regularVisits: 85 },
    { month: 'Feb', newPatients: 18, regularVisits: 92 },
    { month: 'Mar', newPatients: 24, regularVisits: 105 },
    { month: 'Apr', newPatients: 22, regularVisits: 98 },
    { month: 'May', newPatients: 30, regularVisits: 110 },
    { month: 'Jun', newPatients: 35, regularVisits: 124 }
  ],
  medicalCategories: [
    { name: 'Hypertension', count: 48 },
    { name: 'Post-MI Rehab', count: 32 },
    { name: 'Heart Failure', count: 22 },
    { name: 'Arrhythmia', count: 18 },
    { name: 'POTS/Dysautonomia', count: 12 }
  ]
};
