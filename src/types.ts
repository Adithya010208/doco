/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty: string;
  hospital: string;
  avatar: string;
  availability: 'available' | 'busy' | 'away' | 'offline';
  phone: string;
  bio: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodType: string;
  phone: string;
  email: string;
  condition: string;
  status: 'Stable' | 'Critical' | 'Recovering' | 'Under Observation';
  lastVisit: string;
  nextAppointment?: string;
  avatar: string;
  history: {
    date: string;
    diagnosis: string;
    treatment: string;
    notes: string;
  }[];
  // Extended details for Patient Profile (Phase 3)
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    oxygenLevel: number;
    temperature: string;
    weight: string;
    glucose?: string;
    recordedAt: string;
  };
  allergies?: string[];
  currentMedications?: {
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    status: 'Active' | 'Discontinued';
  }[];
  previousPrescriptions?: {
    id: string;
    date: string;
    name: string;
    dosage: string;
    frequency: string;
    doctorName: string;
    refills: number;
  }[];
  emergencyContacts?: {
    name: string;
    relationship: string;
    phone: string;
  }[];
  labReports?: {
    id: string;
    testName: string;
    date: string;
    status: 'Completed' | 'Pending' | 'Flagged';
    result: string;
    referenceRange: string;
    category: string;
  }[];
  healthTrackerMetrics?: {
    date: string;
    steps: number;
    sleepHours: number;
    activeCalories: number;
    restingHeartRate: number;
  }[];
  lifeQrCode?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar: string;
  date: string;
  time: string;
  type: 'Consultation' | 'Follow-up' | 'Emergency' | 'Check-up';
  status: 'Scheduled' | 'Waiting' | 'Consulting' | 'Completed' | 'Cancelled' | 'Missed';
  reason: string;
  notes?: string;
  isWalkIn?: boolean;
  reminderStatus?: 'Sent' | 'Delivered' | 'Pending' | 'None';
  timeline?: {
    status: string;
    timestamp: string;
    description: string;
  }[];
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'alert' | 'appointment' | 'patient' | 'system';
  read: boolean;
}

export type Theme = 'light' | 'dark';

export type PageId = 'dashboard' | 'patients' | 'appointments' | 'analytics' | 'profile' | 'settings' | 'consultation' | 'lifeqr';
