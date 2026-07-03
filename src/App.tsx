/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PageId, Doctor, Patient, Appointment, Notification, Theme } from './types';
import { mockDoctor, mockPatients, mockAppointments, mockNotifications } from './mockData';

// Component imports
import SplashScreen from './components/SplashScreen';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import NotificationCenter from './components/NotificationCenter';

// Page imports
import DashboardPage from './pages/DashboardPage';
import PatientsPage from './pages/PatientsPage';
import AppointmentsPage from './pages/AppointmentsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import ConsultationPage from './pages/ConsultationPage';
import LifeQrPage from './pages/LifeQrPage';

export default function App() {
  // Splash and Session states
  const [showSplash, setShowSplash] = useState(true);
  const [authenticatedDoctor, setAuthenticatedDoctor] = useState<Doctor | null>(null);

  // App-wide Centralized Core Data States
  const [doctor, setDoctor] = useState<Doctor>(mockDoctor);
  const [patients, setPatients] = useState<Patient[]>(mockPatients);
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  // UI Navigation states
  const [currentPageId, setCurrentPageId] = useState<PageId>('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [theme, setTheme] = useState<Theme>('light');
  const [autoStartConsultation, setAutoStartConsultation] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCenterOpen, setNotificationCenterOpen] = useState(false);

  // Clear autoStartConsultation when navigating away or switching pages
  useEffect(() => {
    if (currentPageId !== 'consultation') {
      setAutoStartConsultation(false);
    }
  }, [currentPageId]);

  // Theme Sync effect (Applies Class to Root Document)
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    localStorage.setItem('doco-theme', 'light');
  }, []);

  // Handle light/dark toggle (Always keep as light mode)
  const handleThemeToggle = () => {
    setTheme('light');
  };

  // Reset sandbox databases
  const handleResetDemoData = () => {
    setPatients(mockPatients);
    setAppointments(mockAppointments);
    setNotifications(mockNotifications);
    setDoctor(mockDoctor);
    setSelectedPatient(null);
  };

  // Handle fast navigation to specific patient diagnostic files (Deep linking)
  const handleSelectPatientAndNavigate = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentPageId('patients');
  };

  const handleLoginSuccess = (docSession: Doctor) => {
    setAuthenticatedDoctor(docSession);
    setDoctor(docSession);
  };

  const handleSignOut = () => {
    setAuthenticatedDoctor(null);
    setCurrentPageId('dashboard');
  };

  // Render the current active Page Component
  const renderActivePage = () => {
    switch (currentPageId) {
      case 'dashboard':
        return (
          <DashboardPage
            onNavigate={(page) => setCurrentPageId(page as PageId)}
            onSelectPatient={handleSelectPatientAndNavigate}
            onStartConsultation={(patient, autoRecord = false) => {
              setSelectedPatient(patient);
              setAutoStartConsultation(autoRecord);
              setCurrentPageId('consultation');
            }}
            appointments={appointments}
            setAppointments={setAppointments}
          />
        );
      case 'patients':
        return (
          <PatientsPage
            patients={patients}
            setPatients={setPatients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            onNavigate={(page) => setCurrentPageId(page as PageId)}
          />
        );
      case 'consultation':
        return (
          <ConsultationPage
            patients={patients}
            setPatients={setPatients}
            selectedPatient={selectedPatient}
            setSelectedPatient={setSelectedPatient}
            onNavigate={(page) => setCurrentPageId(page as PageId)}
            autoStartRecording={autoStartConsultation}
          />
        );
      case 'lifeqr':
        return (
          <LifeQrPage
            patients={patients}
            onNavigateToPatient={handleSelectPatientAndNavigate}
          />
        );
      case 'appointments':
        return (
          <AppointmentsPage
            appointments={appointments}
            setAppointments={setAppointments}
            onNavigateToPatient={handleSelectPatientAndNavigate}
          />
        );
      case 'analytics':
        return <AnalyticsPage />;
      case 'profile':
        return <ProfilePage doctor={doctor} setDoctor={setDoctor} />;
      case 'settings':
        return (
          <SettingsPage
            theme={theme}
            onThemeToggle={handleThemeToggle}
            onResetDemoData={handleResetDemoData}
          />
        );
      default:
        return (
          <div className="text-center py-12 dark:text-slate-200">
            Page under active construction.
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
      <AnimatePresence mode="wait">
        {/* Step 1: Splash Screen Loader */}
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : !authenticatedDoctor ? (
          /* Step 2: Authentication Gate */
          <Login key="login" onLoginSuccess={handleLoginSuccess} />
        ) : (
          /* Step 3: Main Dashboard Workspace Layout */
          <div key="workspace" className="flex min-h-screen relative">
            
            {/* Left Drawer Navigation */}
            <Sidebar
              currentPageId={currentPageId}
              onPageChange={setCurrentPageId}
              doctor={doctor}
              onSignOut={handleSignOut}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />

            {/* Right Pane: Header + Content Panel */}
            <div className="flex-1 flex flex-col min-w-0">
              <Header
                currentPageId={currentPageId}
                onPageChange={setCurrentPageId}
                doctor={doctor}
                setDoctor={setDoctor}
                theme={theme}
                onThemeToggle={handleThemeToggle}
                onSignOut={handleSignOut}
                onNotificationToggle={() => setNotificationCenterOpen(!notificationCenterOpen)}
                notifications={notifications}
                onMenuToggle={() => setMobileMenuOpen(true)}
              />

              {/* Main Content Pane wrapper with page entrance fade */}
              <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
                <motion.div
                  key={currentPageId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                >
                  {renderActivePage()}
                </motion.div>
              </main>
            </div>

            {/* Slide over Alerts Popover panel */}
            <NotificationCenter
              isOpen={notificationCenterOpen}
              onClose={() => setNotificationCenterOpen(false)}
              notifications={notifications}
              setNotifications={setNotifications}
            />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
